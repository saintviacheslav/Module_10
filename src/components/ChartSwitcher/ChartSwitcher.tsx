import style from "./chartswitcher.module.css";
import Button from "../Button/Button";

interface ChartSwitcherProps {
  isChart: boolean;
  onToggle: () => void;
}

export default function ChartSwitcher({ isChart, onToggle }: ChartSwitcherProps) {
  return (
    <Button
      name={isChart ? "Table view" : "Chart view"}
      onClick={onToggle}
      className={`${style.themeBlock} ${isChart ? style.dark : ""}`}
    >
      <div
        className={`${style.themeCircle} ${
          isChart ? style.themeCircleActive : ""
        }`}
      />
    </Button>
  );
}