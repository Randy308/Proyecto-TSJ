export const SwitchChart = (option, action) => {
  // Copy option to ensure a new reference is returned
  let newOption = JSON.parse(JSON.stringify(option));

  // Select x and y based on existing data
  let x = newOption.xAxis.type ? newOption.xAxis : newOption.yAxis;
  let y = !newOption.xAxis.type ? newOption.xAxis : newOption.yAxis;

  delete x["boundaryGap"];
  switch (action) {
    case "line":
      newOption.series.forEach((series) => {
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
      newOption.series.forEach((series) => {
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
      newOption.series.forEach((series) => {
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
      newOption.series.forEach((series) => {
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
      newOption.series.forEach((series) => {
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
      newOption.series.forEach((series) => {
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
      newOption.series.forEach((series) => {
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
      newOption.series.forEach((series) => {
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
      newOption.series.forEach((series) => {
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
  return newOption;
};
