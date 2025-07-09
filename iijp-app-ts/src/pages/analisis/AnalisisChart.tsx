import { useRef } from "react";
import ReactECharts from "echarts-for-react";
import type { ECElementEvent, ECharts, EChartsOption } from "echarts";
import "../../data/dark.js";
import { useThemeContext } from "../../context";
import type EChartsReact from "echarts-for-react";

interface AnalisisChartProps {
  option: EChartsOption;
  border?: boolean;
  handleClick?: (event: ECElementEvent) => void;
}

const AnalisisChart = ({
  option,
  border = true,
  handleClick = () => {},
}: AnalisisChartProps) => {
  const { isDark } = useThemeContext();
  const chartRef = useRef<EChartsReact | null>(null);
  const handleUpdateAxisPointer = (event: ECElementEvent) => {
    const chartInstance: ECharts | undefined =
      chartRef.current?.getEchartsInstance?.();
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

  const onEvents = {
    click: handleClick,
    updateAxisPointer: handleUpdateAxisPointer,
    // Add other event handlers as needed
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
        onEvents={onEvents}
        ref={chartRef}
      />
    </div>
  );
};

export default AnalisisChart;
