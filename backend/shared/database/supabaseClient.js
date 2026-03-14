/**
 * Supabase client for Biogrix.
 * Requires SUPABASE_URL and SUPABASE_ANON_KEY from environment.
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_ANON_KEY must be set. ' +
    'Check your .env file or environment configuration.'
  )
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

module.exports = { supabase }
