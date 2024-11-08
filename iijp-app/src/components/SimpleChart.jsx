import React from "react";
import ReactECharts from "echarts-for-react"; 
import "../data/dark.js";
import "../data/shine.js";
import { useThemeContext } from "./ThemeProvider";
const SimpleChart = ({ option }) => {
  const isDarkMode = useThemeContext();

  return (
    <ReactECharts
      option={option} className="h-[600px] w-[400px] custom:w-auto"
      theme={isDarkMode ? "dark" : "shine"}
      style={{
        height: "100%",
        width: "100%",
      }}
    />
  );
};

export default SimpleChart;
