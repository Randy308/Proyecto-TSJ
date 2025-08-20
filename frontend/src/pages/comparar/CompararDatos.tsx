import React, { useEffect, useState } from "react";
import Dropdown from "../../components/Dropdown";
import SimpleChart from "../../components/charts/SimpleChart";
import AsyncButton from "../../components/AsyncButton";
import { MdCleaningServices } from "react-icons/md";
import { filterForm } from "../../utils/filterForm";
import SimpleSelect from "../../components/SimpleSelect";
import type { SimpleSearchFormData } from "../../types/search";
import { ResolucionesService } from "../../services";
import MapComponent from "../../analisis/components/MapComponent";

interface Resolucion {
  cantidad: string;
  periodo: string;
  id: number;
  name: string;
  type: string;
}

interface Termino {
  id: number;
  name: string;
  detalles: string;
  value: string;
}

type RegionValue = {
  nombre: string;
  cantidad: number;
};

const CompararDatos = () => {
  const [resoluciones, setResoluciones] = useState<Resolucion[] | null>(null);
  // const [geoData, setGeoData] = useState([]);

  const [terminos, setTerminos] = useState<Termino[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [departamentos, setDepartamentos] = useState<RegionValue[]>([
    { nombre: "Cochabamba", cantidad: 0 },
    { nombre: "La Paz", cantidad: 0 },
    { nombre: "Santa Cruz", cantidad: 0 },
    { nombre: "Potosí", cantidad: 0 },
    { nombre: "Oruro", cantidad: 0 },
    { nombre: "El Beni", cantidad: 0 },
    { nombre: "Chuquisaca", cantidad: 0 },
    { nombre: "Tarija", cantidad: 0 },
    { nombre: "Pando", cantidad: 0 },
  ]);

  const [option, setOption] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SimpleSearchFormData>({
    campo: "proceso",
    busqueda: "proceso",
  });

  useEffect(() => {
    if (resoluciones) {
      const fechas = resoluciones.map((r) => r.periodo);
      const valores = resoluciones.map((r) => r.cantidad);

      setOption({
        tooltip: {
          trigger: "axis",
        },
        title: {
          left: "center",
          text: "Large Area Chart",
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: fechas, // solo las fechas
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 10,
          },
          {
            start: 0,
            end: 10,
          },
        ],
        series: [
          {
            name: "Resoluciones",
            type: "line",
            itemStyle: {},
            areaStyle: {},
            data: valores, // solo los valores
          },
        ],
      });
    }
  }, [resoluciones]);

  const obtenerResoluciones = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    const validatedForm = filterForm(formData);

    ResolucionesService.obtenerElemento({
      ...validatedForm,
    })
      .then((response) => {
        if (response.data) {
          console.log("Response:", response.data.departamentos);

          const res = response.data.departamentos;

          const total = res.reduce(
            (acc: number, item: RegionValue) => acc + item.cantidad,
            0
          );

          const periodosTotal = response.data.periodos.reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (acc: number, item: any) => acc + item.cantidad,
            0
          );
          console.log("Total periodos:", periodosTotal);
          console.log("Total departamentos:", total);
          setResoluciones(response.data.periodos);

          setDepartamentos(
            response.data.departamentos.map((item: RegionValue) => ({
              nombre: item.nombre,
              cantidad: Math.round(100 * (item.cantidad / total)),
            }))
          );
        }
        // if (response.data.resoluciones.data.length > 0) {
        //   setResoluciones((prev) =>
        //     prev
        //       ? [...prev, response.data.resoluciones]
        //       : [response.data.resoluciones]
        //   );

        //   setTerminos((prev) =>
        //     prev.length > 0
        //       ? [...prev, response.data.termino]
        //       : [response.data.termino]
        //   );

        //   // setGeoData((prevGeoData) => {
        //   //   if (prevGeoData.length === 0) {
        //   //     return response.data.departamentos.map((d) => ({
        //   //       name: d.name,
        //   //       results: {
        //   //         [`termino_${numeroBusqueda}`]: d[`termino_${numeroBusqueda}`],
        //   //       },
        //   //     }));
        //   //   }

        //   //   const geoDataMap = new Map(
        //   //     prevGeoData.map((d) => [d.name, { ...d }])
        //   //   );

        //   //   response.data.departamentos.forEach((nuevoDepartamento) => {
        //   //     const nombre = nuevoDepartamento.name;
        //   //     const nuevoIndice = `termino_${numeroBusqueda}`;
        //   //     const nuevoValor = nuevoDepartamento[nuevoIndice];

        //   //     if (geoDataMap.has(nombre)) {
        //   //       const existente = geoDataMap.get(nombre);

        //   //       if (!existente.results) {
        //   //         existente.results = {};
        //   //       }

        //   //       existente.results[nuevoIndice] = nuevoValor;
        //   //     } else {
        //   //       geoDataMap.set(nombre, {
        //   //         name: nombre,
        //   //         results: {
        //   //           [nuevoIndice]: nuevoValor,
        //   //         },
        //   //       });
        //   //     }
        //   //   });

        //   //   return Array.from(geoDataMap.values());
        //   // });

        //   limpiarFiltros();
        // } else {
        //   alert("No existen datos");
        // }
      })
      .catch((error: unknown) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const removeItemById = (id: number) => {
    setResoluciones((prevResoluciones) =>
      (prevResoluciones || []).filter((item) => item.id !== id)
    );

    const keyItem = terminos.find((item) => item.id === id);
    if (!keyItem) return;

    // const terminoKey = keyItem.name;

    // setGeoData((prevGeoData) =>
    //   prevGeoData
    //     .map((item) => {
    //       const newItem = { ...item, results: { ...item.results } };
    //       delete newItem.results[terminoKey];

    //       // Si `results` queda vacío, eliminar el objeto
    //       return Object.keys(newItem.results).length === 0 ? null : newItem;
    //     })
    //     .filter((item) => item !== null)
    // );

    setTerminos((prevTerminos) =>
      prevTerminos.filter((item) => item.id !== id)
    );
  };
  const memoRemoveItemById = React.useCallback(removeItemById, [terminos]);

  const limpiarFiltros = () => {
    setFormData({
      campo: "Proceso",
      busqueda: "",
    });
  };

  const updateFormData = (key: keyof typeof formData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <div
      className="px-1 sm:px-5 md:px-10 lg:px-40 custom:px-0"
      id="jurisprudencia-busqueda"
    >
      <div className="row p-4">
        <div className="flex flex-col bg-white dark:bg-[#111827] rounded-lg border border-gray-200 dark:border-gray-900  shadow mt-4">
          <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg sm:p-8 dark:bg-gray-800  dark:border-gray-900">
            <form className="w-full flex justify-center items-center flex-row gap-4">
              <div className="max-w-sm mx-auto h-full flex flex-col md:flex-row gap-4">
                <SimpleSelect updateFormData={updateFormData} />
              </div>
              <div className="relative flex-1">
                <input
                  type="search"
                  id="default-search"
                  onChange={(e) => updateFormData("busqueda", e.target.value)}
                  value={formData.busqueda}
                  className="block w-full p-4 ps-10 text-sm outline-none text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-2 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Buscar términos clave..."
                  required
                />
              </div>
            </form>
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
              removeItemById={memoRemoveItemById}
            />
          ))}
      </div>
      {resoluciones && resoluciones.length > 0 && (
        <div className="p-4 bg-white text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full mb-8">
          <SimpleChart option={option} border={false}></SimpleChart>
        </div>
      )}

      {/* <TablaMultivariable records={data} /> */}
      {/* {geoData && geoData.length > 0 && (
        <div className="p-4 bg-white text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg h-[600px] mb-8">
          <GeoChart contenido={geoData}></GeoChart>
        </div>
         data={departamentos}
      )} */}

      {departamentos && departamentos.length > 0 && <MapComponent />}
    </div>
  );
};
export default CompararDatos;
