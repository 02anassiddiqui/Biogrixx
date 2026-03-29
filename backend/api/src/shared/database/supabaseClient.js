const { createClient } = require('@supabase/supabase-js');

// Ab humein yahan dotenv ki zaroorat nahi hai, 
// kyunki server.js ise pehle hi load kar chuka hoga.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Supabase URL ya Key missing hai! Check .env file.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

module.exports = { supabase };