import Loading from "../../components/Loading";
import SimpleChart from "../../components/SimpleChart";
import TablaX from "../../components/TablaX";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SwitchChart } from "../../components/SwitchChart";
import axios from "axios";
import Select from "../../components/Select";
import { MdOutlineCleaningServices } from "react-icons/md";
import AsyncButton from "../../components/AsyncButton";
const endpoint = process.env.REACT_APP_BACKEND;

const AnalisisSala = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const receivedData = location.state;

  const [data, setData] = useState(null);
  const [formaResolution, setFormaResolution] = useState(null);

  const [option, setOption] = useState({});
  const [salas, setSalas] = useState(null);
  const [params, setParams] = useState(null);
  const [columns, setColumns] = useState(null);

  const [actual, setActual] = useState(true);
  const [lista, setLista] = useState([]);
  const [multiVariable, setMultiVariable] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
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
  useEffect(() => {
    console.log(listaX);
  }, [listaX]);

  useEffect(() => {
    if (receivedData === null || !Array.isArray(receivedData.data)) {
      navigate("/jurisprudencia/lista-salas");
    } else {
      setSalas(receivedData.salas);
      setData(receivedData.data.length > 0 ? receivedData.data : []);
      setFormaResolution(receivedData.formaResolution);
    }
  }, [receivedData]);

  const createSeries = (length) => {
    const series = [];
    for (let index = 0; index < length; index++) {
      series.push({ type: "line", seriesLayoutBy: "column" });
    }
    return series;
  };
  useEffect(() => {
    if (data && data.length > 0) {
      const totalCounts = { sala: "Total" };

      const processedData = multiVariable
        ? data.map((item) => {
            const total = Object.entries(item).reduce(
              (sum, [key, value]) => (key !== "sala" ? sum + value : sum),
              0
            );
            return { ...item, Total: total };
          })
        : data;

      processedData.forEach((entry) => {
        Object.keys(entry).forEach((key) => {
          if (key !== "sala") {
            totalCounts[key] = (totalCounts[key] || 0) + entry[key];
          }
        });
      });

      setLista([...processedData, totalCounts]);

      const headers = Object.keys(data[0]).map(
        (item) => item.charAt(0).toUpperCase() + item.slice(1)
      );
      const values = processedData.map((item) => Object.values(item));

      setOption({
        legend: {},
        tooltip: { trigger: "item" },
        dataset: { source: [headers, ...values] },
        toolbox: { feature: { saveAsImage: {} } },
        xAxis: { type: "category", boundaryGap: true },
        yAxis: {},
        series: createSeries(headers.length - 1),
      });
    }
  }, [data]);

  const handleChartTypeChange = (type) => {
    setOption((prevOption) => SwitchChart(prevOption, type.toLowerCase()));
  };

  const updateCheck = () => {
    const change = !checkedX;
    setCheckedX(change);
    if (!change) {
      setListaX([]);
      setLimite(0);
    } else {
      setLimite(1);
    }
  };

  const realizarAnalisis = () => {
    const isMultiVariable = listaX.length > 0 && checkedX;
    setIsLoading(true);
    const endpointPath = isMultiVariable
      ? `${endpoint}/estadisticas-xy`
      : `${endpoint}/estadisticas-x`;
    const params = isMultiVariable
      ? {
          salas,
          formaId: id,
          idsY: listaX[0].ids,
          nombreY: listaX[0].name,
        }
      : { salas, formaId: id };

    axios
      .get(endpointPath, { params })
      .then(({ data }) => {
        setData(data.data.length > 0 ? data.data : []);
        setMultiVariable(isMultiVariable);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  };
  function transposeArray(data) {
    const transposed = {};
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (!transposed[key]) {
          transposed[key] = [];
        }
        transposed[key].push(item[key]);
      });
    });

    const result = Object.entries(transposed).map(([key, values]) => [
      key,
      ...values,
    ]);
    const headers = result[0];

    const keyValueArray = result.slice(1).map((row) => {
      return headers.reduce((obj, header, index) => {
        obj[header] = row[index];
        return obj;
      }, {});
    });
    return keyValueArray;
  }

  const invertirAxis = () => {
    setOption((prevOption) => SwitchChart(prevOption, "default", true));
    const transposed = transposeArray(lista);
    console.log(transposed);
    setLista(transposed);
  };

  useEffect(() => {
    if (lista && lista.length > 0) {
      let keys = Object.keys(lista[0]);
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
  }, [lista]);
  return (
    <div className="grid grid-cols-4 gap-2 p-4 m-4 custom:grid-cols-1">
      <div className="p-4 m-4 border border-gray-300 dark:border-gray-950 bg-white dark:bg-gray-600 rounded-lg shadow-lg">
        {formaResolution && (
          <p className="text-black dark:text-white pb-4">
            Forma de resolucion:
            <span className="italic font-bold"> {formaResolution}</span>
          </p>
        )}
        <div>
          <div>
            <label
              for="charts"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tipo de graficos
            </label>
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

              {multiVariable ? (
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
          <div>
            <label className="inline-flex items-center cursor-pointer m-4">
              <input
                type="checkbox"
                checked={checkedX}
                onChange={() => updateCheck()}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Cruce por una variable
              </span>
            </label>
          </div>
          <div className={` ${checkedX ? "" : "hidden"}  `}>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Variables
            </label>
            {memoizedParams && (
              <Select
                memoizedParams={memoizedParams}
                limite={limite}
                listaX={listaX}
                setListaX={setListaX}
              ></Select>
            )}
            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                type="button"
                onClick={() => invertirAxis()}
                className="inline-flex items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center"
              >
                <MdOutlineCleaningServices className="fill-current w-4 h-4 mr-2" />
                <span>Invertir Axis</span>
              </button>

              <AsyncButton
                name={"Analizar"}
                asyncFunction={realizarAnalisis}
                isLoading={isLoading}
                full={false}
              />
            </div>
          </div>
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
