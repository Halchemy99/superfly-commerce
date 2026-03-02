# CRM Integration Guide

## Overview
Integrate a Customer Relationship Management (CRM) system to automatically capture leads from all website forms and track customer interactions.

## Current Status
- ✅ Multiple contact forms collecting lead data
- ✅ Customer information captured in forms
- ❌ No CRM integration
- ❌ No lead tracking system
- ❌ No automated follow-up workflows

## Recommended CRM Solutions

### Option 1: HubSpot (Recommended)
**Cost**: Free tier available
**Pros**: 
- Comprehensive free tier
- Excellent API documentation
- Built-in email marketing
- Advanced automation features

### Option 2: Pipedrive
**Cost**: ~$15/month
**Pros**:
- Simple pipeline management
- Good API
- Affordable pricing

### Option 3: Airtable
**Cost**: Free tier available
**Pros**:
- Flexible database structure
- Easy to customize
- Good for small teams

## Implementation Guide (HubSpot)

### 1. HubSpot Setup
```bash
# 1. Create HubSpot account at hubspot.com
# 2. Go to Settings > Integrations > API Key
# 3. Generate private app with required scopes:
#    - crm.objects.contacts.write
#    - crm.objects.contacts.read
#    - crm.objects.deals.write
```

### 2. Environment Variables
```env
HUBSPOT_API_KEY=your_private_app_token
HUBSPOT_PORTAL_ID=your_portal_id
```

### 3. HubSpot Integration Module
```javascript
// lib/hubspot.js
const hubspot = require('@hubspot/api-client');

class HubSpotIntegration {
  constructor() {
    this.hubspotClient = new hubspot.Client({
      accessToken: process.env.HUBSPOT_API_KEY
    });
  }

  async createContact(contactData) {
    try {
      const properties = {
        email: contactData.email,
        firstname: contactData.name?.split(' ')[0] || '',
        lastname: contactData.name?.split(' ').slice(1).join(' ') || '',
        company: contactData.company || '',
        phone: contactData.phone || '',
        website: contactData.website || '',
        lifecyclestage: 'lead',
        hs_lead_status: 'NEW',
        lead_source: contactData.source || 'website',
        service_interest: contactData.serviceInterest || '',
        monthly_revenue: contactData.revenue || '',
        sustainability_level: contactData.sustainabilityLevel || '1',
        notes_last_contacted: new Date().toISOString()
      };

      // Check if contact exists
      let contact;
      try {
        const existingContact = await this.hubspotClient.crm.contacts.basicApi.getById(
          contactData.email, 
          undefined, 
          undefined, 
          undefined, 
          false, 
          'email'
        );
        
        // Update existing contact
        contact = await this.hubspotClient.crm.contacts.basicApi.update(
          existingContact.id,
          { properties }
        );
      } catch (error) {
        // Create new contact
        contact = await this.hubspotClient.crm.contacts.basicApi.create({
          properties
        });
      }

      return contact;
    } catch (error) {
      console.error('HubSpot contact creation error:', error);
      throw error;
    }
  }

  async createDeal(dealData) {
    try {
      const properties = {
        dealname: dealData.dealName,
        amount: dealData.amount || '0',
        dealstage: 'appointmentscheduled',
        pipeline: 'default',
        hubspot_owner_id: process.env.HUBSPOT_OWNER_ID,
        service_type: dealData.serviceType || '',
        sustainability_discount: dealData.sustainabilityDiscount || '0',
        deal_source: dealData.source || 'website'
      };

      const deal = await this.hubspotClient.crm.deals.basicApi.create({
        properties
      });

      // Associate deal with contact
      if (dealData.contactId) {
        await this.hubspotClient.crm.deals.associationsApi.create(
          deal.id,
          'contacts',
          dealData.contactId,
          'deal_to_contact'
        );
      }

      return deal;
    } catch (error) {
      console.error('HubSpot deal creation error:', error);
      throw error;
    }
  }

  async addNote(contactId, noteText) {
    try {
      const note = await this.hubspotClient.crm.objects.notes.basicApi.create({
        properties: {
          hs_note_body: noteText,
          hs_timestamp: new Date().toISOString()
        },
        associations: [{
          to: { id: contactId },
          types: [{
            associationCategory: 'HUBSPOT_DEFINED',
            associationTypeId: 202 // Note to Contact
          }]
        }]
      });

      return note;
    } catch (error) {
      console.error('HubSpot note creation error:', error);
      throw error;
    }
  }
}

module.exports = new HubSpotIntegration();
```

