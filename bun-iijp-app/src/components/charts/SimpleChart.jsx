import ReactECharts from "echarts-for-react";
import { useThemeContext } from "../../context";
import * as echarts from "echarts";
import dark from "../../data/dark.js";
import { useEffect } from "react";

const SimpleChart = ({ option, border = true, handleClick }) => {
  const { isDark } = useThemeContext();
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
        style={{ height: "100%", width: "100%" }}
        onEvents={{
          click: handleClick,
        }}
      />
    </div>
  );
};

export default SimpleChart;
