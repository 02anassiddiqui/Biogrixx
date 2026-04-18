// backend/worker/jobs/billingJob.js
// Note: Path check kar lena ki supabaseClient kahan hai.
// Agar api folder ke andar hai toh path: ../../api/src/shared/database/supabaseClient
// const { supabase } = require("../../api/src/shared/database/supabaseClient");
const { supabase } = require("../lib/supabaseClient");

const generateMonthlyBills = async () => {
  console.log("🕒 [WORKER] Starting Monthly Billing Cycle...");

  try {
    // 1. Fetch Customers who have meters
    const { data: customers } = await supabase
      .from("customers")
      .select("id, name, village_id");

    const RATE = 45; // ₹45 per m3
    const TAX_RATE = 5; // 5% GST
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    for (const customer of customers) {
      // 2. Is mahine ka total consumption nikal lo
      const { data: usageData } = await supabase
        .from("gas_usage")
        .select("consumption, meter_id")
        .eq("customer_id", customer.id);

      const totalConsumption =
        usageData?.reduce(
          (sum, r) => sum + (parseFloat(r.consumption) || 0),
          0,
        ) || 0;

      if (totalConsumption > 0) {
        // 3. Financial Calculations
        const subTotal = totalConsumption * RATE;
        const taxAmount = (subTotal * TAX_RATE) / 100;
        const totalAmount = subTotal + taxAmount;

        // 4. Create Bill Record in your table
        const { error: billError } = await supabase.from("bills").insert([
          {
            customer_id: customer.id,
            meter_id: usageData[0]?.meter_id, // Pehla meter ID link kar do
            billing_month: currentMonth,
            consumption: totalConsumption,
            rate_per_unit: RATE,
            sub_total: subTotal,
            tax_rate: TAX_RATE,
            tax_amount: taxAmount,
            total_amount: totalAmount,
            status: "unpaid",
            due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days due date
          },
        ]);

        if (billError)
          console.error(`❌ Error for ${customer.name}:`, billError.message);
        else
          console.log(
            `✅ Bill Generated: ${customer.name} | Amount: ₹${totalAmount.toFixed(2)}`,
          );
      }
    }
  } catch (err) {
    console.error("❌ Billing Job Crash:", err.message);
  }
};

module.exports = { generateMonthlyBills };
