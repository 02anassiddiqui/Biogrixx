const paymentService = require("./payments.service");
const { validatePayment } = require("./payments.validation");

exports.collectPayment = async (req, res) => {
  try {
    // Validation
    const { isValid, errors } = validatePayment(req.body);
    if (!isValid) return res.status(400).json({ success: false, message: errors[0] });

    // Service Call
    const result = await paymentService.processNewPayment(req.body);

    return res.status(201).json({
      success: true,
      message: "Payment recorded and Bill updated!",
      data: result
    });
  } catch (error) {
    console.error("❌ Payment Controller Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLedger = async (req, res) => {
  try {
    const data = await paymentService.getTransactionHistory();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};