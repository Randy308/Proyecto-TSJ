import React from "react";
import { useLocation } from "react-router-dom";
import LineChart from './LineChart';

const fillMissingMonths = (data) => {
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const filledData = months.map(month => {
    const foundMonth = data.find(item => item.mes === month);
    return foundMonth ? foundMonth : { mes: month, cantidad: 0 };
  });
  return filledData;
};

const ResultadoAnalisis = () => {
  const location = useLocation();
  const { data } = location.state || [];

  // Transform the data for the Nivo Line Chart
  const transformedData = data.map((item) => ({
    id: item.id,
    color: item.color,
    data: fillMissingMonths(item.data).map((subItem) => ({
      x: subItem.mes,
      y: subItem.cantidad
    }))
  }));

  return (
    <div>
      <h1>Analisis</h1>
      <div className="p-4 m-4">
      {transformedData.length > 0 ? (
        <LineChart data={transformedData} />
      ) : (
        <p>No data available</p>
      )}
      </div>
    </div>
  );
};
export default ResultadoAnalisis