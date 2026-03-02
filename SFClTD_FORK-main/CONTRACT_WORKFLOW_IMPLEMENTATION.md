# Contract & Payment Workflow Implementation Guide

## Overview
This document outlines the complete contract and payment workflow that needs to be implemented by the freelancer. The current website has all UI components but NO backend functionality.

## Current Workflow (What Users See)
1. **Customer selects services** → Adds to cart
2. **Clicks "Request Contract & Get Started"** → Opens email with pre-filled details
3. **Email sent to harry@superflycommerce.com** → Manual process begins
4. **DocuSign contract sent** → Customer signs digitally
5. **Stripe payment link sent** → Customer pays
6. **Services begin** → Project kickoff

## What Needs to Be Built (Complete Backend)

### 1. CONTRACT REQUEST SYSTEM
**Status: NOT IMPLEMENTED**

#### Required APIs:
```
POST /api/contract-request
- Receives cart data, customer info, sustainability level
- Stores in database
- Sends notification email to admin
- Generates unique contract ID
- Returns confirmation to customer
```

#### Database Schema:
```sql
CREATE TABLE contract_requests (
  id UUID PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  phone VARCHAR(50),
  cart_items JSONB NOT NULL,
  sustainability_level INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  total_savings DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- pending, contract_sent, signed, paid, active
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Email Templates:
- **Admin notification**: New contract request received
- **Customer confirmation**: Contract request submitted successfully

### 2. DOCUSIGN INTEGRATION
**Status: NOT IMPLEMENTED**

#### Required Setup:
- DocuSign Developer Account
- API credentials (Integration Key, Secret Key)
- Template creation for each service type
- Webhook endpoint for signature events

#### Required APIs:
```
POST /api/docusign/send-contract
- Creates DocuSign envelope
- Sends contract to customer
- Updates contract_requests status to 'contract_sent'
- Stores DocuSign envelope ID

POST /api/docusign/webhook
- Receives DocuSign events
- Updates contract status when signed
- Triggers payment link generation
```

#### DocuSign Templates Needed:
1. **Amazon PPC Management Contract**
2. **Amazon Account Management Contract**
3. **Full Amazon Growth Suite Contract**
4. **Custom Services Contract** (for mixed carts)

#### Implementation Steps:
```javascript
// 1. Create DocuSign envelope
const envelope = {
  emailSubject: `Contract for ${serviceName} - Superfly Commerce`,
  documents: [{
    documentBase64: contractPDF,
    name: 'Service Agreement',
    fileExtension: 'pdf',
    documentId: '1'
  }],
  recipients: {
    signers: [{
      email: customerEmail,
      name: customerName,
      recipientId: '1',
      tabs: {
        signHereTabs: [{ documentId: '1', pageNumber: '1' }],
        textTabs: [
          { tabLabel: 'CustomerName', value: customerName },
          { tabLabel: 'ServiceDetails', value: serviceDetails },
          { tabLabel: 'TotalAmount', value: totalAmount }
        ]
      }
    }]
  },
  status: 'sent'
};

// 2. Send via DocuSign API
const result = await docusignApi.createEnvelope(envelope);
```

### 3. STRIPE PAYMENT INTEGRATION
**Status: NOT IMPLEMENTED**

#### Required Setup:
- Stripe account with API keys
- Webhook endpoint configuration
- Payment link generation
- Subscription management (for ongoing services)

#### Required APIs:
```
POST /api/stripe/create-payment-link
- Creates Stripe payment link after contract signing
- Sends email with secure payment link
- Links payment to contract ID

POST /api/stripe/webhook
- Handles payment success/failure events
- Updates contract status to 'paid'
- Triggers service activation
- Sends confirmation emails

