# Superfly Commerce - Stripe Integration

This application includes Stripe and Coinbase Commerce payment integration with manual contract signing via email/DocuSign.

## Features

- **Manual Contract Process**: Customers request contracts via email with pre-filled details
- **DocuSign Integration**: Send contracts via DocuSign or email for professional signing
- **Stripe Integration**: Secure card payments via Stripe
- **Crypto Payments**: Cryptocurrency payments via Coinbase Commerce
- **Sustainability Pricing**: Sliding scale pricing based on sustainability practices
- **Three Service Tiers**: PPC Management, Account Management, and Full Growth Suite

## Setup Instructions

### 1. Stripe Configuration

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Create your environment variables:

```bash
cp .env.example .env
```

4. Update `.env` with your Stripe keys:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
```

### 2. Coinbase Commerce Configuration

1. Create a Coinbase Commerce account at [commerce.coinbase.com](https://commerce.coinbase.com)
2. Get your API key from the Settings page
3. Add to your `.env` file:
```
VITE_COINBASE_COMMERCE_API_KEY=your_coinbase_api_key
```

### 2. Create Stripe Products and Prices

In your Stripe Dashboard, create three products with recurring prices:

1. **Amazon PPC Management** - £800/month (base price)
2. **Amazon Account Management** - £1200/month (base price)  
3. **Full Amazon Growth Suite** - £1500/month (base price)

Update the `priceId` values in `src/lib/stripe.ts` with your actual Stripe price IDs.

### 3. Backend Implementation

The frontend is ready, but you'll need to implement the backend API endpoints:

- `POST /api/create-subscription` - Creates Stripe subscription
- `POST /api/coinbase/create-charge` - Creates Coinbase Commerce charge
- `POST /api/create-checkout-session` - Creates Stripe checkout session
- `POST /webhook` - Handles Stripe webhooks
- `POST /api/coinbase/webhook` - Handles Coinbase Commerce webhooks

See `src/api/stripe.ts` for example backend implementation.

### 4. Manual Contract Workflow

The application includes a streamlined contract workflow:

1. **Customer selects service tier** and sustainability level
2. **Email generated** with pre-filled contract request details
3. **Manual contract sending** via DocuSign or email
4. **Customer signs contract** through DocuSign
5. **Payment link sent** after contract completion
6. **Stripe subscription activated** after successful payment

### 5. Contract Management Process

Your manual process will involve:
- Receiving contract requests via email
- Sending DocuSign contracts with proper terms
- Tracking signed contracts
- Sending Stripe payment links to approved customers
- Managing active subscriptions through Stripe Dashboard

## Sustainability Pricing Tiers

The application includes four sustainability levels with automatic discounts:

1. **Getting Started** - 0% discount
2. **Conscious Brand** - 15% discount  
3. **Impact Leader** - 25% discount
4. **Planet Champion** - 40% discount

## Security Considerations

- All payment processing handled by Stripe (PCI compliant)
- Digital signatures for contract acceptance
- Webhook signature verification required
- Environment variables for sensitive data

## Testing

Use Stripe's test mode and test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## Deployment

1. Set production environment variables
2. Update Stripe webhook endpoints
3. Deploy backend API
4. Configure domain and SSL

## Support

For questions about the Stripe integration, contact the development team or refer to [Stripe's documentation](https://stripe.com/docs).