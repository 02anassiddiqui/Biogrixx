/**
 * Customers repository.
 * TODO: Implement data access logic using Supabase client.
 */

/**
 * Customers repository.
 * Handles all database operations for the leads/customers table.
 */
const { supabase } = require("../../shared/database/supabaseClient");

/**
 * Saari leads fetch karne ke liye (Admin Dashboard ke liye)
 */
exports.findAll = async () => {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Repository Error (findAll):", error.message);
    throw error;
  }
  return data;
};

/**
 * Nayi lead save karne ke liye (Website Form ke liye)
 */
exports.create = async (leadData) => {
  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        name: leadData.name,
        phone: leadData.phone,
        village: leadData.village,
        livestock_count: leadData.livestock_count,
        role: leadData.role,
        message: leadData.message,
        location_details: leadData.location_details,
      },
    ])
    .select();

  if (error) {
    console.error("❌ Repository Error (create):", error.message);
    throw error;
  }
  return data[0];
};

exports.remove = async (id) => {
  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) {
    console.error("❌ Repository Error (Delete):", error.message);
    throw error;
  }
  return true;
};
