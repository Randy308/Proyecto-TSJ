import SimpleChart from "../../../components/SimpleChart";
import React, { useEffect, useState } from "react";

const AutoCorrelacion = ({ pacf, acf }) => {
  const [option, setOption] = useState(null);
  useEffect(() => {
    if (pacf && acf) {
      setOption({
        title: [
          {
            left: "center",
            text: "Función de auto correlación",
          },
          {
            top: "55%",
            left: "center",
            text: "Función de auto correlación parcial",
          },
        ],
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach(function (item) {
              if (item.seriesType === "scatter") {
                // Show both x and y values
                result +=
                  "X: " +
                  item.value[0] +
                  "<br>" +
                  "Y: " +
                  item.value[1].toFixed(4) +
                  "<br>";
              }
            });
            return result;
          },
        },
        xAxis: [
          {
            data: acf.map((_, index) => index),
          },
          {
            data: pacf.map((_, index) => index),
            gridIndex: 1,
          },
        ],
        yAxis: [
          {},
          {
            gridIndex: 1,
          },
        ],
        grid: [
          {
            bottom: "60%", // Adjust grid for ACF plot
          },
          {
            top: "60%", // Adjust grid for PACF plot
          },
        ],
        series: [
          {
            type: "scatter",
            symbolSize: 10,
            data: acf,
          },
          {
            type: "bar",
            barWidth: "4%",
            data: acf,
          },
          {
            type: "scatter",
            symbolSize: 10,
            data: pacf,
            xAxisIndex: 1,
            yAxisIndex: 1,
          },
          {
            type: "bar",
            barWidth: "4%",
            data: pacf,
            xAxisIndex: 1,
            yAxisIndex: 1,
          },
        ],
      });
    }
  }, [pacf, acf]);

  return <div>{option && <SimpleChart option={option} />}</div>;
};

export default AutoCorrelacion;
