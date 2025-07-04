import React, { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";

import { useThemeContext } from "../../context/themeProvider";
const MagistradoChart = ({ option, setData }) => {
  const {isDarkMode} = useThemeContext();
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
      theme={isDarkMode ? "dark" : undefined}
      style={{
        height: "100%",
        width: "100%",
      }}
      ref={chartRef}
    />
  );
};

export default MagistradoChart;
