import React, { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react"; // import reactecharts
import "../../data/dark.js"; // Import the dark theme
import "../../data/shine.js"; // Import the dark theme
import { useThemeContext } from "../../context/ThemeProvider.jsx";
const LineChart = ({ option, setData }) => {
  const isDarkMode = useThemeContext();

  const chartRef = useRef(null);

  useEffect(() => {
    if (!setData) return;
    let instance = chartRef.current.getEchartsInstance();
    instance.on("click", (params) => {
      setData(params.name);
    });

    return () => {
      instance.off("click");
    };
  }, []);

  return (
    <ReactECharts
      option={option}
      theme={isDarkMode ? "dark" : "shine"}
      style={{
        height: "100%",
        width: "100%",
      }}
      ref={chartRef}
    />
  );
};

export default LineChart;
