import ReactECharts from "echarts-for-react";
import "../../data/dark.js";
import { useThemeContext } from "../../context";
import type { ECElementEvent } from "echarts";
interface SimpleChartProp {
  option: object;
  border?: boolean;
  handleClick?: (params: ECElementEvent) => void;
}
const SimpleChart = ({
  option,
  border = true,
  handleClick = (params) => console.log(params),
}: SimpleChartProp) => {
  const {isDark} = useThemeContext();

  return (
    <div
      className={`p-2 m-2 rounded-xl bg-white dark:bg-[#100C2A] h-[500px] md:h-[700px] ${
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
          click: handleClick,
        }}
      />
    </div>
  );
};

export default SimpleChart;
