const { supabase } = require("../../shared/database/supabaseClient");

exports.findAdminByEmail = async (email) => {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email)
    .single();
  if (error) return null;
  return data;
};

exports.findAdminById = async (id) => {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
};

exports.updateAdminPassword = async (adminId, newHashedPassword) => {
  const { error } = await supabase
    .from("admins")
    .update({ password_hash: newHashedPassword })
    .eq("id", adminId);
  return !error;
};
