const billingRepo = require("./billing.repository");

exports.generateBill = async (usageData) => {
  try {
    console.log("📥 Billing Service received data:", usageData);

    const { consumption, customer_id, meter_id, usage_id } = usageData;

    // 1. Database se rates uthao
    const configs = await billingRepo.getSystemConfigs();
    
    // SAFE DEFAULTS: Agar DB khali ho
    const gstRate = configs.gst_rate || 5; 
    const gasRate = configs.gas_rate_per_unit || 45;

    // 2. 🧮 Calculation Logic (parseFloat zaroori hai safety ke liye)
    const units = parseFloat(consumption || 0);
    const basePrice = units * gasRate;
    const taxAmount = (basePrice * gstRate) / 100;
    const totalAmount = basePrice + taxAmount;

    console.log(`📊 Billing Calculation: ${units} units @ ${gasRate} + ${gstRate}% GST = ${totalAmount}`);

    // 3. Bill object taiyar karo
    const newBill = {
      customer_id,
      meter_id,
      usage_id,
      consumption: units,
      rate_per_unit: gasRate,
      sub_total: basePrice,
      tax_rate: gstRate,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      status: 'unpaid',
      due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    };

    // 4. Database mein save karo
    const savedBill = await billingRepo.createBill(newBill);
    console.log("✅ Bill Created Successfully! ID:", savedBill.id);
    return savedBill;

  } catch (error) {
    // 🚩 YE LOG TERMINAL MEIN DEKHO
    console.error("❌ CRITICAL BILLING ERROR:", error.message);
    throw error;
  }
};

exports.getAllBills = async () => {
  return await billingRepo.findAllBills();
};

exports.updateStatus = async (billId, status) => {
  const updateData = { status };
  if (status === 'paid') {
    updateData.paid_at = new Date();
  }
  return await billingRepo.updateBill(billId, updateData);
};