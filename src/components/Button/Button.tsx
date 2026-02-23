import style from "./button.module.css";
import React, { ReactNode } from "react";

interface ButtonProps {
  name?: string;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  [key: string]: unknown;
}

export default function Button({
  name,
  children,
  onClick,
  className = "",
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${style.templateButton} ${className}`}
      {...props}
    >
      {children || name}
    </button>
  );
}
