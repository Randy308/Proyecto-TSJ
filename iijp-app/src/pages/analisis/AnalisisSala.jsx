import Loading from "../../components/Loading";
import SimpleChart from "../../components/SimpleChart";
import TablaX from "../../components/TablaX";
import React, { useEffect, useState } from "react";
import { MdOutlineCleaningServices } from "react-icons/md";
import { FaPlay } from "react-icons/fa6";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import BtnDropdown from "../../components/BtnDropdown";
import { SwitchChart } from "../../components/SwitchChart";

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

  const [actual, setActual] = useState(true);
  const [visible, setVisible] = useState(true);
  const [lista, setLista] = useState([]);

  useEffect(() => {
    if (receivedData === null || !Array.isArray(receivedData.data)) {
      navigate("/jurisprudencia/lista-salas");
    } else {
      setTotal(receivedData.total);
      setData(receivedData.data.length > 0 ? receivedData.data : []);
      setFormaResolution(receivedData.formaResolution);
    }
  }, [receivedData]);

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
        tooltip: {
          trigger: "item",
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          data: data.map((item) => item.sala),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: data.map((item) => ({
              value: item.cantidad,
              name: item.sala,
            })),
            type: "line",
            radius: ["40%", "70%"],
          },
        ],
      });
    }
  }, [data]);
  const handleChartTypeChange = (type) => {
   setOption((prevOption) => SwitchChart(prevOption, type.toLowerCase()));
  };
  return (
    <div className="grid grid-cols-4 gap-2 p-4 m-4 custom:grid-cols-1">
      <div className="p-4 m-4 border border-gray-300 dark:border-gray-950 bg-white dark:bg-gray-600 rounded-lg shadow-lg">
        <p className="text-black dark:text-white pb-4">
          Forma de resolucion:
          <span className="italic font-bold"> {formaResolution}</span>
        </p>
        <div className="grid grid-cols-2 gap-2 pb-2 custom:grid-cols-1">
          <button
            type="button"
            className="w-full flex justify-around text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2"
          >
            <MdOutlineCleaningServices className="w-5 h-5" />
            Limpiar
          </button>
          <button
            type="button"
            className="w-full flex justify-around items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2"
          >
            <FaPlay className="w-5 h-5" />
            Analizar
          </button>
        </div>
        <div>
          <BtnDropdown setVisible={setVisible} visible={visible}></BtnDropdown>

          <select
            id="charts"
            onChange={(e) => handleChartTypeChange(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option disabled defaultValue>
              Choose a chart type
            </option>
            <option value="Line">Line</option>
            <option value="Bar">Bar</option>
            <option value="Column">Column</option>
            <option value="Pie">Pie</option>
            <option value="Donut">Donut</option>
            <option value="Scatter">Scatter</option>
          </select>
        </div>

        {data && data.length > 0 ? (
          <div className="max-w-sm mx-auto mt-4">
            <button
              onClick={() => setActual((prev) => !prev)}
              type="button"
              className="w-full mt-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              {actual ? "Mostrar Tabla " : "Mostrar Grafico"}
            </button>
          </div>
        ) : (
          ""
        )}
      </div>

      {data && data.length > 0 ? (
        <div className="col-span-3 grid grid-cols-1">
          {!actual ? (
            <TablaX data={lista} columns={columns} />
          ) : (
            <SimpleChart option={option} />
          )}
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
