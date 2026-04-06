const complaintRepo = require("./complaints.repository");

exports.registerComplaint = async (data) => {
  // Aap yahan chaho toh SMS notification ka logic bhi jodd sakte ho future mein
  return await complaintRepo.create(data);
};

exports.getAllComplaints = async () => {
  return await complaintRepo.findAll();
};

exports.resolveComplaint = async (id, status) => {
  return await complaintRepo.updateStatus(id, status);
};