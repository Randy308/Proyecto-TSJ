import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react"; // import reactecharts
import "../../data/dark.js"; // Import the dark theme
import { useThemeContext } from "../../components/ThemeProvider";
import axios from "axios";
const MagistradoChart = ({ option, setData }) => {
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
      option={option}
      theme={isDarkMode ? "dark" : null}
      style={{
        height: "100%",
        width: "100%",
      }}
      ref={chartRef}
    />
  );
};

export default MagistradoChart;
