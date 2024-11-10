import React, { useEffect, useState } from "react";
import TablaXYZ from "./TablaXYZ.jsx";
import SimpleChart from "./SimpleChart.jsx";
import { SwitchMultiChart } from "./SwitchMultiChart.jsx";
const Prueba = () => {
  const [data, setData] = useState({
    formaID: "19",
    total: 85,
    data: [
      {
        magistrado: "Rita Susana Nava Duran",
        Cochabamba_Penal: 0,
        "Cochabamba_Penal I": 0,
        "Cochabamba_Penal Ii": 1,
        "Cochabamba_Penal Liquidadora": 0,
        "La Paz_Penal": 0,
        "La Paz_Penal I": 0,
        "La Paz_Penal Ii": 0,
        "La Paz_Penal Liquidadora": 0,
        "Santa Cruz_Penal": 0,
        "Santa Cruz_Penal I": 0,
        "Santa Cruz_Penal Ii": 0,
        "Santa Cruz_Penal Liquidadora": 0,
      },
      {
        magistrado: "Norka Natalia Mercado Guzmán",
        Cochabamba_Penal: 3,
        "Cochabamba_Penal I": 12,
        "Cochabamba_Penal Ii": 4,
        "Cochabamba_Penal Liquidadora": 0,
        "La Paz_Penal": 11,
        "La Paz_Penal I": 13,
        "La Paz_Penal Ii": 7,
        "La Paz_Penal Liquidadora": 0,
        "Santa Cruz_Penal": 2,
        "Santa Cruz_Penal I": 6,
        "Santa Cruz_Penal Ii": 8,
        "Santa Cruz_Penal Liquidadora": 0,
      },
      {
        magistrado: "Ivan Manolo Lima Magne",
        Cochabamba_Penal: 0,
        "Cochabamba_Penal I": 1,
        "Cochabamba_Penal Ii": 7,
        "Cochabamba_Penal Liquidadora": 0,
        "La Paz_Penal": 0,
        "La Paz_Penal I": 4,
        "La Paz_Penal Ii": 1,
        "La Paz_Penal Liquidadora": 0,
        "Santa Cruz_Penal": 0,
        "Santa Cruz_Penal I": 0,
        "Santa Cruz_Penal Ii": 5,
        "Santa Cruz_Penal Liquidadora": 0,
      },
    ],
  });
  const [option, setOption] = useState({});

  const [estado, setEstado] = useState(true);
  const [isAbs, setIsAbs] = useState(true);
  const cambiarPorcentaje = () => {
    const total = data.total;

    const newData = data.data.map((item) => {
      const newItem = { ...item };

      for (const key in newItem) {
        if (newItem.hasOwnProperty(key)) {
          const value = newItem[key];
          const valor = parseFloat(value);

          // Check if valor is a valid number
          if (!isNaN(valor)) {
            newItem[key] = estado
              ? (valor / total) * 100 // Divide by total and round to 2 decimal places
              : (valor * total) / 100; // Multiply by total and round to 2 decimal places
          } else {
            newItem[key] = value; // If value is not a number, keep it as is
          }
        }
      }

      return newItem;
    });

    setData((prevData) => ({
      ...prevData,
      data: newData,
    }));

    setEstado(!estado);
  };

  const [headers, setHeaders] = useState([]);
  const [values, setValues] = useState([]);
  const [bandera, setBandera] = useState(true);

  const handleChartTypeChange = (type) => {
    setOption((prevOption) => SwitchMultiChart(prevOption, type.toLowerCase()));
  };

  const createSeries = (flag = false, length) => {
    const series = [];
    for (let index = 0; index < length; index++) {
      if (flag) {
        series.push({ type: "line", seriesLayoutBy: "row" });
      } else {
        series.push({ type: "line" });
      }
    }
    return series;
  };
  useEffect(() => {
    cambiarPorcentaje();
  }, [isAbs]);

  useEffect(() => {
    if (headers && values) {
      setOption(crearOption(bandera, bandera ? values.length : headers.length));
    }
  }, [headers, values, bandera]);

  const crearOption = (flag, size) => {
    return {
      legend: {},
      dataset: {
        source: [headers, ...values],
      },
      yAxis: { type: "value" },
      xAxis: { type: "category" },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        valueFormatter: (value) => value.toFixed(2),
      },
      series: createSeries(flag, size),
    };
  };

  useEffect(() => {
    const headers = Object.keys(data.data[0]).map((key) =>
      key.startsWith("Departamento_") ? key.replace("Departamento_", "") : key
    );

    setHeaders(headers);

    setValues(data.data.map((item) => Object.values(item)));
  }, [data]);
  return (
    <div>
      {data.data && data.data.length ? (
        <>
          <div>
            <TablaXYZ data={data.data} />
            <div>
              <div className="p-4 m-4">
                <select
                  id="charts"
                  onChange={(e) => handleChartTypeChange(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option disabled defaultValue>
                    Choose a chart type
                  </option>
                  <option value="line">Line</option>
                  <option value="area">Area</option>
                  <option value="bar">Bar</option>
                  <option value="column">Column</option>
                  <option value="stacked-bar">Stacked Bar</option>
                  <option value="stacked-column">Stacked Column</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => setBandera((prev) => !prev)}
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Intercambio X-Y
              </button>

              <button
                type="button"
                onClick={() => setIsAbs((prev) => !prev)}
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                {isAbs ? "Mostrar porcentajes" : "Mostrar frecuencias"}
              </button>
            </div>
          </div>
          <div>{option && <SimpleChart option={option} />}</div>
        </>
      ) : (
        <div>Hola mundo</div>
      )}
    </div>
  );
};

export default Prueba;
// series: [
//   { type: "bar", seriesLayoutBy: "row" },
//   { type: "bar", seriesLayoutBy: "row" },
//   { type: "bar", seriesLayoutBy: "row" },

//   { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
//   { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
//   { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
//   { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
//   { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
//   { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
// ],
