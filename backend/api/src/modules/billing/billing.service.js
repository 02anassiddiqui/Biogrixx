const billingRepo = require("./billing.repository");

exports.generateBill = async (usageData) => {
  try {
    const { consumption, customer_id, meter_id, usage_id } = usageData;
    const configs = await billingRepo.getSystemConfigs();
    
    const gstRate = configs.gst_rate || 5; 
    const gasRate = configs.gas_rate_per_unit || 45;

    const units = parseFloat(consumption || 0);
    const basePrice = units * gasRate;
    const taxAmount = (basePrice * gstRate) / 100;
    const totalAmount = basePrice + taxAmount;

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

    return await billingRepo.createBill(newBill);
  } catch (error) {
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