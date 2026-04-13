import { createContext, useState, useContext, useRef, useEffect } from "react";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  // 1. Initial State: Pehle "English" rakhenge
  const [lang, setLangState] = useState("English");
  const [translations, setTranslations] = useState({});

  // 🛡️ Batching Logic Helpers
  const queue = useRef([]);
  const timer = useRef(null);
  const processing = useRef(false);

  // 🚀 PERSISTENCE: App khulte hi check karo ki user ne pehle kaunsi bhasha chuni thi
  useEffect(() => {
    const savedLang = localStorage.getItem("biogrix_selected_lang");
    if (savedLang) {
      setLangState(savedLang);
    }
  }, []);

  // 🌍 Global Language Changer: State badlega aur browser ko yaad dilayega
  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem("biogrix_selected_lang", newLang);
    // Jab bhasha badle, purani memory (state cache) khali kar sakte hain
    // taaki naye bhasha ke translations fresh load hon
    setTranslations({});
  };

  const translate = (text) => {
    if (lang === "English" || !text) return Promise.resolve(text);

    const cacheKey = `biogrix_${lang}_${text.trim()}`;

    // 1. Check State or LocalStorage
    if (translations[cacheKey]) return Promise.resolve(translations[cacheKey]);

    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return Promise.resolve(cached);
    }

    // 2. Add to Queue
    return new Promise((resolve) => {
      if (!queue.current.find((item) => item.text === text)) {
        queue.current.push({ text, resolve, cacheKey });
      } else {
        queue.current.push({ text, resolve, cacheKey, isDuplicate: true });
      }

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(processBatch, 50);
    });
  };

  const processBatch = async () => {
    if (queue.current.length === 0 || processing.current) return;

    processing.current = true;
    const currentBatch = [...queue.current];
    queue.current = [];

    const uniqueTexts = [...new Set(currentBatch.map((item) => item.text))];

    try {
      const res = await fetch("http://localhost:4000/v1/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texts: uniqueTexts,
          targetLang: lang,
        }),
      });

      const data = await res.json();

      if (data.success && data.translatedTexts) {
        const newBatchCache = {};

        uniqueTexts.forEach((original, index) => {
          const translated = data.translatedTexts[index];
          const key = `biogrix_${lang}_${original.trim()}`;
          localStorage.setItem(key, translated);
          newBatchCache[key] = translated;
        });

        currentBatch.forEach((item) => {
          const key = `biogrix_${lang}_${item.text.trim()}`;
          item.resolve(newBatchCache[key] || item.text);
        });

        setTranslations((prev) => ({ ...prev, ...newBatchCache }));
      }
    } catch (err) {
      console.error("❌ Batch Translation Failed:", err);
      currentBatch.forEach((item) => item.resolve(item.text));
    } finally {
      processing.current = false;
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    return { lang: "English", setLang: () => {}, translate: async (t) => t };
  return context;
};
