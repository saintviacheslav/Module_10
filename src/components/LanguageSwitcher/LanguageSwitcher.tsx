import { useTranslation } from "react-i18next";
import style from "./LanguageSwitcher.module.css";
import Button from "../Button/Button";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
] as const;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className={style.wrapper}>
      {LANGUAGES.map(({ code, label }) => (
        <Button
          key={code}
          type="button"
          className={`${style.langButton} ${i18n.language === code ? style.active : ""}`}
          onClick={() => {
            i18n.changeLanguage(code);
          }}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
