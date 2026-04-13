const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const translateContent = async (req, res) => {
  try {
    const { texts, targetLang } = req.body;

    // 1. Strict Validations
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Valid texts array bhejo bhai!" });
    }

    if (!targetLang) {
      return res
        .status(400)
        .json({ success: false, message: "Target language missing!" });
    }

    // 🚀 NEW: Gemini 1.5 Flash with JSON Response Mode
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      // Isse AI hamesha JSON array hi return karega
      generationConfig: { responseMimeType: "application/json" },
    });

    // 2. Clear System-style Prompt
    const prompt = `
      Translate the following strings into ${targetLang}. 
      Keep the tone professional and suitable for a biogas management platform.
      Return the results as a simple JSON array of strings in the exact same order.
      
      Strings to translate: ${JSON.stringify(texts)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // 3. Safety Check: Check if AI blocked the response
    if (response.promptFeedback?.blockReason) {
      throw new Error(
        `AI Blocked the content: ${response.promptFeedback.blockReason}`,
      );
    }

    const rawResponse = response.text().trim();

    try {
      // JSON Mode ki wajah se cleaning ki zaroorat nahi hai, but safety first
      const translatedArray = JSON.parse(rawResponse);

      // Final Check: Ensure it's still an array
      if (!Array.isArray(translatedArray)) {
        throw new Error("AI response is not an array");
      }

      console.log(
        `✅ [BATCH] Translated ${texts.length} items to ${targetLang}`,
      );

      res.json({
        success: true,
        translatedTexts: translatedArray,
      });
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", rawResponse);
      res.status(500).json({
        success: false,
        message: "AI returned invalid JSON format.",
      });
    }
  } catch (error) {
    console.error("❌ Gemini Controller Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Translation failed at backend.",
      error: error.message,
    });
  }
};

module.exports = { translateContent };
