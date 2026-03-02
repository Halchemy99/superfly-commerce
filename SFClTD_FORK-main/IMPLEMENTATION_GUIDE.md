# Manual Contract Implementation Guide

## Overview
This guide shows you how to implement the manual email/DocuSign contract system that's already built into your Superfly Commerce website.

## How It Currently Works

### 1. Customer Journey
1. Customer visits your pricing page or services cart
2. Selects their sustainability level (affects discount)
3. Chooses service tier or builds custom package
4. Clicks "Request Contract & Get Started"
5. Pre-filled email opens with all details
6. Email is sent to harry@superflycommerce.com

### 2. What You Receive
When a customer requests a contract, you'll get an email like this:

```
Subject: Contract Request - Amazon PPC Management

Hi Superfly Commerce Team,

I'm interested in the Amazon PPC Management package and would like to proceed with the contract signing process.

Package Details:
- Service: Amazon PPC Management
- Sustainability Level: Conscious Brand (15% discount)
- Monthly Investment: £680/month
- Original Price: £800/month
- Total Savings: £120/month

Please send me the contract via DocuSign or email for review and signing.

Best regards
```

## Implementation Steps

### Step 1: Set Up DocuSign Account
1. Create account at [docusign.com](https://www.docusign.com)
2. Create contract templates for each service tier
3. Set up automated workflows

### Step 2: Create Contract Templates
Create three main contract templates:

**Template 1: Amazon PPC Management**
- Monthly fee: £800 (before sustainability discount)
- Services included: Campaign optimization, keyword research, etc.
- Terms: 30-day notice, monthly billing

**Template 2: Amazon Account Management** 
- Monthly fee: £1200 (before sustainability discount)
- Services included: Complete account oversight, listing optimization, etc.
- Terms: 30-day notice, monthly billing

**Template 3: Full Amazon Growth Suite**
- Monthly fee: £1500 (before sustainability discount)
- Services included: Everything + global expansion, sustainability roadmap
- Terms: 30-day notice, monthly billing

### Step 3: Your Manual Process

#### When You Receive a Contract Request:

1. **Review the email** with customer details and selected package
2. **Calculate final price** using their sustainability level discount
3. **Send DocuSign contract** with correct pricing and terms
4. **Wait for signature** (DocuSign will notify you)
5. **Send Stripe payment link** after contract is signed
6. **Activate services** once payment is received

#### Sample Response Email:
```
Hi [Customer Name],

Thank you for your interest in our [Service Name] package!

I've reviewed your request and prepared your contract with the following details:
- Service: [Service Name]
- Sustainability Level: [Level] ([X]% discount applied)
- Monthly Investment: £[Final Price]/month
- Savings: £[Discount Amount]/month

I'm sending you the contract via DocuSign now. Please review and sign at your convenience.

Once signed, I'll send you a secure payment link to set up your monthly subscription.

Looking forward to working with you!

Best regards,
Harry
Superfly Commerce
```

### Step 4: Set Up Stripe Payment Links

In your Stripe Dashboard:
1. Go to Payment Links
2. Create links for each service tier at different price points
3. Use these links after contracts are signed

Example payment links needed:
- PPC Management: £800, £680 (15% off), £600 (25% off), £480 (40% off)
- Account Management: £1200, £1020 (15% off), £900 (25% off), £720 (40% off)
- Full Suite: £1500, £1275 (15% off), £1125 (25% off), £900 (40% off)

### Step 5: Track Contracts

Create a simple spreadsheet to track:
- Customer name & email
- Service requested
- Sustainability level & discount
- Contract sent date
- Contract signed date
- Payment link sent date
- Subscription active date

## Benefits of This System

✅ **Full Control**: You review every contract personally
✅ **Professional**: DocuSign provides legal compliance
✅ **Flexible**: Can customize terms for each client
✅ **Personal Touch**: Direct communication builds trust
✅ **Legal Protection**: Proper contract management

## Testing the System

1. Go to your live site: https://superfly-commerce.com
2. Navigate to the pricing section
3. Select a service tier and sustainability level
4. Click "Request Contract & Get Started"
5. Check that the email opens with correct details
6. Verify all pricing calculations are accurate

## Next Steps

1. **Set up DocuSign account** and create templates
2. **Create Stripe payment links** for all price combinations
3. **Test the email flow** to ensure it works properly
4. **Create your tracking spreadsheet**
5. **Prepare response email templates**

The system is already fully implemented on your website - you just need to set up the backend processes (DocuSign, Stripe payment links, and tracking) to handle the contracts that come in!