import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { createHubspotContact } from '../../lib/hubspot.js'


const router = Router();

router.post('/create-custom-checkout', async (req: Request, res: Response) => {
// This should be loaded via dotenv in server.ts
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

try {
    const { items, customerInfo, sustainabilityLevel, totalSavings } = req.body;
    
    // Basic validation
    if (!items || !customerInfo || !sustainabilityLevel) {
        return res.status(400).json({ error: 'Missing required checkout data.' });
    }

        // --- HubSpot Integration ---
    // Create the contact in HubSpot as soon as the checkout process starts.
    // We split the name into first and last names for HubSpot.
    const nameParts = customerInfo.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    await createHubspotContact(customerInfo.email, firstName, lastName, customerInfo.company);
    // -------------------------
    
    // Create line items for Stripe Checkout
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: Math.round(item.price * 100), // Price in pence
      },
      quantity: item.quantity,
    }));

    // Add discount as a line item if applicable
    if (totalSavings > 0) {
        line_items.push({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: 'Sustainability Discount',
                    description: `${sustainabilityLevel.name} (${sustainabilityLevel.discount}%)`,
                },
                unit_amount: -Math.round(totalSavings * 100), // Negative amount for discount
            },
            quantity: 1,
        });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url:`${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:`${process.env.FRONTEND_URL}/checkout`,
      customer_email: customerInfo.email,
      metadata: {
        total_savings: totalSavings.toFixed(2),
      }
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    console.error('Stripe checkout error:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
