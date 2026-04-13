const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seedAdmin() {
    const email = 'admin@biogrix.com';
    const password = 'Biogrix@2026'; // 👈 Aapka asali password

    console.log("🚀 Generating professional hash...");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    console.log("📡 Updating Supabase database...");
    const { data, error } = await supabase
        .from('admins')
        .upsert({ 
            email: email, 
            password_hash: hash 
        }, { onConflict: 'email' });

    if (error) {
      console.error("❌ Error updating DB:", error.message);
    } else {
      console.log("✅ Success! Database synced with password: ", password);
      console.log("🔐 Hash stored:", hash);
    }
}

seedAdmin();