GET /api/stripe/payment-status/:contractId
- Checks payment status for a contract
- Returns payment details
```

#### Payment Link Creation:
```javascript
// After contract is signed, create payment link
const paymentLink = await stripe.paymentLinks.create({
  line_items: cartItems.map(item => ({
    price_data: {
      currency: 'gbp',
      product_data: {
        name: item.name,
        description: item.description,
        metadata: {
          contract_id: contractId,
          service_id: item.id
        }
      },
      unit_amount: Math.round(item.price * 100), // Convert to pence
    },
    quantity: item.quantity,
  })),
  metadata: {
    contract_id: contractId,
    customer_email: customerEmail,
    sustainability_level: sustainabilityLevel
  },
  after_completion: {
    type: 'redirect',
    redirect: {
      url: `${process.env.FRONTEND_URL}/success?contract_id=${contractId}`
    }
  }
});
```

### 4. AUTOMATED EMAIL SYSTEM
**Status: NOT IMPLEMENTED**

#### Required Email Templates:
1. **Contract Request Confirmation** (to customer)
2. **New Contract Request** (to admin)
3. **Contract Sent Notification** (to customer)
4. **Payment Link** (to customer after signing)
5. **Payment Confirmation** (to customer)
6. **Service Activation** (to customer)
7. **Project Kickoff** (to customer)

#### Email Service Setup:
- SendGrid, Mailgun, or AWS SES
- Template management
- Automated sending based on workflow status

### 5. ADMIN DASHBOARD
**Status: NOT IMPLEMENTED**

#### Required Features:
- View all contract requests
- Send DocuSign contracts
- Track contract status
- Generate payment links
- Manage active projects
- Customer communication

#### Admin Dashboard Pages:
```
/admin/contracts - List all contract requests
/admin/contracts/:id - Individual contract details
/admin/customers - Customer management
/admin/services - Service catalog management
/admin/settings - DocuSign/Stripe configuration
```

### 6. CUSTOMER PORTAL
**Status: NOT IMPLEMENTED**

#### Required Features:
- Contract status tracking
- Payment history
- Service details
- Project communication
- Document downloads

## COMPLETE IMPLEMENTATION WORKFLOW

### Phase 1: Database & Basic APIs (Week 1)
1. Set up PostgreSQL database
2. Create contract_requests table
3. Build basic CRUD APIs
4. Set up email service
5. Implement contract request submission

### Phase 2: DocuSign Integration (Week 2)
1. Set up DocuSign developer account
2. Create contract templates
3. Build DocuSign API integration
4. Implement contract sending
5. Set up signature webhooks

### Phase 3: Stripe Integration (Week 3)
1. Set up Stripe account
2. Build payment link generation
3. Implement Stripe webhooks
4. Connect payments to contracts
5. Add payment confirmation flow

### Phase 4: Admin Dashboard (Week 4)
1. Build admin authentication
2. Create contract management interface
3. Add DocuSign controls
4. Implement payment tracking
5. Add customer communication tools

### Phase 5: Customer Portal (Week 5)
1. Build customer authentication
2. Create status tracking interface
3. Add payment history
4. Implement document access
5. Add communication features

### Phase 6: Testing & Deployment (Week 6)
1. End-to-end workflow testing
2. Payment processing tests
3. Email delivery verification
4. Security audit
5. Production deployment

## TECHNICAL REQUIREMENTS

### Backend Stack:
- **Node.js/Express** or **Next.js API routes**
- **PostgreSQL** database
- **DocuSign eSignature API**
- **Stripe Payment Links API**
- **SendGrid/Mailgun** for emails
- **JWT** for authentication
- **AWS S3** for document storage

### Environment Variables:
```
# Database
DATABASE_URL=postgresql://...

# DocuSign
DOCUSIGN_INTEGRATION_KEY=
DOCUSIGN_SECRET_KEY=
DOCUSIGN_USER_ID=
DOCUSIGN_ACCOUNT_ID=
DOCUSIGN_BASE_PATH=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
SENDGRID_API_KEY=
FROM_EMAIL=

# App
JWT_SECRET=
FRONTEND_URL=
ADMIN_EMAIL=harry@superflycommerce.com
```

### Security Considerations:
- Webhook signature verification (DocuSign & Stripe)
- JWT token authentication
- Input validation and sanitization
- Rate limiting on APIs
- HTTPS enforcement
- Database encryption

## TESTING CHECKLIST

### Contract Workflow:
- [ ] Customer submits contract request
- [ ] Admin receives notification email
- [ ] DocuSign contract sent successfully
- [ ] Customer receives contract email
- [ ] Contract signing process works
- [ ] Signature webhook triggers payment link
- [ ] Customer receives payment link email
- [ ] Payment processing works
- [ ] Payment webhook updates status
- [ ] Service activation email sent
- [ ] Admin dashboard shows correct status

### Error Handling:
- [ ] Failed DocuSign sending
- [ ] Payment failures
- [ ] Webhook failures
- [ ] Email delivery failures
- [ ] Database connection issues

### Edge Cases:
- [ ] Multiple services in one contract
- [ ] Sustainability discount calculations
- [ ] Currency conversion handling
- [ ] Duplicate submissions
- [ ] Expired payment links

## SUCCESS METRICS

### Functional Requirements:
- 100% of contract requests processed automatically
- DocuSign integration working with <5% failure rate
- Payment processing with <2% failure rate
- Email delivery rate >98%
- Admin dashboard fully functional
- Customer portal accessible

### Performance Requirements:
- Contract request processing <2 seconds
- DocuSign sending <10 seconds
- Payment link generation <5 seconds
- Admin dashboard load time <3 seconds
- Email delivery <1 minute

## MAINTENANCE & UPDATES

### Regular Tasks:
- Update currency exchange rates
- Monitor webhook failures
- Review failed payments
- Update contract templates
- Security patches

### Monthly Reviews:
- Payment processing metrics
- Contract completion rates
- Customer satisfaction scores
- System performance analysis

---

## CRITICAL NOTES FOR FREELANCER

1. **NO BACKEND EXISTS** - Everything must be built from scratch
2. **UI IS COMPLETE** - Focus only on backend functionality
3. **WORKFLOW IS DEFINED** - Follow the exact 4-step process
4. **SECURITY IS CRITICAL** - Proper webhook verification required
5. **TESTING IS MANDATORY** - Full end-to-end testing needed

This is a complete business-critical workflow that handles real contracts and payments. Quality and reliability are non-negotiable.