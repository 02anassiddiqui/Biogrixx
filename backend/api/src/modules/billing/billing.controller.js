const billingService = require("./billing.service");
const { validateStatusUpdate } = require("./billing.validation");

// 1. Saare bills fetch karne ke liye (Admin Dashboard)
exports.getAllBills = async (req, res) => {
  try {
    const { data, error } = await billingService.getAllBills(); // Hum ye service mein add karenge
    if (error) throw error;
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Bill ka Payment Status update karne ke liye (Mark as Paid)
exports.updateBillStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isValid, errors } = validateStatusUpdate(req.body);
    
    if (!isValid) return res.status(400).json({ success: false, message: errors[0] });

    const updatedBill = await billingService.updateStatus(id, req.body.status);
    return res.status(200).json({ 
      success: true, 
      message: `Bill marked as ${req.body.status}!`, 
      data: updatedBill 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};