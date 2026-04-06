const { supabase } = require("../../shared/database/supabaseClient");

exports.create = async (data) => {
  const { data: log, error } = await supabase
    .from("maintenance_logs")
    .insert([
      {
        complaint_id: data.complaint_id || null,
        assigned_to: data.assigned_to,
        task_type: data.task_type,
        scheduled_date: data.scheduled_date,
        status: "scheduled",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return log;
};

exports.findAll = async () => {
  // 1. Hum 'complaints' table se query shuru karenge
  // 2. Uske andar hum 'maintenance_logs' ka saara data fetch karenge
  const { data, error } = await supabase
    .from("complaints")
    .select(`
      *,
      maintenance_logs (
        id,
        assigned_to,
        status,
        scheduled_date,
        work_notes
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Database Fetch Error:", error);
    throw error;
  }
  return data;
};

exports.updateStatus = async (id, updateData) => {
  // 1. Pehle Maintenance Log ko update karo
  const { data: log, error: logError } = await supabase
    .from("maintenance_logs")
    .update({
      status: updateData.status,
      work_notes: updateData.work_notes || null,
      completion_date: updateData.status === "completed" ? new Date() : null,
    })
    .eq("id", id)
    .select()
    .single();

  if (logError) throw logError;

  // 2. ✅ AUTOMATIC SYNC LOGIC: 
  // Agar status "completed" hai aur ye kisi complaint se linked hai
  if (updateData.status === "completed" && log.complaint_id) {
    const { error: complaintError } = await supabase
      .from("complaints")
      .update({ 
        status: "resolved", 
        resolved_at: new Date() 
      })
      .eq("id", log.complaint_id);

    if (complaintError) {
      console.error("Failed to sync complaint status:", complaintError);
      // Hum log error karenge par main process nahi rokenge
    }
  }

  return log;
};
