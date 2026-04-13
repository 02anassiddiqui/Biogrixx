const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authRepo = require("./auth.repository");

exports.login = async (email, password) => {
  // 1. Pehle data mangwao (Variable ka naam 'admin' hi rakhte hain simplify karne ke liye)
  const admin = await authRepo.findAdminByEmail(email);

  // 📝 DEBUG LOGS (Ab ye initialization ke BAAD hain)
  console.log("--- Login Attempt ---");
  console.log("Email from frontend:", email);
  console.log("Admin found in DB:", admin ? "YES" : "NO");

  // 2. Check karo ki admin mila ya nahi
  if (!admin) {
    throw new Error("Admin not found");
  }

  // 3. Password match kiya (Database mein password_hash field hai)
  const isMatch = await bcrypt.compare(password, admin.password_hash);
  if (!isMatch) {
    throw new Error("wrong Password, Please Try Again");
  }

  // 4. JWT Token banaya
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT_SECRET is missing in .env");

  return jwt.sign({ id: admin.id, email: admin.email }, jwtSecret, {
    expiresIn: "24h",
  });
};

exports.changePassword = async (adminId, oldPassword, newPassword) => {
  // Professional Way: Repository ka use karo, seedha supabase ka nahi
  const admin = await authRepo.findAdminById(adminId);

  if (!admin) throw new Error("Admin not found");

  const isMatch = await bcrypt.compare(oldPassword, admin.password_hash);
  if (!isMatch) throw new Error("Old password doesn't match");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  return await authRepo.updateAdminPassword(adminId, hashedPassword);
};
  