const express = require("express");
const router = express.Router();
const profileController = require("./profile.controller");
const { authGuard } = require("../../middleware/authMiddleware");

// 🛡️ Validation Schemas import
const {
  updateProfileSchema,
  updateGSTSchema,
  changePasswordSchema,
} = require("./profile.validation");

// ⚙️ Local Validation Middleware (Kyunki middleware folder mein validate file nahi hai)
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.details[0].message 
    });
  }
  next();
};

// Sabhi routes protected hain (Sirf logged-in Admin ke liye)
router.use(authGuard);

// --- ROUTES ---

// 1. GET: Profile & GST fetching
router.get("/", profileController.getProfile);

// 2. PATCH: Identity update (Name/Email)
router.patch(
  "/update",
  validate(updateProfileSchema),
  profileController.updateProfile
);

// 3. PATCH: GST Percentage change
router.patch(
  "/gst", 
  validate(updateGSTSchema), 
  profileController.updateGST
);

// 4. PATCH: Password change logic
router.patch(
  "/password",
  validate(changePasswordSchema),
  profileController.changePassword
);

// 5. DELETE: Account termination
router.delete("/terminate", profileController.deleteAccount);

module.exports = router;