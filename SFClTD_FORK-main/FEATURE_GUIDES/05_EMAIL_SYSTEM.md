# Email System Implementation Guide

## Overview
Implement a comprehensive email system for all automated communications, including transactional emails, notifications, and marketing communications.

## Current Status
- ✅ Email templates designed in components
- ✅ Email sending logic outlined
- ❌ No email service integration
- ❌ No template management system
- ❌ No automated email workflows

## Required Email Types

### 1. Transactional Emails
- Contact form confirmations
- Payment confirmations
- Verification submissions
- Service activation notifications

### 2. Admin Notifications
- New contact form submissions
- Payment received alerts
- Verification requests
- System alerts

### 3. Marketing Emails
- Newsletter welcome series
- Service updates
- Educational content

## Recommended Email Services

### Option 1: SendGrid (Recommended)
**Cost**: Free tier (100 emails/day), $15/month for 40k emails
**Pros**: Excellent deliverability, good templates, comprehensive API

### Option 2: Mailgun
**Cost**: Free tier (5k emails/month), $35/month for 50k emails
**Pros**: Developer-friendly, good for transactional emails

### Option 3: Resend
**Cost**: Free tier (3k emails/month), $20/month for 50k emails
**Pros**: Modern API, React email templates, good developer experience

## Implementation Guide (SendGrid)

### 1. SendGrid Setup
```bash
# 1. Create SendGrid account
# 2. Verify sender identity (domain or single sender)
# 3. Create API key with Mail Send permissions
# 4. Set up domain authentication (recommended)
```

### 2. Environment Variables
```env
SENDGRID_API_KEY=SG.your_api_key_here
FROM_EMAIL=noreply@superflycommerce.com
FROM_NAME=Superfly Commerce
ADMIN_EMAIL=harry@superflycommerce.com
```

