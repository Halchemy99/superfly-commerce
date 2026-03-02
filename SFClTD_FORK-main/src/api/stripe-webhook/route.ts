import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { sendReceiptEmail } from '../../lib/sendgrid.js';
import { supabaseAdmin } from '../../lib/supabaseAdmin.js';

const router = Router();

router.post('/stripe-webhook', async (req: Request, res: Response) => {
  // Init Stripe HERE, only when a request actually comes in
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
  });
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
// Handle the 'checkout.session.completed' event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    const customerDetails = {
      email: session.customer_details?.email!,
      name: session.customer_details?.name || 'Valued Customer',
    };

    // --- NEW: Save order to our database ---
    try {
      // 1. Find the user ID from their email
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', customerDetails.email)
        .single();
      
      if (userError && userError.code !== 'PGRST116') { // PGRST116 = 'No rows found'
        throw new Error(`Error fetching user: ${userError.message}`);
      }
      
      const userId = userData ? userData.id : null;

      // 2. Create the main order record
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: userId,
          customer_email: customerDetails.email,
          total_amount: session.amount_total! / 100, // Convert from cents
          currency: session.currency!,
          sustainability_level: session.metadata?.sustainability_level || null,
          total_savings: parseFloat(session.metadata?.total_savings || '0'),
          stripe_session_id: session.id
        })
        .select('id')
        .single();

      if (orderError) {
        throw new Error(`Error creating order: ${orderError.message}`);
      }

      const orderId = orderData.id;

      // 3. Create the order line items
      const orderItems = lineItems.data.map(item => ({
        order_id: orderId,
        service_name: item.description,
        quantity: item.quantity!,
        unit_price: item.price!.unit_amount! / 100 // Convert from cents
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw new Error(`Error creating order items: ${itemsError.message}`);
      }

      console.log(`✅ Successfully saved order ${orderId} to database.`);

    } catch (dbError: any) {
      console.error('❌ Database error during webhook processing:', dbError.message);
      // We don't return a 500 to Stripe, as we don't want it to retry this.
      // We still want to send the email.
    }
    // --- End of new database logic ---

    // Send receipt email (existing logic)
    await sendReceiptEmail(
        customerDetails, 
        lineItems.data, 
        session.amount_total!, 
        session.currency!
    );
  }

  // Acknowledge receipt of the event
  res.json({ received: true });
});

export default router;
