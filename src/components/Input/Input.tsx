import React from "react";
import style from "./input.module.css";

export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  ...props
}: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      type={type}
      className={style.templateInput}
      onChange={onChange}
    ></input>
  );
}
