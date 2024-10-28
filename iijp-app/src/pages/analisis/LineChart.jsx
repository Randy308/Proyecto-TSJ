import React, { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react"; // import reactecharts
import "../../data/dark.js"; // Import the dark theme
import "../../data/shine.js"; // Import the dark theme
import { useThemeContext } from "../../components/ThemeProvider";
const LineChart = ({ option, setData }) => {
  const isDarkMode = useThemeContext();

  const chartRef = useRef(null);

  useEffect(() => {
    let instance = chartRef.current.getEchartsInstance();
    instance.on("click", (params) => {
      setData(params.name);
    });
  }, []);

  return (
    <ReactECharts
      option={{
        ...option,
        grid: {
          top: "10%", // Adjust top padding
          bottom: "10%", // Adjust bottom padding
          left: "10%", // Adjust left padding
          right: "10%", // Adjust right padding
        },
      }}
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
