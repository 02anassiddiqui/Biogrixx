const Joi = require("joi");

const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    "string.min": "Name must be at least 3 characters long.",
    "string.base": "Name must be a text string.",
  }),
  
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address.",
  }),

  // 🚀 Fixed: Added profile_image to allow Base64 strings or URLs
  profile_image: Joi.string().allow(null, "").optional().messages({
    "string.base": "Profile image must be in a valid string format.",
  }),
});

const updateGSTSchema = Joi.object({
  gst: Joi.number().min(0).max(100).required().messages({
    "number.base": "GST must be a number.",
    "number.min": "GST cannot be negative.",
    "number.max": "GST cannot exceed 100%.",
    "any.required": "GST value is required.",
  }),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required to verify identity.",
  }),
  
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "New password must be at least 6 characters.",
    "any.required": "New password is required.",
  }),
});

module.exports = {
  updateProfileSchema,
  updateGSTSchema,
  changePasswordSchema,
};