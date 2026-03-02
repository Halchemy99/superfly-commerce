import { createClient } from '@supabase/supabase-js';

// This safely checks if we are in a Vite (client) environment or a Node (server) environment.
//
// In Vite (client-side):
// - `import.meta.env` will be an object.
// - `process.env` will be undefined.
//
// In Node.js (server-side):
// - `import.meta.env` will be undefined.
// - `process.env` will be an object.

const supabaseUrl = (typeof import.meta.env !== 'undefined')
  ? import.meta.env.VITE_SUPABASE_URL  // Client-side (Vite)
  : process.env.VITE_SUPABASE_URL;    // Server-side (Node.js)

const supabaseAnonKey = (typeof import.meta.env !== 'undefined')
  ? import.meta.env.VITE_SUPABASE_ANON_KEY // Client-side (Vite)
  : process.env.VITE_SUPABASE_ANON_KEY;   // Server-side (Node.js)


if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'Supabase URL or Anon Key is missing. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.';
  console.error(errorMsg);
  throw new Error(errorMsg);
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase client initialized.');
