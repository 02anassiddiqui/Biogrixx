const reportsRepo = require("./reports.repository");

exports.getDashboardSummary = async (query) => {
  try {
    const startDate =
      query.startDate ||
      new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();
    const endDate = query.endDate || new Date().toISOString();

    const stats = await reportsRepo.getGlobalStats(startDate, endDate);
    const rawTrends = await reportsRepo.getUsageTrends();

    // ✅ Map fields according to your SQL Schema
    const trends = (Array.isArray(rawTrends) ? rawTrends : [])
      .map((item) => ({
        date: item.recorded_at
          ? new Date(item.recorded_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })
          : "N/A",
        units: item.consumption || 0, // Recharts expects 'units' for the chart
      }))
      .reverse();

    return { stats, trends };
  } catch (error) {
    console.error("🔥 Service Layer Crash:", error.message);
    throw error;
  }
};
