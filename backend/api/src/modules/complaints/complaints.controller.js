const complaintService = require("./complaints.service");
const { validateComplaint } = require("./complaints.validation");

exports.publicSubmit = async (req, res) => {
  try {
    const { isValid, errors } = validateComplaint(req.body);
    if (!isValid) return res.status(400).json({ success: false, message: errors[0] });

    const data = await complaintService.registerComplaint(req.body);
    res.status(201).json({ success: true, message: "Complaint Registered!", data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.adminList = async (req, res) => {
  try {
    const data = await complaintService.getAllComplaints();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await complaintService.resolveComplaint(id, status);
    res.status(200).json({ success: true, message: `Ticket ${status}!`, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};