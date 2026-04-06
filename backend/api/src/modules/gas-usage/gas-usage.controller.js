// backend/api/src/modules/gas-usage/gas-usage.controller.js

const usageService = require("./gas-usage.service");
const { validateUsage } = require("./gas-usage.validation");
const billingService = require("../billing/billing.service"); // ✅ Billing Link

exports.submitReading = async (req, res) => {
  try {
    // 1. Validation
    const { isValid, errors } = validateUsage(req.body);
    if (!isValid) return res.status(400).json({ success: false, message: errors[0] });

    // 2. Save Reading & Update Meter
    const result = await usageService.recordNewReading(req.body);

    // 3. ⚡ AUTO-BILLING TRIGGER
    if (result) {
      try {
        console.log("🚀 Triggering Bill for Customer:", result.customer_id);
        
        await billingService.generateBill({
          usage_id: result.id,
          customer_id: result.customer_id,
          meter_id: result.meter_id,
          consumption: result.consumption // ✅ Calculated consumption passing
        });

        console.log("✅ Bill generated successfully!");
      } catch (billError) {
        // Agar billing fail ho, toh reading delete nahi honi chahiye
        console.error("⚠️ Billing Failed (Usage Saved):", billError.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Reading recorded & Bill generated!",
      data: result,
    });
  } catch (error) {
    console.error("❌ Usage Submission Error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const data = await usageService.getAllReadings();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};