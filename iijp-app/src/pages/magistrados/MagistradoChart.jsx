import React, { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react"; 
import "../../data/dark.js"; 
import { useThemeContext } from "../../components/ThemeProvider";
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
