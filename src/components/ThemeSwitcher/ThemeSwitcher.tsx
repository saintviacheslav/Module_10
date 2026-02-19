import { useTheme } from "../../context/ThemeProvider";
import style from "../ThemeSwitcher/themeswitcher.module.css";
import { Theme } from "../../context/ThemeProvider";
import Button from "../Button/Button";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === Theme.DARK;

  return (
    <Button
      onClick={toggleTheme}
      className={`${style.themeBlock} ${isDark ? style.dark : ""}`}
    >
      <span
        className={`${style.themeCircle} ${
          isDark ? style.themeCircleActive : ""
        }`}
      />
    </Button>
  );
}