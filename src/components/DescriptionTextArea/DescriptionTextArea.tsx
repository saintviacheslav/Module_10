import { useState } from "react";
import style from "./descriptiontextarea.module.css";
import { Icon } from "../Icon/Icon";
import { useToast } from "../../context/ToastProvider";
import { useTranslation } from "react-i18next";

interface DescriptionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  className?: string;
  textareaClassName?: string;
  validateInfoClassName?: string;
  errorTextClassName?: string;
  secondaryTextClassName?: string;
}

export default function DescriptionTextarea({
  value,
  onChange,
  maxLength = 200,
  placeholder = "Write description here...",
  className = "",
  textareaClassName = "",
  validateInfoClassName = "",
  errorTextClassName = "",
  secondaryTextClassName = "",
}: DescriptionTextareaProps) {
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [isFocused, setIsFocused] = useState(false);

  const isMax = value.length === maxLength;
  const shouldShowInfo = value.trim().length > 0;

  const handleSubmitValidation = () => {
    if (!value.trim()) {
      addToast(t("comment.descriptionEmpty"), { type: "error" });
      return false;
    }

    if (isMax) {
      addToast(
        t("modalPost.characterLimit", { max: maxLength }),
        { type: "warning" }
      );
      return false;
    }

    return true;
  };

  return (
    <div className={`${style.container} ${className}`}>
      <textarea
        className={`${style.textarea} ${isMax ? style.textareaError : ""} ${textareaClassName}`}
        placeholder={t("profile.writeDescriptionPlaceholder")}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue.length <= maxLength) {
            onChange(newValue);
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rows={4}
      />

      {shouldShowInfo && (
        <div className={`${style.validateInfo} ${validateInfoClassName}`}>
          {isMax ? (
            <Icon name="info" style={{ color: "var(--inp-incorrect)" }} />
          ) : (
            <Icon name="info" style={{ color: "var(--text-secondary)" }} />
          )}

          {isMax ? (
            <p className={`${style.textareaErrorText} ${errorTextClassName}`}>
              {t("modalPost.characterLimit", { max: maxLength })}
            </p>
          ) : (
            <p className={`${style.secondaryText} ${secondaryTextClassName}`}>
              {t("common.maxChars", { max: maxLength })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}