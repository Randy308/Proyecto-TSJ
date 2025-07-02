import Loading from "../../components/Loading";
import SimpleChart from "../../components/charts/SimpleChart";
import TablaX from "../../components/tables/TablaX";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SwitchChart } from "../../components/charts/SwitchChart";
import axios from "axios";
import Select from "../../components/Select";
import { MdOutlineCleaningServices } from "react-icons/md";
import AsyncButton from "../../components/AsyncButton";
import { transposeArray } from "../../utils/math";
import { LuArrowLeftRight } from "react-icons/lu";
import ResolucionesService from "../../services/ResolucionesService";
import { useVariablesContext } from "../../context/variablesContext";
import { filterParams } from "../../utils/filterForm";
import { agregarSuma } from "../../utils/arrayUtils";
const endpoint = import.meta.env.VITE_REACT_APP_BACKEND;

const AnalisisBasico = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const receivedData = location.state?.data;
  const receivedForm = location.state?.validatedData;
  const [datos, setDatos] = useState(null);
  const [columna, setColumna] = useState(null);
  const [umbral, setUmbral] = useState(0.05);
  const [option, setOption] = useState({});
  const [terminos, setTerminos] = useState(null);
  const [params, setParams] = useState(null);
  const [columns, setColumns] = useState(null);
  const [selected, setSelected] = useState();
  const [actual, setActual] = useState(true);
  const [lista, setLista] = useState([]);
  const [multiVariable, setMultiVariable] = useState(false);
  const [totalRes, setTotalRes] = useState(0);
  const [original, setOriginal] = useState([]);
  const [nombre, setNombre] = useState("Nombre");
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useVariablesContext();
  useEffect(() => {
    if (receivedForm) {
      ResolucionesService.obtenerFiltrosEstadisticos(receivedForm)
        .then((response) => {
          if (response.data) {
            setParams(filterParams(response.data, data));
          }
        })
        .catch((err) => {
          console.log("Existe un error " + err);
        });
    }
  }, [receivedForm]);

  const memoizedParams = useMemo(() => params, [params]);
  const [limite, setLimite] = useState(0);
  const [listaX, setListaX] = useState([]);
  const [checkedX, setCheckedX] = useState(false);

  useEffect(() => {
    if (receivedData === null || !Array.isArray(receivedData.data)) {
      navigate("/estadisticas-basicas");
    } else {
      setTerminos(receivedData.terminos);
      setDatos(receivedData.data.length > 0 ? receivedData.data : []);
      setOriginal(receivedData.data.length > 0 ? receivedData.data : []);
      setColumna(receivedData.columna);
      setTotalRes(receivedData.total);
      setMultiVariable(receivedData.multiVariable);
      setNombre(receivedData.nombre);
    }
  }, [receivedData]);

  const createSeries = (length) => {
    const series = [];
    for (let index = 0; index < length; index++) {
      series.push({ type: "bar", seriesLayoutBy: "column" });
    }
    return series;
  };
  useEffect(() => {
    if (datos && datos.length > 0) {
      const { nuevaLista, headers, values } = agregarSuma(
        multiVariable,
        datos,
        nombre
      );

      setLista(nuevaLista);
      setOption({
        legend: {},
        tooltip: { trigger: "item" },
        grid: { containLabel: true },
        dataset: { source: [headers, ...values] },
        toolbox: { feature: { saveAsImage: {} } },
        xAxis: { type: "category", boundaryGap: true },
        yAxis: {},
        series: createSeries(headers.length - 1),
      });
    }
  }, [datos]);

  const handleChartTypeChange = (type) => {
    setSelected(type);
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
    setIsLoading(true);

    const isMultiVariable = listaX.length > 0;

    const params = isMultiVariable
      ? { ...receivedForm, variableY: listaX[0].ids, nombreY: listaX[0].name }
      : {
          ...receivedForm,
        };

    const fetchStats = isMultiVariable
      ? ResolucionesService.realizarAnalisisXY(params)
      : ResolucionesService.realizarAnalisis(params);

    fetchStats
      .then(({ data }) => {
        console.log("Datos cargados desde API", data);
        if (data) {
          setDatos(data.data.length > 0 ? data.data : []);
          setOriginal(data.data.length > 0 ? data.data : []);

          setMultiVariable(data.multiVariable);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setSelected("bar");
        setIsLoading(false);
      });
  };

  const invertirAxis = () => {
    setSelected("column");
    setOption((prevOption) => SwitchChart(prevOption, "column", true));
    const transposed = transposeArray(lista);
    setLista(transposed);
  };

  useEffect(() => {
    if (original && original.length > 0 && totalRes > 0) {
      let acumulado = 0;
      const filteredData = original
        .map((item) => {
          if (item.cantidad / totalRes >= umbral) {
            return { nombre: item.nombre, cantidad: item.cantidad };
          } else {
            acumulado += item.cantidad;
            return null;
          }
        })
        .filter((item) => item !== null);

      if (acumulado > 0) {
        filteredData.push({ nombre: "Otros", cantidad: acumulado });
      }

      //setDatos(filteredData);
    }
  }, [original, totalRes, umbral]);

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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-1 p-2 m-2 lg:grid-cols-5">
      <div className="p-4 border border-gray-300 dark:border-gray-950 bg-white dark:bg-gray-600 rounded-lg shadow-lg">
        {columna && (
          <p className="text-black dark:text-white pb-4">
            Variable observada:
            <span className="italic font-bold capitalize"> {columna}</span>
          </p>
        )}
        <div>
          <div>
            <label
              htmlFor="charts"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tipo de gráficos
            </label>
            <select
              id="charts"
              value={selected}
              onChange={(e) => handleChartTypeChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option disabled defaultValue>
                Elige un tipo de gráfico
              </option>
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
            <label className="inline-flex items-center flex-wrap-reverse cursor-pointer m-4">
              <input
                type="checkbox"
                checked={checkedX}
                onChange={() => updateCheck()}
                className="sr-only peer"
              />
              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>

              <span className="ms-3 text-xs font-medium text-gray-900 dark:text-gray-300">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 pb-2">
              <button
                type="button"
                onClick={() => invertirAxis()}
                className="inline-flex items-center text-white bg-red-octopus-700 hover:bg-red-octopus-600 dark:bg-blue-700 dark:hover:bg-blue-600  font-medium rounded-lg text-sm px-5 py-3 text-center"
              >
                <LuArrowLeftRight className="fill-current w-4 h-4 mr-2" />
                <span className="text-xs">Intercambio X-Y</span>
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

        {datos && datos.length > 0 ? (
          <div className="max-w-sm mx-auto mt-4">
            <button
              onClick={() => setActual((prev) => !prev)}
              type="button"
              className="w-full mt-2 text-white bg-red-octopus-600 dark:bg-blue-600 hover:bg-red-octopus-800 hover:dark:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              {actual ? "Mostrar Tabla " : "Mostrar Grafico"}
            </button>
          </div>
        ) : (
          ""
        )}
      </div>

      {datos && datos.length > 0 ? (
        <div className="lg:col-span-4 md:col-span-3">
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

export default AnalisisBasico;
