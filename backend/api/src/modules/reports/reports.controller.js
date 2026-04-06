const reportsService = require("./reports.service");
const { validateReportQuery } = require("./reports.validation");

exports.getReports = async (req, res) => {
  try {
    const { isValid, errors } = validateReportQuery(req.query);
    if (!isValid) return res.status(400).json({ success: false, message: errors[0] });

    const data = await reportsService.getDashboardSummary(req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};