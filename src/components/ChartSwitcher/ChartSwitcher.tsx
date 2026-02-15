import style from "./chartswitcher.module.css";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";

interface ChartSwitcherProps {
  isChart: boolean;
  onToggle: () => void;
}

export default function ChartSwitcher({ isChart, onToggle }: ChartSwitcherProps) {
  const { t } = useTranslation();
  return (
    <Button
      name={isChart ? t("statistics.tableView") : t("statistics.chartView")}
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