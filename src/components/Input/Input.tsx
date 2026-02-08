import React from "react";
import style from "./input.module.css";
import { Icon } from "../Icon/Icon";

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

      {status === "success" && <span className={style.iconSuccess}>✓</span>}

      {status === "error" && (
        <div className={style.validateInfo}>
          <Icon name="info" style={{ color: "var(--inp-incorrect)" }}></Icon>
          <p className={style.errorText}>{errorText}</p>
        </div>
      )}
      <>
      </>
    </div>
  );
}
