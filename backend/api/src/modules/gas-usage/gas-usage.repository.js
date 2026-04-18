// backend/api/src/modules/gas-usage/gas-usage.repository.js
const { supabase } = require("../../shared/database/supabaseClient");

exports.createReading = async (data) => {
  // 1. Insert into gas_usage table
  const { data: usage, error: usageError } = await supabase
    .from("gas_usage")
    .insert([
      {
        meter_id: data.meter_id,
        customer_id: data.customer_id,
        previous_reading: data.previous_reading,
        current_reading: data.current_reading,
        consumption: data.consumption,
        image_url: data.image_url, // 📸 Evidence Link
        entered_by: data.entered_by, // 👷 Worker Identity
      },
    ])
    .select()
    .single();

  if (usageError) throw usageError;

  // 2. ⚡ Sync with Meter Table
  const { error: meterError } = await supabase
    .from("meters")
    .update({
      last_reading: data.current_reading,
      last_reading_at: new Date(),
    })
    .eq("id", data.meter_id);

  if (meterError) throw meterError;

  return usage;
};

exports.findAll = async () => {
  const { data, error } = await supabase
    .from("gas_usage")
    .select(
      `
      *,
      customers ( 
        name, 
        phone,
        villages ( name )
      ),
      meters ( 
        serial_number 
      ),
      workers ( 
        name 
      ) 
    `,
    )
    .order("recorded_at", { ascending: false });

  if (error) {
    console.error("❌ Fetch History Error:", error.message);
    throw error;
  }
  return data;
};
