import React, { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import "../../data/dark.js";
import "../../data/shine.js";
import { useThemeContext } from "../../context/ThemeProvider.jsx";
const SimpleChart = ({ option, border = true }) => {
  const isDarkMode = useThemeContext();
  const chartRef = useRef(null);
  
  useEffect(() => {
    let instance = chartRef.current.getEchartsInstance();
    instance.on("click", (params) => {
      console.log(params.name+" "+params.seriesName);
    });
  }, []);
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
        ref={chartRef}
      />
    </div>
  );
};

export default SimpleChart;
