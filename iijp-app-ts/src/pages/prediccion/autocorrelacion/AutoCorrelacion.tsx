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


// // Series data
// const series1 = [
//     ['2014-01-01', 120],
//     ['2015-01-01', 130],
//     ['2016-01-01', 140],
//     ['2017-01-01', 150],
//     ['2018-01-01', 160],
//     ['2019-01-01', 170],
//     ['2020-01-01', 180],
//     ['2021-01-01', 190],
//     ['2022-01-01', 200],
//     ['2023-01-01', 210],
// ];

// const series2 = [
//     ['2017-01-01', 100],
//     ['2018-01-01', 110],
//     ['2019-01-01', 120],
//     ['2020-01-01', 130],
//     ['2021-01-01', 140],
//     ['2022-01-01', 150],
//     ['2023-01-01', 160],
// ];
// option = {
//     title: {
//         text: 'Two Time Series with Different Ranges',
//     },
//     tooltip: {
//         trigger: 'axis',
//     },
//     xAxis: {
//         type: 'time',
//         name: 'Year',
//     },
//     yAxis: {
//         type: 'value',
//         name: 'Value',
//     },
//     series: [
//         {
//             name: 'Series 1',
//             type: 'line',
//             data: series1,
//             smooth: true,
//             lineStyle: {
//                 width: 2,
//             },
//         },
//         {
//             name: 'Series 2',
//             type: 'line',
//             data: series2,
//             smooth: true,
//             lineStyle: {
//                 width: 2,
//                 type: 'dashed', // Different style for differentiation
//             },
//         },
//     ],
// };