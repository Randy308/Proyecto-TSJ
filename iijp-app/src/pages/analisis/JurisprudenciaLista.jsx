import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
      title: "Análisis por Magistrados",
      descripcion:
        "Commodo fugiat sint Lorem minim tempor cupidatat enim adipisicing.",
      path: "/jurisprudencia/lista-magistrados",
      cName: "tool-item",
      icon: <IoPeopleCircleSharp className="h-8 w-8" />,
    },
    {
      id: 3,
      title: "Análisis por Salas",
      descripcion:
        "Commodo fugiat sint Lorem minim tempor cupidatat enim adipisicing.",
      path: "/jurisprudencia/lista-salas",
      cName: "tool-item",
      icon: <HiMiniBuildingLibrary className="h-8 w-8" />,
    },
    {
      id: 4,
      title: "Análisis avanzado",
      descripcion:
        "Commodo fugiat sint Lorem minim tempor cupidatat enim adipisicing.",
      path: "/analisis/avanzado",
      cName: "tool-item",
      icon: <CgDisplayGrid className="h-8 w-8" />,
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
      },
      {
        top: "55%",
        left: "center",
        text: "Cantidad de Jurisprudencia por periodo",
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
      <div className="flex justify-center">
        <span className="font-bold text-center text-2xl titulo">
          Histórico de Resoluciones
        </span>
      </div>
      <div className="container mx-auto">
        {resoluciones && resoluciones.length > 0 ? (
          <SimpleChart option={option}></SimpleChart>
        ) : (
          <Loading></Loading>
        )}
      </div>
      <div className="flex p-2 m-2 flex-col w-4/5 gap-2">
        <div className="flex flex-row gap-2 items-center justify-center ">
          {jurisprudenciaItems.map((item) => (
            <Link to={item.path} key={item.id}>
              <div
                key={item.id}
                className="py-4 px-2 rounded-lg bg-slate-200 hover:cursor-pointer hover:bg-slate-700 hover:text-white flex flex-row justify-center items-center gap-2"
              >
                {" "}
                {item.icon}
                <span className="font-bold"> {item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JurisprudenciaLista;
