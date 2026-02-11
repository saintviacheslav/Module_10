import { useState } from "react";
import style from "./descriptiontextarea.module.css";
import { Icon } from "../Icon/Icon";
import { useToast } from "../../context/ToastProvider";

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
  const [isFocused, setIsFocused] = useState(false);
  const { addToast } = useToast();

  const isMax = value.length === maxLength;
  const shouldShowInfo = value.trim().length > 0;

  const handleSubmitValidation = () => {
    if (!value.trim()) {
      addToast("Description cannot be empty", { type: "error" });
      return false;
    }

    if (isMax) {
      addToast(`Description has reached the ${maxLength} character limit`, {
        type: "warning",
      });
      return false;
    }

    return true;
  };

  return (
    <div className={`${style.container} ${className}`}>
      <textarea
        className={`${style.textarea} ${isMax ? style.textareaError : ""} ${textareaClassName}`}
        placeholder={placeholder}
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
            <Icon name="info" style={{color:"var(--inp-incorrect)"}} />
          ) : (
            <Icon name="info" style={{color:"var(--text-secondary)"}}/>
          )}

          {isMax ? (
            <p className={`${style.textareaErrorText} ${errorTextClassName}`}>
              Reached the {maxLength} text limit
            </p>
          ) : (
            <p className={`${style.secondaryText} ${secondaryTextClassName}`}>
              Max {maxLength} chars
            </p>
          )}
        </div>
      )}
    </div>
  );
}