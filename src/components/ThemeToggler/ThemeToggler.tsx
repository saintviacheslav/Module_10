import React from "react";
import style from "./theme.module.css";
import { useTheme } from "../../context/ThemeProvider";

export default function ThemeToggler() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className={style.themeToggler}>
      {theme === "light" ? "☀️" : "🌔"}
    </button>
  );
}
