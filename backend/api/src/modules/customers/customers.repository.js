const { supabase } = require("../../shared/database/supabaseClient");

// 1. Naya Customer register karne ke liye
exports.create = async (customerData) => {
  const { data, error } = await supabase
    .from('customers')
    .insert([customerData])
    .select(`*, villages(name), plants(name)`)
    .single();

  if (error) throw error;
  return data;
};

// 2. Saare Customers fetch karne ke liye
exports.findAll = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select(`
      *,
      villages ( name, district, state ),
      plants ( name, capacity )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// 3. ID se single customer dhoondne ke liye
// ✅ CHANGE: Added 'meters' join aur trailing comma fix kiya taaki reading mil sake
exports.findById = async (id) => {
  const { data, error } = await supabase
    .from('customers')
    .select(`
      *,
      villages(name),
      plants(name),
      meters!customer_id(serial_number, last_reading, status)
    `) // 👈 Join update: meters table se data uthane ke liye
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// 4. Customer ko delete karne ke liye
exports.remove = async (id) => {
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) throw error;
  return true;
};