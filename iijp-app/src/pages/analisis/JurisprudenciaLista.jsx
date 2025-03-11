import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SimpleChart from "../../components/charts/SimpleChart";
import Loading from "../../components/Loading";
import { IoPeopleCircleSharp } from "react-icons/io5";
import { HiMiniBuildingLibrary } from "react-icons/hi2";
import { CgDisplayGrid } from "react-icons/cg";
import { useHistoricContext } from "../../context/historicContext";
const JurisprudenciaLista = () => {
  const jurisprudenciaItems = [
    {
      id: 2,
      title: "Análisis por\n Magistrados",
      className: "bg-red-400 hover:bg-red-700 hover:text-white",
      path: "/jurisprudencia/lista-magistrados",
    },
    {
      id: 3,
      title: "Análisis por\n Salas",
      className: "bg-yellow-300 hover:bg-yellow-500 hover:text-white",
      path: "/jurisprudencia/lista-salas",
      icon: <HiMiniBuildingLibrary className="h-8 w-8" />,
    },
    {
      id: 4,
      title: "Análisis\n avanzado",
      className: "bg-green-400 hover:bg-green-700 hover:text-white",
      path: "/analisis/avanzado",
    },
  ];

  const { historic } = useHistoricContext();

  const [resoluciones, setResoluciones] = useState([]);
  const [jurisprudencia, setJurisprudencia] = useState([]);
  const [maxRes, setMaxRes] = useState([]);
  const [maxJuris, setMaxJuris] = useState([]);

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

  return (
    <div className="lista-analisis flex flex-col items-center justify-center py-4 my-4">
      <div className="roboto-condensed text-3xl font-bold uppercase mb-4 text-center">Principales indicadores</div>
      <div className="flex flex-row flex-wrap gap-2 items-center justify-center p-4 mb-4">
        {jurisprudenciaItems.map((item) => (
          <Link to={item.path} key={item.id}>
            <div
              key={item.id}
              className={`rounded-lg hover:cursor-pointer flex flex-row justify-center items-center gap-2 p-8 ${item.className}`}
            >
              <span className="text-white whitespace-pre-line uppercase roboto-condensed text-lg font-bold text-center">
                {item.title}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center">
        <span className="font-bold text-center text-3xl titulo uppercase mb-4">
          Histórico de Resoluciones
        </span>
      </div>
      <div className="mx-auto w-3/4 custom:w-full">
        {resoluciones && resoluciones.length > 0 ? (
          <SimpleChart option={option}></SimpleChart>
        ) : (
          <Loading></Loading>
        )}
      </div>
    </div>
  );
};

export default JurisprudenciaLista;
