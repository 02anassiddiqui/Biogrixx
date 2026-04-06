const { supabase } = require("../../shared/database/supabaseClient");

exports.create = async (data) => {
  const { data: complaint, error } = await supabase
    .from("complaints")
    .insert([{
      name: data.name,
      phone: data.phone,
      village: data.village,
      issue_type: data.issue_type,
      description: data.description,
      priority: data.issue_type === "Leakage" ? "high" : "medium" // Automatic priority
    }])
    .select().single();

  if (error) throw error;
  return complaint;
};

exports.findAll = async () => {
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

exports.updateStatus = async (id, status) => {
  const updateData = { status };
  if (status === "resolved") updateData.resolved_at = new Date();

  const { data, error } = await supabase
    .from("complaints")
    .update(updateData)
    .eq("id", id)
    .select().single();

  if (error) throw error;
  return data;
};