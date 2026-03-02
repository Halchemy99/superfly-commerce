import { Client } from '@hubspot/api-client';

export const createHubspotContact = async (email: string, firstname: string, lastname: string, company?: string) => {
  // Init Client HERE
  if (!process.env.HUBSPOT_ACCESS_TOKEN) { 
    console.error("HubSpot Token missing"); 
    return; 
  }
  
// NEW (Fixed)
const token = process.env.HUBSPOT_ACCESS_TOKEN;

// Check if it's a Private App Token (starts with 'pat-') or an API Key
const clientConfig = token?.startsWith('pat-')
  ? { accessToken: token }
  : { apiKey: token }; // If it doesn't start with pat-, treat as API Key

const hubspotClient = new Client(clientConfig);
  try {
   
    const contactObj = {
      properties: {
        email,
        firstname,
        lastname: lastname || "N/A", // HubSpot requires a last name
        company: company || "",
      },
    };

    // Use the HubSpot client to create or update a contact
    const createOrUpdateResponse = await hubspotClient.crm.contacts.basicApi.create(contactObj);

    console.log('Successfully created HubSpot contact:', createOrUpdateResponse);
    return createOrUpdateResponse;

  } catch (e: any) {
    // If the contact already exists, HubSpot might throw an error.
    // You can handle this gracefully.
    if (e.body?.category === 'CONFLICT') {
        console.log(`Contact with email ${email} already exists in HubSpot.`)
    } else {
        console.error('Error creating HubSpot contact:', e);
    }
  }
};
