import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LineChart from "./LineChart";
import { HiDocumentReport } from "react-icons/hi";
import { GrDocumentUser } from "react-icons/gr";
const JurisprudenciaLista = () => {
  const jurisprudenciaItems = [
    {
      id: 1,
      title: "Análisis por Resoluciones",
      descripcion: "Quis commodo deserunt pariatur eu ea ut.",
      path: "/Jurisprudencia/Analisis-Materia",
      cName: "tool-item",
      icon: <HiDocumentReport className="h-8 w-8" />,
    },
    {
      id: 2,
      title: "Análisis por Magistrados",
      descripcion:
        "Commodo fugiat sint Lorem minim tempor cupidatat enim adipisicing.",
      path: "/Jurisprudencia/Analisis-Magistrados",
      cName: "tool-item",
      icon: <GrDocumentUser className="h-8 w-8" />,
    },
  ];
  const endpoint = process.env.REACT_APP_BACKEND;
  const [resoluciones, setResoluciones] = useState([]);
  const [jurisprudencia, setJurisprudencia] = useState([]);
  const [autos, setAutos] = useState([]);
  const [xAxis, setXAxis] = useState([]);
  const [legend, setLegend] = useState([]);
  useEffect(() => {
    getAllSalas();
  }, []);

  const getAllSalas = async () => {
    try {
      const response = await axios.get(`${endpoint}/all-resoluciones`);
      setLegend(Object.keys(response.data));
      setXAxis(response.data.Todos.map((item) => item.year));
      setResoluciones(response.data.Todos.map((item) => item.cantidad));

      setJurisprudencia(
        response.data.Jurisprudencia.map((item) => item.cantidad)
      );
      setAutos(response.data.Auto_Supremos.map((item) => item.cantidad));
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const styles = {
    page: {
      height: "85vh",
    },
    pages: {
      height: "600px",
    },
  };
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ["line", "bar"] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    legend: {
      data: legend,
    },
    xAxis: {
      type: "category",
      data: xAxis,
      axisPointer: {
        type: "shadow",
      },
    },
    yAxis: [
      {
        type: "value",
        name: "Todos",
        min: 0,
        max: Math.max(...resoluciones),
        axisLabel: {
          formatter: "{value}",
        },
      },
      {
        type: "value",
        name: "Jurisprudencia",
        min: 0,
        max: Math.max(...jurisprudencia),
        axisLabel: {
          formatter: "{value}",
        },
      },
    ],
    series: [
      {
        name: "Auto_Supremos",
        type: "bar",
        tooltip: {
          valueFormatter: (value) => `${value}`,
        },
        data: autos,
      },
      {
        name: "Jurisprudencia",
        type: "bar",
        tooltip: {
          valueFormatter: (value) => `${value}`,
        },
        data: jurisprudencia,
      },

      {
        name: "Todos",
        type: "line",
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: (value) => `${value} `,
        },
        data: resoluciones,
      },
    ],
  };

  return (
    <div className="lista-analisis flex flex-col items-center justify-center py-4">
      <div className="flex justify-center">
        <span className="font-bold text-center text-lg">Historico de Resoluciones</span>
      </div>
      <div style={styles.pages} className="p-4 m-4 w-3/6 custom:w-full">
        <LineChart option={option}></LineChart>
      </div>
      <div className="flex p-4 m-4 flex-col w-4/5 gap-2">
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
