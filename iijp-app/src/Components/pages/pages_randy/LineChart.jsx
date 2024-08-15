import React from "react";
import ReactECharts from "echarts-for-react"; // import reactecharts
const LineChart = ({ option }) => {
  return (
    <ReactECharts
      option={option}
      style={{
        //height: "500px",
        width: "700px",
      }}
    />
  );
};

export default LineChart;
