import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { items, customerInfo, sustainabilityLevel, totalSavings } = req.body;

      // Basic validation
      if (!items || !customerInfo || !sustainabilityLevel) {
        return res.status(400).json({ error: 'Missing required checkout data.' });
      }

      // Create line items for Stripe Checkout
      const line_items = items.map((item: any) => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
            description: item.description,
            metadata: {
              service_id: item.id,
              category: item.category || 'Uncategorized',
            },
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


      // Create a Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment', // Use 'subscription' for recurring payments
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/checkout`,
        customer_email: customerInfo.email,
        metadata: {
          customer_name: customerInfo.name,
          company: customerInfo.company || '',
          sustainability_level: sustainabilityLevel.name,
          discount_applied: `${sustainabilityLevel.discount}%`,
          total_savings: totalSavings.toFixed(2),
        },
        billing_address_collection: 'required',
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Internal server error';
      console.error('Stripe checkout error:', errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
