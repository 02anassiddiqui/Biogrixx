const { supabase } = require("../../shared/database/supabaseClient");

exports.getGlobalStats = async (startDate, endDate) => {
  try {
    // 1. Total Revenue (Using 'amount_paid' and 'paid_at')
    const { data: payments, error: pError } = await supabase
      .from("payments")
      .select("amount_paid")
      .gte("paid_at", startDate)
      .lte("paid_at", endDate);
    
    if (pError) console.error("❌ Payment Table Error:", pError.message);

    // 2. Total Gas Usage (Using 'consumption' and 'recorded_at')
    const { data: usage, error: uError } = await supabase
      .from("gas_usage")
      .select("consumption")
      .gte("recorded_at", startDate)
      .lte("recorded_at", endDate);

    if (uError) console.error("❌ Gas Usage Table Error:", uError.message);

    // 3. Customer Count
    const { count: customerCount } = await supabase
      .from("customers")
      .select("*", { count: 'exact', head: true });

    // 4. Complaint Stats
    const { data: complaints } = await supabase
      .from("complaints")
      .select("status");

    return {
      revenue: payments?.reduce((acc, curr) => acc + curr.amount_paid, 0) || 0,
      usage: usage?.reduce((acc, curr) => acc + curr.consumption, 0) || 0,
      customers: customerCount || 0,
      complaints: {
        total: complaints?.length || 0,
        resolved: complaints?.filter(c => c.status === 'resolved').length || 0
      }
    };
  } catch (err) {
    console.error("🔥 Global Stats Crash:", err.message);
    throw err;
  }
};

exports.getUsageTrends = async () => {
  const { data, error } = await supabase
    .from("gas_usage")
    .select("consumption, recorded_at") // ✅ Schema sync
    .order("recorded_at", { ascending: false })
    .limit(30);
  
  if (error) {
    console.error("❌ Trends Query Error:", error.message);
    return [];
  }
  return data || [];
};