/**
 * Simple Admin Auth Middleware.
 * Professional apps use JWT, but we'll start with a "Secret Key" for simplicity.
 */
const authGuard = (req, res, next) => {
  const adminSecret = req.headers['x-admin-secret'];
  const expectedSecret = process.env.ADMIN_SECRET;

  // 📝 Debugging ke liye (Terminal mein check karein)
  console.log("--- Security Check ---");
  console.log("Chabi jo aayi (Header):", adminSecret);
  console.log("Chabi jo honi chahiye (ENV):", expectedSecret);

  // Check if secret exists and matches
  if (expectedSecret && adminSecret === expectedSecret) {
    console.log("✅ Match! Permission Granted.");
    next();
  } else {
    console.log("❌ No Match! Access Denied.");
    res.status(401).json({ 
      success: false, 
      message: "Bhai, aap authorized nahi ho!" 
    });
  }
};

module.exports = { authGuard };