// THIS FILE IS FOR SERVER-SIDE USE ONLY
// It uses the Service Role Key and bypasses all RLS.
// NEVER expose this client or the service role key to the browser.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL or Service Role Key is missing from .env file. This is required for server-side admin operations.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    // This is a server-side client, so we don't want it to
    // automatically save sessions.
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('Supabase Admin client initialized (for server-side use).');
