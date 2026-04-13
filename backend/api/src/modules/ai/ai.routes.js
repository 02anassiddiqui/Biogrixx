const express = require("express");
const router = express.Router();
const aiController = require("./ai.controller");

// 🌍 Route: POST /v1/ai/translate
// Description: Batch translation using Gemini AI for Biogrix UI elements
router.post("/translate", aiController.translateContent);

// Bhai, agar future mein Chatbot banana ho toh yahan naye routes add kar sakte ho:
// router.post("/chat", aiController.chatWithFarmer); 

module.exports = router;