### 3. Email Service Module
```javascript
// lib/emailService.js
const sgMail = require('@sendgrid/mail');

class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.fromEmail = process.env.FROM_EMAIL;
    this.fromName = process.env.FROM_NAME;
    this.adminEmail = process.env.ADMIN_EMAIL;
  }

  async sendEmail({ to, subject, html, text, templateId, dynamicTemplateData }) {
    try {
      const msg = {
        to,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject,
        html,
        text
      };

      // Use dynamic template if provided
      if (templateId) {
        msg.templateId = templateId;
        msg.dynamicTemplateData = dynamicTemplateData;
        delete msg.html;
        delete msg.text;
        delete msg.subject;
      }

      const response = await sgMail.send(msg);
      console.log('Email sent successfully:', response[0].statusCode);
      return response;
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }

  async sendBulkEmail(emails) {
    try {
      const response = await sgMail.send(emails);
      console.log('Bulk emails sent successfully');
      return response;
    } catch (error) {
      console.error('Bulk email sending error:', error);
      throw error;
    }
  }

  // Contact form confirmation
  async sendContactConfirmation(contactData) {
    const subject = 'Thank you for contacting Superfly Commerce';
    const html = this.generateContactConfirmationHTML(contactData);
    
    return await this.sendEmail({
      to: contactData.email,
      subject,
      html
    });
  }

  // Admin notification for new contact
  async sendContactNotification(contactData) {
    const subject = `🚀 New Contact Form Submission - ${contactData.service || 'General Inquiry'}`;
    const html = this.generateContactNotificationHTML(contactData);
    
    return await this.sendEmail({
      to: this.adminEmail,
      subject,
      html
    });
  }

  // Payment confirmation
  async sendPaymentConfirmation(paymentData) {
    const subject = 'Payment Confirmation - Superfly Commerce';
    const html = this.generatePaymentConfirmationHTML(paymentData);
    
    return await this.sendEmail({
      to: paymentData.customerEmail,
      subject,
      html
    });
  }

  // Verification submission confirmation
  async sendVerificationConfirmation(verificationData) {
    const subject = `Sustainability Verification Submitted - Level ${verificationData.targetLevel}`;
    const html = this.generateVerificationConfirmationHTML(verificationData);
    
    return await this.sendEmail({
      to: verificationData.email,
      subject,
      html
    });
  }

  // Newsletter welcome email
  async sendNewsletterWelcome(email) {
    const subject = 'Welcome to Superfly Commerce Newsletter! 🌱';
    const html = this.generateNewsletterWelcomeHTML(email);
    
    return await this.sendEmail({
      to: email,
      subject,
      html
    });
  }

  generateContactConfirmationHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for contacting us</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Reaching Out!</h1>
            <p>We've received your message and will respond within 24 hours</p>
          </div>
          <div class="content">
            <p>Hi ${data.name},</p>
            <p>Thank you for contacting Superfly Commerce! We're excited to learn about your Amazon growth goals.</p>
            
            <h3>What you can expect:</h3>
            <ul>
              <li>📞 Personal response within 24 hours</li>
              <li>🎯 Custom proposal tailored to your needs</li>
              <li>💚 Sustainability discount assessment</li>
              <li>🤝 Performance-based partnership options</li>
            </ul>
            
            <p>While you wait, feel free to:</p>
            <p>
              <a href="https://superflycommerce.com/pricing" class="button">View Our Transparent Pricing</a>
              <a href="https://superflycommerce.com/collective" class="button">Meet Our Specialists</a>
            </p>
            
            <p>We're looking forward to helping you grow sustainably on Amazon!</p>
            
            <p>Best regards,<br>
            <strong>The Superfly Commerce Collective</strong><br>
            Remote-first, globally-driven marketing collective</p>
          </div>
          <div class="footer">
            <p>Superfly Commerce | Making Amazon fairer, greener, and smarter</p>
            <p>10% of profits donated to Amazon Frontlines & Amnesty International</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateContactNotificationHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; }
          .field { margin-bottom: 15px; padding: 10px; background: white; border-left: 4px solid #10b981; }
          .label { font-weight: bold; color: #374151; }
          .value { margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 New Contact Form Submission</h1>
            <p>Received: ${new Date().toLocaleString()}</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            <div class="field">
              <div class="label">Company:</div>
              <div class="value">${data.company || 'Not provided'}</div>
            </div>
            <div class="field">
              <div class="label">Monthly Revenue:</div>
              <div class="value">${data.revenue || 'Not specified'}</div>
            </div>
            <div class="field">
              <div class="label">Service Interest:</div>
              <div class="value">${data.service || 'General inquiry'}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${data.message || 'No message provided'}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generatePaymentConfirmationHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Confirmation</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-icon { font-size: 48px; margin-bottom: 20px; }
          .amount { font-size: 32px; font-weight: bold; color: #10b981; margin: 20px 0; }
          .items { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .next-steps { background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>Payment Confirmed!</h1>
            <p>Your order has been successfully processed</p>
          </div>
          <div class="content">
            <p>Hi ${data.customerName},</p>
            <p>Thank you for choosing Superfly Commerce! Your payment has been successfully processed.</p>
            
            <div class="amount">Total Paid: £${data.amount}</div>
            
            <div class="items">
              <h3>Order Details:</h3>
              ${data.items.map(item => `
                <div class="item">
                  <span>${item.name} (x${item.quantity})</span>
                  <span>£${item.price * item.quantity}</span>
                </div>
              `).join('')}
            </div>
            
            <div class="next-steps">
              <h3>What happens next:</h3>
              <ol>
                <li>Our team will contact you within 24 hours</li>
                <li>We'll schedule your project kickoff call</li>
                <li>Services begin immediately after kickoff</li>
                <li>You'll receive regular progress updates</li>
              </ol>
            </div>
            
            <p><strong>Order Reference:</strong> ${data.orderId}</p>
            <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <p>Questions? Reply to this email or contact us at harry@superflycommerce.com</p>
            
            <p>Best regards,<br>
            <strong>The Superfly Commerce Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
```

### 4. Integration with Forms

