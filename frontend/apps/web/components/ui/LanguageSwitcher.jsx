import { useLang } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, switchLang } = useLang();
  return (
    <select 
      value={lang} 
      onChange={(e) => switchLang(e.target.value)}
      className="bg-transparent text-sm font-bold border rounded p-1"
    >
      <option value="en">EN</option>
      <option value="hi">HI</option>
    </select>
  );
}