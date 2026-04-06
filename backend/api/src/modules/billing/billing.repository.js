// backend/api/src/modules/billing/billing.repository.js

const { supabase } = require("../../shared/database/supabaseClient");

exports.getSystemConfigs = async () => {
  const { data, error } = await supabase
    .from('system_configs')
    .select('config_key, config_value');

  if (error) throw error;
  return data.reduce((acc, curr) => ({ 
    ...acc, 
    [curr.config_key]: parseFloat(curr.config_value) 
  }), {});
};

exports.createBill = async (billData) => {
  const { data, error } = await supabase
    .from('bills')
    .insert([billData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

exports.findAllBills = async () => {
  const { data, error } = await supabase
    .from('bills')
    .select(`
      *,
      customers ( 
        name, 
        phone, 
        villages ( name )
      ),
      meters ( serial_number )
    `) // ✅ Code ekdum saaf hai ab!
    .order('created_at', { ascending: false });

  if (error) {
    console.error("❌ Supabase Billing Error:", error.message);
    throw error;
  }
  return { data, error: null };
};

exports.updateBill = async (id, updateData) => {
  const { data, error } = await supabase
    .from('bills')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};