const billingService = require("./billing.service");
const { validateStatusUpdate } = require("./billing.validation");

exports.getAllBills = async (req, res) => {
  try {
    const { data } = await billingService.getAllBills();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBillStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isValid, errors } = validateStatusUpdate(req.body);
    if (!isValid) return res.status(400).json({ success: false, message: errors[0] });

    const updatedBill = await billingService.updateStatus(id, req.body.status);
    return res.status(200).json({ success: true, message: "Status updated!", data: updatedBill });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};