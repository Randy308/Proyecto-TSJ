export const SwitchChart = (option, action) => {
  // Copy option to ensure a new reference is returned
  let newOption = JSON.parse(JSON.stringify(option));

  // Select x and y based on existing data
  let x = newOption.xAxis.data ? newOption.xAxis : newOption.yAxis;
  let y = !newOption.xAxis.data ? newOption.xAxis : newOption.yAxis;

  switch (action) {
    case "line":
      newOption.series[0].type = "line";
      newOption.xAxis = x;
      newOption.yAxis = y;
      break;
    case "bar":
      newOption.series[0].type = "bar";
      newOption.xAxis = x;
      newOption.yAxis = y;
      break;
    case "column":
      newOption.series[0].type = "bar";
      newOption.xAxis = y;
      newOption.yAxis = x;
      break;
    case "pie":
      newOption.series[0].type = "pie";
      newOption.xAxis = x;
      newOption.yAxis = y;
      newOption.series[0].radius = ["70%"];
      break;
    case "donut":
      newOption.series[0].type = "pie";
      newOption.xAxis = x;
      newOption.yAxis = y;
      newOption.series[0].radius = ["40%", "70%"];
      break;
    case "scatter":
      newOption.series[0].type = "scatter";
      newOption.xAxis = x;
      newOption.yAxis = y;
      break;
    default:
      break;
  }
  return newOption;
};
