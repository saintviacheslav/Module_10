import { useTheme } from "../../context/ThemeProvider";
import style from "../ThemeSwitcher/themeswitcher.module.css";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      className={`${style.themeBlock} ${isDark ? style.dark : ""}`}
      onClick={toggleTheme}
    >
      <div className={`${style.themeCircle} ${isDark ? style.themeCircleActive : ""}`} />
    </button>
  );
}