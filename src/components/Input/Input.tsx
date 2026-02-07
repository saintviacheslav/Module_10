import React from "react";
import style from "./input.module.css";

type InputStatus = "default" | "success" | "error";

export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  status = "default",
  errorText,
}: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  status?: InputStatus;
  errorText?: string;
}) {
  return (
    <div className={style.wrapper}>
      <input
        value={value}
        placeholder={placeholder}
        type={type}
        className={`${style.templateInput} ${style[status]}`}
        onChange={onChange}
      />

      {status === "success" && (
        <span className={style.iconSuccess}>✓</span>
      )}

      {status === "error" && (
        <>
          <span className={style.iconError}>!</span>
          <p className={style.errorText}>{errorText}</p>
        </>
      )}
    </div>
  );
}
