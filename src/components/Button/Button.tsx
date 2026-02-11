import style from "./button.module.css";
import React, { ReactNode } from "react";

interface ButtonProps {
  name?: string;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  [key: string]: unknown;
}

export default function Button({
  name,
  children,
  onClick,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${style.templateButton} ${className}`}
      {...props}
    >
      {children || name}
    </button>
  );
}