import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext"; // 👈 Path check kar lena sahi hai ya nahi

export default function Trans({ children }) {
    const { lang, translate } = useLanguage();
    const [output, setOutput] = useState(children);

    useEffect(() => {
        // Agar English hai toh seedha dikhao
        if (lang === "English" || !children) {
            setOutput(children);
            return;
        }

        const handleTranslation = async () => {
            const translatedText = await translate(children);
            setOutput(translatedText);
        };

        handleTranslation();
    }, [lang, children, translate]);

    return <>{output}</>;
}