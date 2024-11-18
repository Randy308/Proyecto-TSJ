import React from "react";
import ReactECharts from "echarts-for-react";
import "../data/dark.js";
import "../data/shine.js";
import { useThemeContext } from "./ThemeProvider";
const SimpleChart = ({ option, border = true }) => {
  const isDarkMode = useThemeContext();

  return (
    <div
      className={`p-2 m-2 rounded-xl bg-white dark:bg-[#100C2A] h-[600px] ${
        border ? "border shadow-lg border-gray-300 dark:border-gray-800" : ""
      }`}
    >
      <ReactECharts
        key={JSON.stringify(option)}
        option={option}
        theme={isDarkMode ? "dark" : "shine"}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

export default SimpleChart;
