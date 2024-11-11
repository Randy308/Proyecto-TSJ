import Loading from "../../components/Loading";
import SimpleChart from "../../components/SimpleChart";
import TablaX from "../../components/TablaX";
import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineCleaningServices } from "react-icons/md";
import { FaPlay } from "react-icons/fa6";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import BtnDropdown from "../../components/BtnDropdown";
import { SwitchChart } from "../../components/SwitchChart";
import axios from "axios";
import Select from "../../components/Select";

const endpoint = process.env.REACT_APP_BACKEND;

const AnalisisSala = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const receivedData = location.state;

  const [total, setTotal] = useState(1);

  const [data, setData] = useState(null);
  const [formaResolution, setFormaResolution] = useState(null);

  const [option, setOption] = useState({});
  const [salas, setSalas] = useState(null);
  const [params, setParams] = useState(null);
  const [columns, setColumns] = useState(null);

  const [actual, setActual] = useState(true);
  const [lista, setLista] = useState([]);

  useEffect(() => {
    // Fetch data only once on component mount
    if (salas && id) {
      axios
        .get(`${endpoint}/obtener-parametros-salas`, {
          params: {
            salas: salas,
            formaId: id,
          },
        })
        .then(({ data }) => {
          setParams(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching data", error);
        });
    }
  }, [salas, id]);

  const memoizedParams = useMemo(() => params, [params]);
  const [limite, setLimite] = useState(0);
  const [listaX, setListaX] = useState([]);
  const [checkedX, setCheckedX] = useState(false);
  const [checkedZ, setCheckedZ] = useState(false);
  useEffect(() => {
    console.log(listaX);
  }, [listaX]);

  useEffect(() => {
    if (receivedData === null || !Array.isArray(receivedData.data)) {
      navigate("/jurisprudencia/lista-salas");
    } else {
      setTotal(receivedData.total);
      setSalas(receivedData.salas);
      setData(receivedData.data.length > 0 ? receivedData.data : []);
      setFormaResolution(receivedData.formaResolution);
    }
  }, [receivedData]);

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
    if (data && data.length > 0) {
      // Initialize an object to hold the total values
      const total = { sala: "Total" };

      // Iterate over each data entry and accumulate totals
      data.forEach((entry) => {
        for (let key in entry) {
          if (key !== "sala") {
            total[key] = (total[key] || 0) + entry[key];
          }
        }
      });

      // Append the total object to the data array
      const listas = [...data, total];

      setLista(listas);

      let keys = Object.keys(data[0]);
      let values = data.map((item) => Object.values(item));
      setOption({
        legend: {},
        tooltip: {},
        dataset: {
          source: [keys, ...values],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: { type: "category",boundaryGap: false, },
        yAxis: {},
        series: createSeries(false, keys.length - 1),
      });

      setColumns(
        keys.map((item) => ({
          accessorKey: item,
          header: item
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()),
          enableSorting: true,
        }))
      );
    }
  }, [data]);
  const handleChartTypeChange = (type) => {
    setOption((prevOption) => SwitchChart(prevOption, type.toLowerCase()));
  };

  const updateFirstCheck = () => {
    const change = !checkedX;
    setCheckedX(change);
    if (!change) {
      setListaX((prev) => (prev.length > 0 ? prev.slice(1) : []));
      setLimite(0);
      setCheckedZ(false);
    } else {
      setLimite(1);
    }
  };

  const realizarAnalisis = () => {
    let myendpoint = `${endpoint}/estadisticas-x`;
    let myparams = {
      salas,
      formaId: id,
    };
    if (listaX.length > 0 && checkedX) {
      myendpoint = `${endpoint}/estadisticas-xy`;
      myparams = {
        ...myparams,
        idsY: listaX[0].ids,
        nombreY: listaX[0].name,
      };
    }

    axios
      .get(myendpoint, { params: myparams })
      .then(({ data }) => {
        console.log(data);
        setTotal(data.total);
        setData(data.data.length > 0 ? data.data : []);
      })
      .catch((error) => console.error("Error fetching data", error));
  };

  return (
    <div className="grid grid-cols-4 gap-2 p-4 m-4 custom:grid-cols-1">
      <div className="p-4 m-4 border border-gray-300 dark:border-gray-950 bg-white dark:bg-gray-600 rounded-lg shadow-lg">
        {formaResolution && (
          <p className="text-black dark:text-white pb-4">
            Forma de resolucion:
            <span className="italic font-bold"> {formaResolution}</span>
          </p>
        )}
        <div className="grid grid-cols-1 gap-2 pb-2">
          <button
            type="button"
            onClick={() => realizarAnalisis()}
            className="w-full flex justify-around items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2"
          >
            <FaPlay className="w-5 h-5" />
            Analizar
          </button>
        </div>
        <div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={checkedX}
              onChange={() => updateFirstCheck()}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Cruce por una variable
            </span>
          </label>

          {memoizedParams && (
            <Select
              memoizedParams={memoizedParams}
              limite={limite}
              listaX={listaX}
              setListaX={setListaX}
            ></Select>
          )}

          <select
            id="charts"
            onChange={(e) => handleChartTypeChange(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option disabled defaultValue>
              Elige un tipo de gráfico
            </option>
            <option value="line">Línea</option>
            <option value="bar">Barras</option>
            <option value="column">Columnas</option>
            <option value="area">Área</option>
            <option value="scatter">Dispersión</option>

            {checkedX ? (
              <>
                <option value="stacked-bar">Barras Apiladas</option>
                <option value="stacked-column">Columnas Apiladas</option>
              </>
            ) : (
              <>
                <option value="pie">Circular</option>
                <option value="donut">Dona</option>
              </>
            )}
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
