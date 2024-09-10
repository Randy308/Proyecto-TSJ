import React from "react";
import ReactECharts from "echarts-for-react"; // import reactecharts
import '../../data/dark.js'; // Import the dark theme
import { useThemeContext } from "../../components/ThemeProvider";
const LineChart = ({ option }) => {

  const isDarkMode = useThemeContext();
  return (
    <ReactECharts
      option={option} theme={isDarkMode ? 'dark' : null} 
      style={{
        height: "100%",
        width: "100%",
      }}
    />
  );
};

export default LineChart;
