import React, { useEffect, useState } from "react";
import "../../styles/jurisprudencia-busqueda.css";
import "../../styles/paginate.css";
import Dropdown from "../../components/Dropdown";
import Select from "./tabs/Select";
import SimpleChart from "../../components/charts/SimpleChart";
import AsyncButton from "../../components/AsyncButton";
import { MdCleaningServices } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import GeoChart from "../../components/charts/GeoChart";
import ResolucionesService from "../../services/ResolucionesService";
import { filterForm } from "../../utils/filterForm";
const CompararDatos = () => {

  const [resoluciones, setResoluciones] = useState(null);
  const [geoData, setGeoData] = useState([]);
  const [limiteSuperior, setLimiteSuperior] = useSessionStorage(
    "limiteSuperior",
    ""
  );
  const [limiteInferior, setLimiteInferior] = useSessionStorage(
    "limiteInferior",
    ""
  );
  const [numeroBusqueda, setNumeroBusqueda] = useState(1);

  const [hasFetchedDates, setHasFetchedDates] = useSessionStorage(
    "hasFetchedDates",
    false
  );

  const [data, setData] = useSessionStorage("data", {});
  const [hasFetchedData, setHasFetchedData] = useSessionStorage(
    "hasFetchedData",
    false
  );

  const [terminos, setTerminos] = useState([]);

  const [option, setOption] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo_resolucion: "all",
    sala: "all",
    magistrado: "all",
    forma_resolucion: "all",
    tipo_jurisprudencia: "all",
    materia: "all",
  });

  useEffect(() => {
    if (!hasFetchedDates) {
      getParams();
    }
  }, []);

  const getParams = async () => {
    ResolucionesService.obtenerFechas()
      .then(({ data }) => {
        setLimiteInferior(data.inferior);
        setLimiteSuperior(data.superior);
        setHasFetchedDates(true);
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  };

  useEffect(() => {
    if (hasFetchedDates && !hasFetchedData) {
      getSelect();
    }
  }, [hasFetchedDates]);

  const getSelect = async () => {
    ResolucionesService.obtenerParametros()
      .then(({ data }) => {
        setData(data);
        setHasFetchedData(true);
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  };

  useEffect(() => {
    if (resoluciones) {
      setOption({
        title: {
          text: "Cantidad de resoluciones a lo largo del tiempo",
          padding: [20, 20, 10, 20],
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: resoluciones.map((item) => item.name),
          padding: [20, 20, 10, 20],
        },
        grid: {
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
          type: "time",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
        series: resoluciones.map((item) => item),
        grid: {
          top: "10%",
          bottom: "10%",
          left: "10%",
          right: "10%",
        },
      });
    }
  }, [resoluciones]);

  useEffect(() => {
    console.log(geoData);
  }, [geoData]);

  const obtenerResoluciones = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);


    const validatedForm = filterForm(formData);

    ResolucionesService.obtenerElemento({
      fecha_final: limiteSuperior,
      fecha_inicial: limiteInferior,
      numero_busqueda: numeroBusqueda,
      ...validatedForm,
    })
      .then((response) => {
        if (response.data.resoluciones.data.length > 0) {
          setNumeroBusqueda((prev) => prev + 1);
          setResoluciones((prev) =>
            prev
              ? [...prev, response.data.resoluciones]
              : [response.data.resoluciones]
          );

          setTerminos((prev) =>
            prev.length > 0
              ? [...prev, response.data.termino]
              : [response.data.termino]
          );

          setGeoData((prevGeoData) => {
            if (prevGeoData.length === 0) {
              return response.data.departamentos;
            }

            const geoDataMap = new Map(
              prevGeoData.map((d) => [d.name, { ...d }])
            );

            response.data.departamentos.forEach((nuevoDepartamento) => {
              const nombre = nuevoDepartamento.name;
              const nuevoIndice = `termino_${numeroBusqueda}`;

              if (geoDataMap.has(nombre)) {
                geoDataMap.get(nombre)[nuevoIndice] =
                  nuevoDepartamento[nuevoIndice];
              } else {
                geoDataMap.set(nombre, {
                  name: nombre,
                  [nuevoIndice]: nuevoDepartamento[nuevoIndice],
                });
              }
            });

            return Array.from(geoDataMap.values());
          });

          limpiarFiltros();
        } else {
          alert("No existen datos");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const removeItemById = (id) => {
    setResoluciones((prevResoluciones) =>
      prevResoluciones.filter((item) => item.id !== id)
    );

    const key = terminos.find((item) => item.id === id).name;

    setGeoData((prev) => {
      if (!key) return prev;

      return prev
        .map((item) => {
          const newItem = { ...item };
          delete newItem[key]; // Eliminar la clave específica

          // Si solo queda 'name', marcar para eliminación
          return Object.keys(newItem).length === 1 && newItem.name
            ? null
            : newItem;
        })
        .filter((item) => item !== null); // Filtrar objetos vacíos
    });

    setTerminos((prevTerminos) =>
      prevTerminos.filter((item) => item.id !== id)
    );
  };
  useEffect(() => {
    console.log(geoData);
  }, [geoData]);

  const limpiarFiltros = () => {
    setFormData({
      tipo_resolucion: "all",
      sala: "all",
      magistrado: "all",
      forma_resolucion: "all",
      tipo_jurisprudencia: "all",
      materia: "all",
    });
  };

  return (
    <div className="container mx-auto custom:px-0" id="jurisprudencia-busqueda">
      <div className="row p-4">
        <div className="flex flex-col bg-white dark:bg-[#111827] rounded-lg border border-gray-200 dark:border-gray-900  shadow mt-4">
          <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg sm:p-8 dark:bg-gray-800  dark:border-gray-900">
            <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400 m-4">
              <li className="w-full focus-within:z-10">
                <a
                  className="inline-block w-full p-4 text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                  aria-current="page"
                >
                  Series Temporales
                </a>
              </li>
              <li className="w-full focus-within:z-10">
                <Link
                  to="/busqueda"
                  className="inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Búsqueda de Resoluciones
                </Link>
              </li>
            </ul>

            <div className="grid grid-cols-3 gap-4 custom:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data &&
                Object.entries(data).map(([key, items]) => (
                  <Select
                    key={key}
                    formData={formData}
                    items={items}
                    fieldName={key}
                    setFormData={setFormData}
                  />
                ))}
            </div>
            <div className="flex flex-row justify-end gap-4 p-4">
              <div>
                <AsyncButton
                  asyncFunction={obtenerResoluciones}
                  name={"Generar Serie Temporal"}
                  isLoading={isLoading}
                />
              </div>
              <button
                className="px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-red-octopus-700 hover:bg-red-octopus-600 dark:bg-blue-700 dark:hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-red-octopus-300 rounded-lg text-center  dark:focus:ring-blue-800"
                onClick={limpiarFiltros}
              >
                <MdCleaningServices className="fill-current w-4 h-4 mr-2" />
                <span>Limpiar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row flex-wrap py-4 m-4 gap-4">
        {terminos &&
          terminos.length > 0 &&
          terminos.map((item, index) => (
            <Dropdown
              key={index}
              item={item}
              removeItemById={removeItemById}
              data={data}
            />
          ))}
      </div>
      {resoluciones && resoluciones.length > 0 && (
        <div className="p-4 bg-white text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full mb-8">
          <SimpleChart option={option} border={false}></SimpleChart>
        </div>
      )}

      {geoData && geoData.length > 0 && (
        <div className="p-4 bg-white text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg h-[600px] mb-8">
          <GeoChart contenido={geoData}></GeoChart>
        </div>
      )}
    </div>
  );
};
export default CompararDatos;
