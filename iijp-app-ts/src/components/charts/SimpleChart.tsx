import ReactECharts from "echarts-for-react";
import "../../data/dark.js";
import "../../data/shine.js";
import { useThemeContext } from "../../context/ThemeProvider.js";

interface SimpleChartProp {
  option: any;
  border?: boolean;
}
const SimpleChart = ({
  option,
  border = true,
}: SimpleChartProp) => {
  const isDarkMode = useThemeContext();

  return (
    <div
      className={`p-2 m-2 rounded-xl bg-white dark:bg-[#100C2A] h-[500px] md:h-[700px] ${
        border ? "border shadow-lg border-gray-300 dark:border-gray-800" : ""
      }`}
    >
      <ReactECharts
        key={JSON.stringify(option)}
        option={option}
        theme={isDarkMode ? "dark" : "shine"}
        style={{
          height: "100%",
          width: "100%",
        }}
        // onEvents={{
        //   click: handleClick,
        // }}
      />
    </div>
  );
};

export default SimpleChart;
