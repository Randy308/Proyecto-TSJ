import React, { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import "../../data/dark.js";
import { useThemeContext } from "../../context";
const AnalisisChart = ({ option, border = true }) => {
  const {isDark} = useThemeContext();
  const chartRef = useRef(null);

  const handleUpdateAxisPointer = (event) => {
    const chartInstance = chartRef.current?.getEchartsInstance();
    if (!chartInstance) return;

    const xAxisInfo = event.axesInfo?.[0];
    if (!xAxisInfo) return;

    const dimension = xAxisInfo.value + 1;
    chartInstance.setOption({
      series: {
        id: "pie",
        label: {
          formatter: `{b}: {@[${dimension}]} ({d}%)`,
        },
        encode: {
          value: dimension,
          tooltip: dimension,
        },
      },
    });
  };
  const handleClick = (params) => {
    console.log(params);
  };

  return (
    <div
      className={`p-2 m-2 rounded-xl bg-white dark:bg-[#100C2A] h-[600px] ${
        border ? "border shadow-lg border-gray-300 dark:border-gray-800" : ""
      }`}
    >
      <ReactECharts
        key={JSON.stringify(option)}
        option={option}
        theme={isDark ? "dark" : undefined}
        style={{
          height: "100%",
          width: "100%",
        }}
        onEvents={{
          updateAxisPointer: handleUpdateAxisPointer,
          click: handleClick,
        }}
        ref={chartRef}
      />
    </div>
  );
};

export default AnalisisChart;