### 4. Integration with Contact Forms

#### Update Contact Form API
```javascript
// POST /api/contact
const hubspot = require('../lib/hubspot');

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, revenue, service, message } = req.body;
    
    // Save to database
    const contact = await db.contacts.create({
      name, email, company, revenue, service, message,
      type: 'contact', created_at: new Date()
    });
    
    // Add to HubSpot
    const hubspotContact = await hubspot.createContact({
      name,
      email,
      company,
      revenue,
      serviceInterest: service,
      source: 'website_contact_form'
    });
    
    // Create deal if service specified
    if (service && service !== 'Not sure - need guidance') {
      await hubspot.createDeal({
        dealName: `${name} - ${service}`,
        contactId: hubspotContact.id,
        serviceType: service,
        source: 'website_contact_form'
      });
    }
    
    // Add note with message
    if (message) {
      await hubspot.addNote(hubspotContact.id, `Contact form message: ${message}`);
    }
    
    // Send email notifications
    await sendContactNotification({ name, email, company, revenue, service, message });
    
    res.json({ success: true, id: contact.id });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});
```

#### Update Newsletter Signup
```javascript
// POST /api/newsletter
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Add to database
    await db.newsletter.create({
      email,
      subscribed_at: new Date(),
      status: 'active'
    });
    
    // Add to HubSpot
    await hubspot.createContact({
      email,
      source: 'newsletter_signup'
    });
    
    // Send welcome email
    await sendWelcomeEmail(email);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});
```

### 5. Purchase Integration
```javascript
// When Stripe payment succeeds
const handleSuccessfulPayment = async (session) => {
  try {
    const customerEmail = session.customer_email;
    const amount = session.amount_total / 100; // Convert from cents
    
    // Update HubSpot contact
    const hubspotContact = await hubspot.createContact({
      email: customerEmail,
      name: session.metadata.customer_name,
      company: session.metadata.company,
      source: 'stripe_payment'
    });
    
    // Create deal
    await hubspot.createDeal({
      dealName: `Purchase - ${session.metadata.customer_name}`,
      amount: amount.toString(),
      contactId: hubspotContact.id,
      serviceType: 'Paid Services',
      sustainabilityDiscount: session.metadata.sustainability_discount || '0',
      source: 'stripe_payment'
    });
    
    // Add note about purchase
    const items = JSON.parse(session.metadata.items || '[]');
    const itemsList = items.map(item => `${item.name} (${item.quantity}x)`).join(', ');
    
    await hubspot.addNote(
      hubspotContact.id, 
      `Purchase completed: ${itemsList}. Total: £${amount}. Sustainability level: ${session.metadata.sustainability_level}`
    );
    
  } catch (error) {
    console.error('HubSpot purchase integration error:', error);
  }
};
```

### 6. Automated Workflows

