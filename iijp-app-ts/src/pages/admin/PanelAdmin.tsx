import { useEffect, useState } from "react";
import { useVariablesContext } from "../../context/variablesContext";
import { generatePastelColor, titulo } from "../../utils/filterForm";
import Notificaciones from "../notificaciones/Notificaciones";
import { useHistoricContext } from "../../context/historicContext";
import Loading from "../../components/Loading";
import SimpleChart from "../../components/charts/SimpleChart";
import type { FiltroNombre, ListaData } from "../../types";
import type { ECElementEvent } from "echarts";
import { useAuthContext } from "../../context";

interface HistoricData {
  periodo: string;
  cantidad: number;
}
const PanelAdmin = () => {
  const { can } = useAuthContext();
  const { data } = useVariablesContext();
  const { historic } = useHistoricContext();
  const [resoluciones, setResoluciones] = useState<HistoricData[]>([]);
  const [jurisprudencia, setJurisprudencia] = useState<HistoricData[]>([]);
  const [maxRes, setMaxRes] = useState<number>(0);
  const [maxJuris, setMaxJuris] = useState<number>(0);

  const option = {
    visualMap: [
      {
        show: false,
        type: "continuous",
        seriesIndex: 0,
        min: 0,
        max: maxRes,
      },
      {
        show: false,
        type: "continuous",
        seriesIndex: 1,
        min: 0,
        max: maxJuris,
      },
    ],
    toolbox: {
      feature: {
        magicType: {
          show: true,
          type: ["line", "bar"],
          title: {
            line: "Línea",
            bar: "Barras",
          },
        },
        saveAsImage: {
          show: true,
          title: "Guardar como imagen",
        },
      },
    },
    title: [
      {
        left: "center",
        top: "5%",
        text: "Cantidad de Autos supremos por periodo",
        textStyle: {
          fontSize: Math.max(12, window.innerWidth * 0.015), // Ajusta según el tamaño de la pantalla
          fontWeight: "bold",
        },
      },
      {
        top: "55%",
        left: "center",
        text: "Cantidad de Jurisprudencia por periodo",
        textStyle: {
          fontSize: Math.max(12, window.innerWidth * 0.015), // Ajusta según el tamaño de la pantalla
          fontWeight: "bold",
        },
      },
    ],
    tooltip: {
      trigger: "axis",
    },
    xAxis: [
      {
        type: "time",
      },
      {
        type: "time",
        gridIndex: 1,
      },
    ],
    yAxis: [
      {},
      {
        gridIndex: 1,
      },
    ],
    grid: [
      {
        bottom: "60%",
        left: "5%",
        right: "5%",
        containLabel: true,
      },
      {
        top: "60%",
        left: "5%",
        right: "5%",
        containLabel: true,
      },
    ],
    series: [
      {
        type: "line",
        showSymbol: false,
        data: resoluciones,
      },
      {
        type: "line",
        showSymbol: false,
        data: jurisprudencia,
        xAxisIndex: 1,
        yAxisIndex: 1,
      },
    ],
  };

  const permissions: string[] = [
    "ver_todas_resoluciones",
    "ver_todas_jurisprudencia",
    "crear_usuarios",
    "eliminar_usuarios",
    "actualizar_usuarios",
    "ver_usuarios",
    "ver_usuario",
    "ver_rol",
    "crear_roles",
    "eliminar_roles",
    "actualizar_roles",
    "ver_roles",
    "asignar_permisos",
    "quitar_permisos",
    //Codificador
    "acceder_resoluciones",
    "subir_resoluciones",
    "actualizar_resoluciones",
    "eliminar_resoluciones",
    "acceder_jurisprudencia",
    "subir_jurisprudencia",
    "actualizar_jurisprudencia",
    "eliminar_jurisprudencia",
    "web_scrapping",
    "crear_publicacion",
    "eliminar_publicacion",
    "ver_publicacion",
    "actualizar_publicacion",
    // Users
    "realizar_prediccion",
    "refinar_busqueda",
    "crear_estilos",
    "eliminar_estilos",
    "ver_estilos",
    "actualizar_estilos",
    "actualizar_perfil",
    "eliminar_perfil",
    "ver_perfil",
  ];

  useEffect(() => {
    if (historic && historic.max_res && historic.max_juris) {
      setMaxRes(historic.max_res);
      setMaxJuris(historic.max_juris);
      setResoluciones(historic.resoluciones || []);
      setJurisprudencia(historic.jurisprudencia || []);
    } else {
      console.error("El objeto 'historic' no contiene los datos necesarios");
    }
  }, [historic]);
  const handleClick = (e: ECElementEvent) => {
    e.preventDefault();
  };
  return (
    <div className="pt-4 mt-4">
      <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">


        {Object.entries((data || {})).map(([name, contenido]) => (
          <a
            href="#"
            key={name}
            style={{ backgroundColor: generatePastelColor() }}
            className="block max-w-sm p-6 border text-white border-gray-200 rounded-lg shadow-sm hover:opacity-75 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight dark:text-white">
              {titulo(name  as FiltroNombre)}
            </h5>
            <p className="font-normal  dark:text-gray-400">
              {(contenido as ListaData[]).length} registros disponibles en el sistema.
            </p>
          </a>
        ))}
      </div>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col flex-wrap gap-4">
          <div className="p-4 lg:col-span-2">
            {resoluciones && resoluciones.length > 0 ? (
              <SimpleChart option={option} handleClick={handleClick}></SimpleChart>
            ) : (
              <Loading></Loading>
            )}
          </div>
          <div className="h-[600px] overflow-y-scroll p-4">
            <Notificaciones />
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Lista de permisos que tienes asignados:
          </p>
          {permissions.map(
            (permission) =>
              can(permission) && (
                <li
                  className="rounded h-10 flex items-center p-4 dark:bg-gray-800 text-xs text-black dark:text-white"
                  key={permission}
                >
                  Tienes permiso para {permission.replace(/_/g, " ")}
                </li>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelAdmin;
