import Loading from "../../components/Loading";
import SimpleChart from "../../components/SimpleChart";
import TablaX from "../../components/TablaX";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const AnalisisSala = (id) => {
  const location = useLocation();
  const navigate = useNavigate();
  const receivedData = location.state;

  const [total, setTotal] = useState(1);

  const [data, setData] = useState(null);
  const [formaResolution, setFormaResolution] = useState(null);

  const [option, setOption] = useState({});

  const columns = [
    { accessorKey: "sala", header: "Salas", enableSorting: true },
    {
      accessorKey: "cantidad",
      header: "Frecuencia",
      enableSorting: true,
    },
    {
      accessorKey: "porcentaje",
      header: "F. Relativa (%)",
      enableSorting: true,
    },
  ];

  useEffect(() => {
    if (receivedData === null || !Array.isArray(receivedData.data)) {
      navigate("/jurisprudencia/lista-salas");
    } else {
      setTotal(receivedData.total);
      setData(receivedData.data.length > 0 ? receivedData.data : []); // Fallback for empty data
      setFormaResolution(receivedData.formaResolution);
    }
  }, [receivedData]);

  const [lista, setLista] = useState([]);

  useEffect(() => {
    console.log(data);

    if (data && data.length > 0) {
      const listas = [...data];
      listas.push({
        sala: "Total",
        cantidad: total,
        porcentaje: "100.00",
      });

      setLista(listas);

      setOption({
        xAxis: {
          type: "category",
          data: data.map((item) => item.sala),
          axisLabel: { interval: 0, rotate: 90 },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: data.map((item) => item.cantidad),
            type: "bar",
            itemStyle: {
              color: "#5470c6",
            },
          },
        ],
        grid: {
          left: "10%",
          right: "10%",
          bottom: "15%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
      });
    }
  }, [data]);

  return (
    <div className="grid grid-cols-3 gap-2 p-4 m-4 custom:grid-cols-1">
      <div>{formaResolution}</div>
      {data && data.length > 0 ? (
        <div className="col-span-2 grid grid-cols-1 gap-2">
          <TablaX data={lista} columns={columns} />
          <div className="max-w-sm mx-auto">
            <SimpleChart option={option} />
          </div>
        </div>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default AnalisisSala;