#### Lead Scoring
```javascript
const calculateLeadScore = (contactData) => {
  let score = 0;
  
  // Revenue-based scoring
  if (contactData.revenue) {
    const revenueRanges = {
      '500k+': 100,
      '100k-500k': 80,
      '50k-100k': 60,
      '10k-50k': 40,
      '0-10k': 20
    };
    score += revenueRanges[contactData.revenue] || 0;
  }
  
  // Service interest scoring
  const serviceScores = {
    'Growth Share Partnership': 100,
    'Amazon Dream Team': 80,
    'Amazon Sprint Packages': 60,
    'Amazon Mastery Academy': 40
  };
  score += serviceScores[contactData.serviceInterest] || 0;
  
  // Sustainability level scoring
  const sustainabilityScores = {
    '4': 50, // Planet Champion
    '3': 40, // Impact Leader
    '2': 30, // Conscious Brand
    '1': 10  // Getting Started
  };
  score += sustainabilityScores[contactData.sustainabilityLevel] || 0;
  
  return score;
};

// Update contact with lead score
const updateContactWithScore = async (contactId, contactData) => {
  const score = calculateLeadScore(contactData);
  
  await hubspot.hubspotClient.crm.contacts.basicApi.update(contactId, {
    properties: {
      hs_lead_score: score.toString(),
      lead_score_last_updated: new Date().toISOString()
    }
  });
};
```

### 7. Webhook Integration
```javascript
// POST /api/hubspot/webhook
app.post('/api/hubspot/webhook', (req, res) => {
  try {
    const events = req.body;
    
    events.forEach(async (event) => {
      switch (event.subscriptionType) {
        case 'contact.propertyChange':
          // Handle contact updates
          await handleContactUpdate(event);
          break;
        case 'deal.propertyChange':
          // Handle deal updates
          await handleDealUpdate(event);
          break;
      }
    });
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('HubSpot webhook error:', error);
    res.status(500).send('Error');
  }
});
```

### 8. Dashboard Integration
```javascript
// GET /api/admin/crm-stats
app.get('/api/admin/crm-stats', authenticateAdmin, async (req, res) => {
  try {
    const stats = await hubspot.hubspotClient.crm.contacts.basicApi.getPage(
      undefined, undefined, undefined, undefined, undefined,
      ['email', 'hs_lead_status', 'createdate', 'lead_source']
    );
    
    const summary = {
      totalContacts: stats.total,
      newLeads: stats.results.filter(c => c.properties.hs_lead_status === 'NEW').length,
      websiteLeads: stats.results.filter(c => c.properties.lead_source?.includes('website')).length,
      thisMonth: stats.results.filter(c => {
        const created = new Date(c.properties.createdate);
        const thisMonth = new Date();
        return created.getMonth() === thisMonth.getMonth() && 
               created.getFullYear() === thisMonth.getFullYear();
      }).length
    };
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch CRM stats' });
  }
});
```

## Alternative: Pipedrive Integration

### 1. Pipedrive Setup
```javascript
// lib/pipedrive.js
const pipedrive = require('pipedrive');

class PipedriveIntegration {
  constructor() {
    this.client = new pipedrive.ApiClient();
    this.client.authentications.api_key.apiKey = process.env.PIPEDRIVE_API_KEY;
  }

  async createPerson(personData) {
    const api = new pipedrive.PersonsApi(this.client);
    
    const person = pipedrive.NewPerson.constructFromObject({
      name: personData.name,
      email: [{ value: personData.email, primary: true }],
      org_name: personData.company,
      phone: [{ value: personData.phone, primary: true }]
    });
    
    return await api.addPerson(person);
  }

  async createDeal(dealData) {
    const api = new pipedrive.DealsApi(this.client);
    
    const deal = pipedrive.NewDeal.constructFromObject({
      title: dealData.title,
      value: dealData.value,
      currency: 'GBP',
      person_id: dealData.personId,
      stage_id: 1 // First stage
    });
    
    return await api.addDeal(deal);
  }
}
```

## Implementation Checklist
- [ ] Choose CRM platform (HubSpot recommended)
- [ ] Set up CRM account and API access
- [ ] Create integration module
- [ ] Update all form submission endpoints
- [ ] Implement lead scoring system
- [ ] Set up automated workflows
- [ ] Create webhook handlers
- [ ] Build admin dashboard integration
- [ ] Test all CRM integrations
- [ ] Set up monitoring and error handling