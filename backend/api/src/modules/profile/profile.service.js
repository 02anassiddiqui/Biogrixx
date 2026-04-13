const bcrypt = require("bcryptjs");
const profileRepository = require("./profile.repository");

exports.getProfileData = async (adminId) => {
  return await profileRepository.getAdminProfile(adminId);
};

exports.updateProfileInfo = async (adminId, updateData) => {
  return await profileRepository.updateAdmin(adminId, updateData);
};

exports.getGSTSetting = async () => {
  return await profileRepository.getGSTValue();
};

exports.updateGSTSetting = async (newValue) => {
  return await profileRepository.updateGSTValue(newValue);
};

exports.changeAdminPassword = async (adminId, currentPassword, newPassword) => {
  // 1. Get admin with password for verification
  const admin = await profileRepository.getAdminWithPassword(adminId);

  // 2. Check current password
  // ✅ Yahan 'admin.password' ko 'admin.password_hash' kar diya hai
  const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
  if (!isMatch) throw new Error("Current password does not match our records.");

  // 3. Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // 4. Update in DB
  return await profileRepository.updateAdmin(adminId, {
    password_hash: hashedPassword, // ✅ Ye pehle se sahi tha
  });
};

exports.terminateAccount = async (adminId) => {
  return await profileRepository.deleteAdminAccount(adminId);
};
