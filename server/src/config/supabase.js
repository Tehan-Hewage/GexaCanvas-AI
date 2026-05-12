import { createClient } from '@supabase/supabase-js';
import { ENV } from './env.js';

if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY || !ENV.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase configuration variables.');
}

// Used for verifying user tokens and public operations
export const supabaseAuthClient = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_ANON_KEY
);

// Used ONLY on the server for trusted database/storage operations bypassing RLS if needed,
// though we still enforce ownership checks in our controllers.
export const supabaseAdmin = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
