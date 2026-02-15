import { useTranslation } from "react-i18next";
import style from "./LanguageSwitcher.module.css";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
] as const;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className={style.wrapper}>
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={`${style.langButton} ${i18n.language === code ? style.active : ""}`}
          onClick={() => i18n.changeLanguage(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
