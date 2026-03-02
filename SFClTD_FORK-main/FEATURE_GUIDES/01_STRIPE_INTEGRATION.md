# Stripe Payment Integration Guide

## Overview
Implement complete Stripe payment processing for the Superfly Commerce website, including one-time payments, subscriptions, and webhook handling.

## Current Status
- ✅ Frontend cart system with localStorage
- ✅ Pricing calculations with sustainability discounts
- ❌ No backend payment processing
- ❌ No Stripe integration

## Required Implementation

### 1. Stripe Account Setup
```bash
# Create Stripe account at stripe.com
# Get API keys from Dashboard > Developers > API keys
# Set up webhook endpoints
```

### 2. Environment Variables
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Backend API Endpoints

#### Create Checkout Session
```javascript
// POST /api/stripe/create-checkout-session
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { items, customerInfo, sustainabilityLevel } = req.body;
    
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          description: item.description,
          metadata: {
            service_id: item.id,
            sustainability_level: sustainabilityLevel.name
          }
        },
        unit_amount: Math.round(item.price * 100), // Convert to pence
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      customer_email: customerInfo.email,
      metadata: {
        customer_name: customerInfo.name,
        company: customerInfo.company || '',
        sustainability_level: sustainabilityLevel.name
      }
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

#### Webhook Handler
```javascript
// POST /api/stripe/webhook
app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Handle successful payment
      handleSuccessfulPayment(session);
      break;
    case 'payment_intent.succeeded':
      // Handle payment confirmation
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});
```

### 4. Frontend Integration

#### Update CheckoutModal Component
```javascript
const handleCheckout = async (e) => {
  e.preventDefault();
  setIsProcessing(true);

  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: cartItems,
        customerInfo,
        sustainabilityLevel
      }),
    });

    const { sessionId } = await response.json();
    
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      setError(error.message);
    }
  } catch (err) {
    setError('Payment processing failed');
  } finally {
    setIsProcessing(false);
  }
};
```

### 5. Database Schema
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id VARCHAR(255) UNIQUE,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  sustainability_level INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Testing
```javascript
// Test with Stripe test cards
// Success: 4242 4242 4242 4242
// Decline: 4000 0000 0000 0002
// 3D Secure: 4000 0000 0000 3220
```

## Implementation Checklist
- [ ] Set up Stripe account and get API keys
- [ ] Create backend API endpoints
- [ ] Implement webhook handling
- [ ] Update frontend checkout flow
- [ ] Set up database schema
- [ ] Test with Stripe test cards
- [ ] Configure production webhooks
- [ ] Add error handling and logging