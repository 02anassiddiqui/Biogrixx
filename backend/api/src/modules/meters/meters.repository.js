const { supabase } = require("../../shared/database/supabaseClient");

exports.create = async (data) => {
  const { data: meter, error } = await supabase
    .from("meters")
    .insert([
      {
        serial_number: data.serial_number,
        plant_id: data.plant_id,
        status: "available",
        last_reading: 0,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return meter;
};

exports.findAll = async () => {
  const { data, error } = await supabase
    .from("meters")
    .select(
      `
      *,
      customers ( name, phone ),
      plants ( name ),
      workers ( name ) 
    `,
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

// 🚀 NEW: Find by specific Worker
exports.findByWorker = async (workerId) => {
  const { data, error } = await supabase
    .from("meters")
    .select(
      `
        *,
        customers ( name, phone )
    `,
    )
    .eq("assigned_worker_id", workerId)
    .eq("status", "active");
  if (error) throw error;
  return data;
};

exports.assignToCustomer = async (
  meterId,
  customerId,
  workerId,
  serialNumber,
  installationDate,
) => {
  // 1. Meter Table Update (Link Customer AND Worker)
  const { data: meter, error: meterError } = await supabase
    .from("meters")
    .update({
      customer_id: customerId,
      assigned_worker_id: workerId, // 🚀 Saved Worker ID
      status: "active",
      installation_date: installationDate,
    })
    .eq("id", meterId)
    .select()
    .single();
  if (meterError) throw meterError;

  // 2. Sync Customer Table
  const { error: customerError } = await supabase
    .from("customers")
    .update({ meter_number: serialNumber })
    .eq("id", customerId);
  if (customerError) throw customerError;

  return meter;
};

exports.update = async (id, updateData) => {
  const { data: oldMeter, error: fetchError } = await supabase
    .from("meters")
    .select("customer_id")
    .eq("id", id)
    .single();
  if (fetchError) throw fetchError;

  const { data: updatedMeter, error } = await supabase
    .from("meters")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  const unassignStatuses = ["available", "maintenance", "inactive"];
  if (unassignStatuses.includes(updateData.status) && oldMeter.customer_id) {
    await supabase
      .from("customers")
      .update({ meter_number: "PENDING" })
      .eq("id", oldMeter.customer_id);
    await supabase
      .from("meters")
      .update({
        customer_id: null,
        assigned_worker_id: null,
        installation_date: null,
      })
      .eq("id", id);
    updatedMeter.customer_id = null;
  }
  return updatedMeter;
};

exports.findPendingReadings = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const { data, error } = await supabase
    .from("meters")
    .select(`*, customers ( name, phone ), plants ( name )`)
    .eq("status", "active")
    .or(
      `last_reading_at.lt.${thirtyDaysAgo.toISOString()},last_reading_at.is.null`,
    )
    .order("last_reading_at", { ascending: true });
  if (error) throw error;
  return data;
};

exports.delete = async (id) => {
  const { error } = await supabase.from("meters").delete().eq("id", id);
  if (error) {
    if (error.code === "23503")
      throw new Error(
        "Bhai, ye meter delete nahi ho sakta kyunki ye kisan se juda hai.",
      );
    throw error;
  }
  return true;
};
