const { supabase } = require("../../shared/database/supabaseClient");

exports.createPaymentRecord = async (data) => {
  // 1. Payments table mein entry dalo
  const { data: payment, error } = await supabase
    .from("payments")
    .insert([{
      bill_id: data.bill_id,
      customer_id: data.customer_id,
      amount_paid: data.amount_paid,
      payment_method: data.payment_method,
      transaction_id: data.transaction_id
    }])
    .select().single();

  if (error) throw error;
  return payment;
};

exports.updateBillStatus = async (billId, status) => {
  const { error } = await supabase
    .from("bills")
    .update({ status: status, paid_at: new Date() })
    .eq("id", billId);

  if (error) throw error;
};

exports.getLedger = async () => {
  const { data, error } = await supabase
    .from("payments")
    .select(`
      *,
      customers ( name, villages ( name ) ),
      bills ( consumption, total_amount )
    `)
    .order("paid_at", { ascending: false });

  if (error) throw error;
  return data;
};