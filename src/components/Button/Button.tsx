import React from "react";
import style from "./button.module.css";

interface ButtonProps {
  name: string;
  onClick?: () => void;
}
//передавать класснейм с разной шириной
export default function Button({ name, onClick, ...props }: ButtonProps) {
  return (
    <button onClick={onClick} className={style.templateButton}>
      {name}
    </button>
  );
}
