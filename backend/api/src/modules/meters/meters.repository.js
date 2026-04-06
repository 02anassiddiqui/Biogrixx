// backend/api/src/modules/meters/meters.repository.js
const { supabase } = require("../../shared/database/supabaseClient");

exports.create = async (data) => {
  const { data: meter, error } = await supabase
    .from("meters")
    .insert([{
      serial_number: data.serial_number,
      plant_id: data.plant_id,
      status: "available",
      last_reading: 0
    }])
    .select().single();

  if (error) throw error;
  return meter;
};

exports.findAll = async () => {
  const { data, error } = await supabase
    .from("meters")
    .select(`
      *,
      customers ( name, phone ),
      plants ( name )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

exports.assignToCustomer = async (meterId, customerId, serialNumber, installationDate) => {
  // 1. Meter Table Update (Link Customer)
  const { data: meter, error: meterError } = await supabase
    .from("meters")
    .update({
      customer_id: customerId,
      status: "active",
      installation_date: installationDate
    })
    .eq("id", meterId)
    .select().single();

  if (meterError) throw meterError;

  // 2. Customer Table Update (Replace 'PENDING' with Real Serial)
  const { error: customerError } = await supabase
    .from("customers")
    .update({ meter_number: serialNumber })
    .eq("id", customerId);

  if (customerError) throw customerError;

  return meter;
};

// Naya update function add karo

exports.update = async (id, updateData) => {
  // 1. Pehle purana data fetch karo (Kyunki humein customer_id chahiye unassign karne ke liye)
  const { data: oldMeter, error: fetchError } = await supabase
    .from("meters")
    .select("customer_id, serial_number")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  // 2. Ab meter table update karo
  const { data: updatedMeter, error } = await supabase
    .from("meters")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // 3. ⚡ CASE A: Serial Number badla hai toh Customer table sync karo
  if (updatedMeter.customer_id && updateData.serial_number) {
    await supabase
      .from("customers")
      .update({ meter_number: updateData.serial_number })
      .eq("id", updatedMeter.customer_id);
  }

  // 4. ⚡ CASE B: Status badal kar 'available' ya 'maintenance' kiya gaya hai
  // Yani kisan se meter wapas le liya gaya hai
  const unassignStatuses = ['available', 'maintenance', 'inactive'];
  
  if (unassignStatuses.includes(updateData.status) && oldMeter.customer_id) {
    // A. Customer table mein wapas 'PENDING' likho
    await supabase
      .from("customers")
      .update({ meter_number: "PENDING" })
      .eq("id", oldMeter.customer_id);

    // B. Meter table mein customer_id ko NULL karo (Link khatam)
    await supabase
      .from("meters")
      .update({ customer_id: null, installation_date: null })
      .eq("id", id);
      
    // Local data update for response
    updatedMeter.customer_id = null;
  }

  return updatedMeter;
};

// backend/api/src/modules/meters/meters.repository.js

exports.findPendingReadings = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from("meters")
    .select(`
      *,
      customers ( 
        name, 
        phone 
      ),
      plants ( name )
    `) // ✅ REMOVED 'village' to match your working findAll query
    .eq("status", "active")
    .or(`last_reading_at.lt.${thirtyDaysAgo.toISOString()},last_reading_at.is.null`)
    .order("last_reading_at", { ascending: true });

  if (error) {
    console.error("❌ Supabase Query Error:", error.message);
    throw error;
  }
  return data;
};

// backend/api/src/modules/meters/meters.repository.js

exports.delete = async (id) => {
  const { error } = await supabase
    .from("meters")
    .delete()
    .eq("id", id);

  if (error) {
    // Agar meter kisi customer se juda hai, toh database error dega
    if (error.code === '23503') {
      throw new Error("Bhai, ye meter delete nahi ho sakta kyunki ye kisi kisan ko assign hai.");
    }
    throw error;
  }
  return true;
};