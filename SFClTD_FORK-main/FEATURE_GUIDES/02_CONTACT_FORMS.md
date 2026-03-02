# Contact Forms Implementation Guide

## Overview
Implement backend processing for all contact forms on the Superfly Commerce website, including email notifications and CRM integration.

## Current Status
- ✅ Contact form UI components built
- ✅ Form validation on frontend
- ❌ No backend form processing
- ❌ No email notifications
- ❌ No CRM integration

## Forms That Need Implementation

### 1. Main Contact Form (Homepage)
**Location**: `src/components/Contact.tsx`
**Fields**: name, email, company, revenue, service, message

### 2. Documentation Help Form
**Location**: `src/pages/DocumentationHelpPage.tsx`
**Fields**: name, email, company, currentLevel, targetLevel, message

### 3. Newsletter Signup
**Location**: `src/components/NewsletterSection.tsx`
**Fields**: email

### 4. TikTok Beta Application
**Location**: `src/pages/TikTokPage.tsx`
**Fields**: name, email, company, message

## Required Implementation

### 1. Backend API Endpoints

#### Contact Form Submission
```javascript
// POST /api/contact
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, revenue, service, message } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    // Save to database
    const contact = await db.contacts.create({
      name,
      email,
      company,
      revenue,
      service,
      message,
      type: 'contact',
      created_at: new Date()
    });
    
    // Send email notification
    await sendContactNotification({
      name,
      email,
      company,
      revenue,
      service,
      message
    });
    
    // Add to CRM
    await addToCRM({
      name,
      email,
      company,
      source: 'website_contact',
      service_interest: service
    });
    
    res.json({ success: true, id: contact.id });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});
```

#### Newsletter Signup
```javascript
// POST /api/newsletter
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    
    // Check if already subscribed
    const existing = await db.newsletter.findOne({ email });
    if (existing) {
      return res.json({ success: true, message: 'Already subscribed' });
    }
    
    // Add to newsletter
    await db.newsletter.create({
      email,
      subscribed_at: new Date(),
      status: 'active'
    });
    
    // Send welcome email
    await sendWelcomeEmail(email);
    
    // Add to CRM
    await addToCRM({
      email,
      source: 'newsletter_signup'
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});
```

#### Documentation Help Form
```javascript
// POST /api/documentation-help
app.post('/api/documentation-help', async (req, res) => {
  try {
    const { name, email, company, currentLevel, targetLevel, message } = req.body;
    
    // Save to database
    const request = await db.documentation_requests.create({
      name,
      email,
      company,
      current_level: currentLevel,
      target_level: targetLevel,
      message,
      status: 'pending',
      created_at: new Date()
    });
    
    // Send notification to admin
    await sendDocumentationRequest({
      name,
      email,
      company,
      currentLevel,
      targetLevel,
      message
    });
    
    // Add to CRM
    await addToCRM({
      name,
      email,
      company,
      source: 'documentation_help',
      sustainability_interest: targetLevel
    });
    
    res.json({ success: true, id: request.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit request' });
  }
});
```

### 2. Email Templates

#### Contact Form Notification
```javascript
const sendContactNotification = async (data) => {
  const subject = `🚀 New Contact Form Submission - ${data.service || 'General Inquiry'}`;
  
  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
    <p><strong>Revenue:</strong> ${data.revenue || 'Not specified'}</p>
    <p><strong>Service Interest:</strong> ${data.service || 'General inquiry'}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message || 'No message provided'}</p>
    <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
  `;
  
  await sendEmail({
    to: 'harry@superflycommerce.com',
    subject,
    html: htmlContent
  });
  
  // Send confirmation to customer
  await sendEmail({
    to: data.email,
    subject: 'Thank you for contacting Superfly Commerce',
    html: `
      <h2>Thank you for your inquiry!</h2>
      <p>Hi ${data.name},</p>
      <p>We've received your message and will get back to you within 24 hours.</p>
      <p>In the meantime, feel free to:</p>
      <ul>
        <li><a href="https://superflycommerce.com/pricing">View our transparent pricing</a></li>
        <li><a href="https://superflycommerce.com/collective">Meet our specialists</a></li>
        <li><a href="https://calendly.com/superflycommerce">Book a discovery call</a></li>
      </ul>
      <p>Best regards,<br>The Superfly Commerce Team</p>
    `
  });
};
```

### 3. Database Schema
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  revenue VARCHAR(100),
  service VARCHAR(255),
  message TEXT,
  type VARCHAR(50) DEFAULT 'contact',
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP
);

CREATE TABLE documentation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  current_level INTEGER,
  target_level INTEGER,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Frontend Updates

#### Update Contact Form
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      setFormData({ name: '', email: '', company: '', revenue: '', service: '', message: '' });
      alert('Thank you! We\'ll get back to you within 24 hours.');
    } else {
      throw new Error('Failed to submit form');
    }
  } catch (error) {
    alert('There was an error submitting your form. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

### 5. CRM Integration
```javascript
// HubSpot integration example
const addToCRM = async (contactData) => {
  const hubspotContact = {
    properties: {
      email: contactData.email,
      firstname: contactData.name?.split(' ')[0],
      lastname: contactData.name?.split(' ').slice(1).join(' '),
      company: contactData.company,
      hs_lead_status: 'NEW',
      lifecyclestage: 'lead',
      lead_source: contactData.source
    }
  };
  
  await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hubspotContact)
  });
};
```

## Implementation Checklist
- [ ] Create backend API endpoints for all forms
- [ ] Set up email service (SendGrid/Mailgun)
- [ ] Create email templates
- [ ] Set up database schema
- [ ] Integrate with CRM (HubSpot/Pipedrive)
- [ ] Update frontend form submissions
- [ ] Add form validation and error handling
- [ ] Test all form submissions
- [ ] Set up spam protection (reCAPTCHA)