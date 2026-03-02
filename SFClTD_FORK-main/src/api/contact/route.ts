import { Router, Request, Response } from 'express';
import { createHubspotContact } from '../../lib/hubspot.js'; // Adjust the path
import { supabase } from '../../lib/supabase.js';

const router = Router();

router.post('/contact', async (req: Request, res: Response) => {
  const { email, name, company, specialist, service, message } = req.body;

  // --- Basic Validation ---
  if (!email || !name) {
    return res.status(400).json({ error: 'Missing required fields: email and name.' });
  }

  // --- Split Name for HubSpot ---
  const nameParts = name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || "N/A"; // Ensure lastName is not empty

  try {
    // --- Save to Supabase ---
    console.log('Attempting to save contact to Supabase...'); // Debug log
    const { data, error: supabaseError } = await supabase
      .from('contacts') // Your table name
      .insert([
        {
          name: name,
          email: email,
          company: company || null, // Use null if empty
          specialist_interest: specialist || null,
          service_interest: service || null,
          message: message || null,
          // created_at is usually handled by Supabase default value
        },
      ])
      .select(); // Optionally select the inserted data

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      // Don't necessarily stop the whole process, maybe just log it
      // throw new Error(`Supabase error: ${supabaseError.message}`); // Uncomment to make it critical
    } else {
      console.log('✅ Successfully saved contact to Supabase:', data);
    }
    // -----------------------

    // --- Create HubSpot Contact (as before) ---
    console.log('Attempting to create HubSpot contact...'); // Debug log
    await createHubspotContact(email, firstName, lastName, company);
    console.log('HubSpot contact creation initiated.'); // Debug log (createHubspotContact logs success/failure internally)
    // -----------------------

    // Send a success response back to the frontend
    res.status(200).json({ message: 'Contact processed successfully.' });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    console.error('❌ Contact form submission error:', errorMessage);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

export default router;
