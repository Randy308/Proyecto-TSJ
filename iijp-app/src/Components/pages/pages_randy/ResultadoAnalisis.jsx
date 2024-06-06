import React from "react";
import { useLocation } from "react-router-dom";
import LineChart from "./LineChart";

const fillMissingMonths = (data) => {
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const filledData = months.map((month) => {
    const foundMonth = data.find((item) => item.mes === month);
    return foundMonth ? foundMonth : { mes: month, cantidad: 0 };
  });
  return filledData;
};

const ResultadoAnalisis = () => {
  const location = useLocation();
  const { data } = location.state || [];

  // Transform the data for the Nivo Line Chart
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo","Junio","Julio", "Agosto","Septiembre", "Octubre","Noviembre" ,"Diciembre"]
  const leyenda = data.map(item => item.id);
  const transformedData = data.map((item) => ({
    name: item.id,
    type: "line",
    data: fillMissingMonths(item.data).map((subItem) => subItem.cantidad),
  }));

  console.log(meses)
  
  console.log(leyenda)

  console.log(transformedData)

  const option = {
    title: {
      text: "Grafico de lineas",
      left: 'center',  
      top: '5%',       
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: leyenda,
      top: '10%',      
      left: 'center',  
    },
    grid: {
      top: '20%',      
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: meses,
    },
    yAxis: {
      type: "value",
    },
    series: transformedData,
  };

  return (
    <div>
      <h1>Analisis</h1>
      <div className="p-4 m-4 flex items-center justify-center" > 
        {transformedData.length > 0 ? (
          <LineChart option={option} />
        ) : (
          <p>No existe informacion</p>
        )}
      </div>
    </div>
  );
};
export default ResultadoAnalisis;
