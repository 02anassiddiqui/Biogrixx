// backend/worker/lib/supabaseClient.js
require('dotenv').config(); // 👈 Sabse pehle variables load karo
const { createClient } = require('@supabase/supabase-js');

// Match your .env names exactly
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Supabase URL ya Key missing hai! Check worker/.env file.");
  process.exit(1); // Stop if config is missing
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };