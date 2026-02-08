import { useState } from "react";
import style from "./chartswitcher.module.css";

interface ChartSwitcherProps {
  isChart: boolean;
  onToggle: () => void;
}

export default function ChartSwitcher({ isChart, onToggle }: ChartSwitcherProps) {
  return (
    <button
      className={`${style.themeBlock} ${isChart ? style.dark : ""}`}
      onClick={onToggle}
      type="button"
    >
      <div className={`${style.themeCircle} ${isChart ? style.themeCircleActive : ""}`} />
    </button>
  );
}