import { createClient } from '@supabase/supabase-js';

// Use environment variables for sensitive configuration
// Fallback to hardcoded values for backward compatibility (should be removed in production)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://db.ab-civil.com';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';

// Warn if using default keys in production
if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.warn('Warning: Using default Supabase key. Please set REACT_APP_SUPABASE_ANON_KEY environment variable.');
}

// Use exact same configuration as working client portal
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});