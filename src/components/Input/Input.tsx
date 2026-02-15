import React, { useState } from "react";
import style from "./input.module.css";
import { Icon } from "../Icon/Icon";
import { useTranslation } from "react-i18next";

type InputStatus = "default" | "success" | "error";

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  status?: InputStatus;
  errorText?: string;
  [key: string]: unknown;
}

export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  status = "default",
  errorText,
  ...rest
}: InputProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={style.wrapper}>
      <div className={style.inputWrapper}>
        <input
          value={value}
          placeholder={placeholder}
          type={inputType}
          className={`${style.templateInput} ${style[status]}`}
          onChange={onChange}
          {...rest}
        />

        {type === "password" && (
          <button
            type="button"
            className={style.eyeButton}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <Icon name={showPassword ? "eye-crossed" : "eye"} size={20} />
          </button>
        )}
      </div>

      {status === "success" && (
        <div className={style.validateInfo}>
          <Icon name="like" style={{ color: "var(--fill-positive)" }} />
          <p className={style.successText}>{t("auth.passwordStrong")}</p>
        </div>
      )}

      {status === "error" && (
        <div className={style.validateInfo}>
          <Icon name="info" style={{ color: "var(--inp-incorrect)" }} />
          <p className={style.errorText}>{errorText}</p>
        </div>
      )}
    </div>
  );
}
