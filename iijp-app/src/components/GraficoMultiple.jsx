import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import "../data/dark.js"; // Import the dark theme
import { useThemeContext } from "./ThemeProvider";
import { useFreeApi } from "../hooks/api/useFreeApi";
import Loading from "./Loading";
const GraficoMultiple = ({ url }) => {
  const { contenido, isLoading, error } = useFreeApi(url);
  const [cabeceras, setCabeceras] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    console.log(contenido);
    if (contenido != null) {
      setCabeceras(contenido.cabeceras);
      
      setData(
        contenido.data.map((item) => ({
          name: item.name,
          type: "bar",
          stack: "total",
          label: {
            show: true,
          },
          emphasis: {
            focus: "series",
          },
          data: item.data,
        }))
      );
    }
  }, [contenido]);

  const isDarkMode = useThemeContext();

  if (isLoading) return <Loading />;
  if (error) return <p>{error}</p>;

  if (!Array.isArray(data) || data.length === 0) {
    return <p className="titulo p-4 text-center">No hay datos disponibles.</p>;
  }
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {},
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      data: cabeceras,
    },
    series: data,
  };
  return (
    <ReactECharts
      theme={isDarkMode ? "dark" : null}
      option={option}
      style={{
        height: "100%",
        width: "100%",
      }}
    />
  );
};

export default GraficoMultiple;
