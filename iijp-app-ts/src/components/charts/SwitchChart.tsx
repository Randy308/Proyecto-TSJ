import type { EChartsOption } from "echarts-for-react";

export const SwitchChart = (option:EChartsOption, action:string, flag:boolean = false) => {

  const newOption:EChartsOption = JSON.parse(JSON.stringify(option));

  const x = newOption.xAxis.type ? newOption.xAxis : newOption.yAxis;
  const y = !newOption.xAxis.type ? newOption.xAxis : newOption.yAxis;

  delete x["boundaryGap"];
  switch (action) {
    case "line":
      newOption.series.forEach((series:EChartsOption['series']) => {
        series.type = "line";
        delete series["smooth"];
        delete series["stack"];
        delete series["areaStyle"];
      });
      newOption.xAxis = x;
      newOption.xAxis.boundaryGap = false;
      newOption.yAxis = y;
      break;
    case "area":
      newOption.series.forEach((series:EChartsOption['series']) => {
        series.type = "line";
        series.smooth = true;
        series.areaStyle = {};
        series.stack = "total";
      });
      newOption.xAxis = x;
      newOption.xAxis.boundaryGap = false;
      newOption.yAxis = y;
      break;
    case "bar":
      newOption.series.forEach((series:EChartsOption['series']) => {
        series.type = "bar";
        series.colorBy = "data";
        delete series["smooth"];
        delete series["stack"];
        delete series["areaStyle"];
      });
      newOption.xAxis = x;
      newOption.yAxis = y;
      break;
    case "column":
      newOption.series.forEach((series:EChartsOption['series']) => {
        series.type = "bar";
        series.colorBy = "data";
        delete series["smooth"];
        delete series["stack"];
        delete series["areaStyle"];
      });
      newOption.xAxis = y;
      newOption.yAxis = x;
      break;
    case "stacked-bar":
      newOption.series.forEach((series:EChartsOption['series']) => {
        series.type = "bar";
        series.stack = "total";
        delete series["smooth"];
        delete series["areaStyle"];
        delete series["colorBy"];
      });
      newOption.xAxis = x;
      newOption.yAxis = y;
      break;
    case "stacked-column":
      newOption.series.forEach((series:EChartsOption['series']) => {
        series.type = "bar";
        series.stack = "total";
        delete series["smooth"];
        delete series["areaStyle"];
        delete series["colorBy"];
      });
      newOption.xAxis = y;
      newOption.yAxis = x;
      break;
    case "pie":
      newOption.series.forEach((series:EChartsOption['series']) => {
        series.type = "pie";
        series.radius = ["70%"];
        delete series["smooth"];
        delete series["stack"];
        delete series["areaStyle"];
      });
      newOption.xAxis = x;
      newOption.yAxis = y;
      break;
    case "donut":
      newOption.series.forEach((series:EChartsOption['series']) => {
        series.type = "pie";
        series.radius = ["40%", "70%"];
        delete series["smooth"];
        delete series["stack"];
        delete series["areaStyle"];
      });
      newOption.xAxis = x;
      newOption.yAxis = y;
      break;
    case "scatter":
      newOption.series.forEach((series:EChartsOption['series']) => {
        series.type = "scatter";
        delete series["smooth"];
        delete series["stack"];
        delete series["areaStyle"];
      });
      newOption.xAxis = x;
      newOption.yAxis = y;
      break;
    default:
      break;
  }

  if (flag) {
    const filas = newOption.dataset.source.length;
    const columnas = newOption.dataset.source[0].length;
    const serieData = newOption.series[0];
    const length = serieData.seriesLayoutBy === "column" ? filas : columnas;
    const layout = serieData.seriesLayoutBy === "column" ? "row" : "column";
    const newSeries = [];
    for (let index = 1; index < length; index++) {
      newSeries.push({ type: serieData.type, seriesLayoutBy: layout });
    }
    newOption.series = newSeries;
  }

  return newOption;
};
