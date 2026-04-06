const paymentRepo = require("./payments.repository");

exports.processNewPayment = async (paymentData) => {
  try {
    // 1. Payment record banao
    const payment = await paymentRepo.createPaymentRecord(paymentData);

    // 2. Bill ka status 'paid' kar do
    await paymentRepo.updateBillStatus(paymentData.bill_id, "paid");

    return payment;
  } catch (error) {
    throw new Error("Payment Processing Failed: " + error.message);
  }
};

exports.getTransactionHistory = async () => {
  return await paymentRepo.getLedger();
};