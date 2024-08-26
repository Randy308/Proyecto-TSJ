import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LineChart from "./LineChart";
const JurisprudenciaLista = () => {
  const jurisprudenciaItems = [
    {
      id: 1,
      title: "Análisis por Resoluciones",
      descripcion: "Quis commodo deserunt pariatur eu ea ut.",
      path: "/Jurisprudencia/Analisis-Materia",
      cName: "tool-item",
      color: "f86c6b",
    },
    {
      id: 2,
      title: "Análisis por Magistrados",
      descripcion:
        "Commodo fugiat sint Lorem minim tempor cupidatat enim adipisicing.",
      path: "/Jurisprudencia/Analisis-Magistrados",
      cName: "tool-item",
      color: "ffc107",
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
      setXAxis(response.data.all.map((item) => item.year));
      setResoluciones(response.data.all.map((item) => item.cantidad));

      setJurisprudencia(
        response.data.jurisprudencia.map((item) => item.cantidad)
      );
      setAutos(response.data.auto_supremos.map((item) => item.cantidad));
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const styles = {
    page: {
      height: "85vh",
    },
    pages: {
      height: "700px",
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
        name: "all",
        min: 0,
        max: Math.max(...resoluciones),
        axisLabel: {
          formatter: "{value} ml",
        },
      },
      {
        type: "value",
        name: "jurisprudencia",
        min: 0,
        max: Math.max(...jurisprudencia),
        axisLabel: {
          formatter: "{value} ml",
        },
      },
    ],
    series: [
      {
        name: "auto_supremos",
        type: "bar",
        tooltip: {
          valueFormatter: (value) => `${value} ml`,
        },
        data: autos,
      },
      {
        name: "jurisprudencia",
        type: "bar",
        tooltip: {
          valueFormatter: (value) => `${value} ml`,
        },
        data: jurisprudencia,
      },

      {
        name: "all",
        type: "line",
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: (value) => `${value} ml`,
        },
        data: resoluciones,
      },
    ],
  };

  return (
    <div className="lista-analisis">
      <div className="p-4 my-4 mx-40 flex  flex-col flex-wrap gap-4">
        <div className="p-4 flex justify-center">
          <span className="font-bold text-center text-lg">
            Lista de Analisis
          </span>
        </div>
        {jurisprudenciaItems.map((item) => (
          <Link to={item.path} key={item.id}>
            <div
              key={item.id}
              className="p-4 rounded-lg bg-slate-200 hover:cursor-pointer hover:bg-slate-700 hover:text-white"
            >
              <span className="font-bold"> {item.title}</span>
            </div>
          </Link>
        ))}
      </div>
      <div style={styles.pages}>
        <LineChart option={option}></LineChart>
      </div>
    </div>
  );
};

export default JurisprudenciaLista;