#### Update Contact Form Handler
```javascript
const emailService = require('../lib/emailService');

app.post('/api/contact', async (req, res) => {
  try {
    const contactData = req.body;
    
    // Save to database
    const contact = await db.contacts.create(contactData);
    
    // Send confirmation to customer
    await emailService.sendContactConfirmation(contactData);
    
    // Send notification to admin
    await emailService.sendContactNotification(contactData);
    
    // Add to CRM
    await hubspot.createContact(contactData);
    
    res.json({ success: true, id: contact.id });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});
```

### 5. Newsletter System

#### Newsletter Signup
```javascript
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Add to database
    await db.newsletter.create({
      email,
      subscribed_at: new Date(),
      status: 'active'
    });
    
    // Send welcome email
    await emailService.sendNewsletterWelcome(email);
    
    // Add to SendGrid contacts for marketing
    await addToSendGridContacts(email);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

const addToSendGridContacts = async (email) => {
  try {
    const data = {
      contacts: [{
        email: email,
        custom_fields: {
          source: 'website_newsletter',
          subscribed_date: new Date().toISOString()
        }
      }]
    };
    
    await sgMail.request({
      method: 'PUT',
      url: '/v3/marketing/contacts',
      body: data
    });
  } catch (error) {
    console.error('SendGrid contact addition error:', error);
  }
};
```

### 6. Email Templates Management

#### Dynamic Templates (SendGrid)
```javascript
// Create templates in SendGrid dashboard
const EMAIL_TEMPLATES = {
  CONTACT_CONFIRMATION: 'd-1234567890abcdef',
  PAYMENT_CONFIRMATION: 'd-abcdef1234567890',
  VERIFICATION_SUBMITTED: 'd-567890abcdef1234',
  NEWSLETTER_WELCOME: 'd-cdef1234567890ab'
};

// Use dynamic template
await emailService.sendEmail({
  to: customerEmail,
  templateId: EMAIL_TEMPLATES.PAYMENT_CONFIRMATION,
  dynamicTemplateData: {
    customer_name: customerName,
    order_total: orderTotal,
    order_items: orderItems,
    order_id: orderId
  }
});
```

### 7. Email Analytics and Tracking

#### Webhook for Email Events
```javascript
// POST /api/sendgrid/webhook
app.post('/api/sendgrid/webhook', (req, res) => {
  const events = req.body;
  
  events.forEach(async (event) => {
    try {
      await db.email_events.create({
        email: event.email,
        event_type: event.event,
        timestamp: new Date(event.timestamp * 1000),
        message_id: event.sg_message_id,
        reason: event.reason || null,
        url: event.url || null
      });
      
      // Handle specific events
      switch (event.event) {
        case 'bounce':
        case 'dropped':
          // Mark email as invalid
          await markEmailAsInvalid(event.email);
          break;
        case 'unsubscribe':
          // Handle unsubscribe
          await handleUnsubscribe(event.email);
          break;
      }
    } catch (error) {
      console.error('Email event processing error:', error);
    }
  });
  
  res.status(200).send('OK');
});
```

### 8. Email Queue System (Optional)

#### Using Bull Queue
```javascript
const Queue = require('bull');
const emailQueue = new Queue('email processing');

// Add email to queue
const sendEmailQueued = async (emailData) => {
  await emailQueue.add('send-email', emailData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
};

// Process email queue
emailQueue.process('send-email', async (job) => {
  const { to, subject, html, templateId, dynamicTemplateData } = job.data;
  
  return await emailService.sendEmail({
    to, subject, html, templateId, dynamicTemplateData
  });
});
```

## Implementation Checklist
- [ ] Choose email service provider (SendGrid recommended)
- [ ] Set up email service account and verify domain
- [ ] Create email service module
- [ ] Design and implement email templates
- [ ] Integrate with all form submissions
- [ ] Set up newsletter system
- [ ] Implement email analytics tracking
- [ ] Create email queue system (if needed)
- [ ] Test all email workflows
- [ ] Set up monitoring and error handling
- [ ] Configure email authentication (SPF, DKIM, DMARC)