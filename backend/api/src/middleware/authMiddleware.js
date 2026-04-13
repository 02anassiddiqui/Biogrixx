const jwt = require("jsonwebtoken");

exports.authGuard = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized: No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Store admin info in request
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: "Session expired, login again" });
  }
};