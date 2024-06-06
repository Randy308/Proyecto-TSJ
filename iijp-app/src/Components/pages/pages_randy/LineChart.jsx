import React from "react";
import ReactECharts from "echarts-for-react"; // import reactecharts
const LineChart = ({ option }) => {
  return (
    <ReactECharts
      option={option}
      style={{
        height: "500px",
        width: "1200px",
      }}
    />
  );
};

export default LineChart;
