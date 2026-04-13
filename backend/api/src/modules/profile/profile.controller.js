const profileService = require("./profile.service");

// 1. Get Admin Profile & GST
exports.getProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const profile = await profileService.getProfileData(adminId);
    const gst = await profileService.getGSTSetting();
    
    res.json({ 
      success: true, 
      data: { ...profile, gst_percentage: gst } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Update Identity (Name/Email)
exports.updateProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;
    await profileService.updateProfileInfo(adminId, req.body);
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 3. Update GST %
exports.updateGST = async (req, res) => {
  try {
    const { gst } = req.body;
    await profileService.updateGSTSetting(gst);
    res.json({ success: true, message: "GST percentage updated in core" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 4. Change Password 🚀 (Ye missing ya galat naam se ho sakta hai)
exports.changePassword = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { currentPassword, newPassword } = req.body;
    
    await profileService.changeAdminPassword(adminId, currentPassword, newPassword);
    
    res.json({ success: true, message: "Security passkey updated successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 5. Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const adminId = req.admin.id;
    await profileService.terminateAccount(adminId);
    res.json({ success: true, message: "Account terminated successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};