import React, { useEffect, useState } from "react";
import TablaXYZ from "./TablaXYZ.jsx";
const Prueba = () => {
  const [data, setData] = useState({
    formaID: "7",
    total: 931,
    data: [
      {
        sala: "Civil I",
        "Departamento_Santa Cruz": 145,
        Departamento_Oruro: 62,
        Departamento_Chuquisaca: 89,
        Departamento_Desconocido: 2,
        Departamento_Cochabamba: 138,
        "Departamento_La Paz": 137,
        Departamento_Tarija: 45,
        Departamento_Potosí: 58,
        Departamento_Pando: 17,
        Departamento_Beni: 42,
      },
      {
        sala: "Civil Liquidadora",
        "Departamento_Santa Cruz": 0,
        Departamento_Oruro: 0,
        Departamento_Chuquisaca: 0,
        Departamento_Desconocido: 0,
        Departamento_Cochabamba: 0,
        "Departamento_La Paz": 0,
        Departamento_Tarija: 0,
        Departamento_Potosí: 0,
        Departamento_Pando: 0,
        Departamento_Beni: 0,
      },
      {
        sala: "Civil",
        "Departamento_Santa Cruz": 37,
        Departamento_Oruro: 20,
        Departamento_Chuquisaca: 10,
        Departamento_Desconocido: 0,
        Departamento_Cochabamba: 49,
        "Departamento_La Paz": 48,
        Departamento_Tarija: 9,
        Departamento_Potosí: 10,
        Departamento_Pando: 3,
        Departamento_Beni: 10,
      },
    ],
  });

  const [estado, setEstado] = useState(true);
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
              ? (valor / total).toFixed(2)  // Divide by total and round to 2 decimal places
              : (valor * total).toFixed(2); // Multiply by total and round to 2 decimal places
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

  useEffect(() => {
    console.log(data.data);
  }, [data]);
  return (
    <div>
      {data.data && data.data.length ? (
        <div>
          <TablaXYZ data={data.data} />
          <div>
            {" "}
            <button onClick={() => cambiarPorcentaje()}>
              Cambiar A porcentaje
            </button>
          </div>
        </div>
      ) : (
        <div>Hola mundo</div>
      )}
    </div>
  );
};

export default Prueba;

// const option = {
//     legend: {},
//     tooltip: {},
//     dataset: {
//       source: [
//         [
//           "product",
//           "2012_Mujeres",
//           "2012_Hombres",
//           "2013_Mujeres",
//           "2013_Hombres",
//           "2014_Mujeres",
//           "2014_Hombres",
//           "2015_Mujeres",
//           "2015_Hombres",
//         ],
//         ["Matcha Latte", 21.1, 20, 15.4, 15, 35.1, 30, 28.3, 25],
//         ["Milk Tea", 46.5, 40, 50.1, 42, 45.7, 40, 43.1, 40],
//         ["Cheese Cocoa", 14.1, 10, 37.2, 30, 39.5, 40, 46.4, 40],
//       ],
//     },
//     xAxis: [
//       { type: "category", gridIndex: 0 },
//       { type: "category", gridIndex: 1 },
//     ],
//     yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }],
//     grid: [{ bottom: "55%" }, { top: "55%" }],
//     series: [
//       Series por genero
//       { type: "bar", seriesLayoutBy: "row" },
//       { type: "bar", seriesLayoutBy: "row" },
//       { type: "bar", seriesLayoutBy: "row" },

//       Series por año
//       { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
//       { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
//       { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
//       { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
//       { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
//       { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
//     ],
//   };
