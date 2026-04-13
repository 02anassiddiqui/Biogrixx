const { supabase } = require('../../shared/database/supabaseClient');

exports.getAdminProfile = async (id) => {
  const { data, error } = await supabase
    .from("admins")
    .select("id, name, email, role, profile_image, created_at")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

// profile.repository.js mein add karein:
exports.getAdminWithPassword = async (id) => {
  const { data, error } = await supabase
    .from("admins")
    .select("password_hash")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

exports.updateAdmin = async (id, updateData) => {
  const { data, error } = await supabase
    .from("admins")
    .update(updateData)
    .eq("id", id);
  if (error) throw error;
  return data;
};

exports.getGSTValue = async () => {
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "gst_percentage")
    .single();
  return data?.value || 18; // Default 18 agar na mile
};

exports.updateGSTValue = async (newValue) => {
  const { error } = await supabase
    .from("settings")
    .update({ value: newValue })
    .eq("key", "gst_percentage");
  if (error) throw error;
};

exports.deleteAdminAccount = async (id) => {
  const { error } = await supabase.from("admins").delete().eq("id", id);
  if (error) throw error;
};
