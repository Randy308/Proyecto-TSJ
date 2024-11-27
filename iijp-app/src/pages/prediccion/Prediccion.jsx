import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import SimpleChart from "../../components/SimpleChart";
import { useLocation } from "react-router-dom";

const Prediccion = () => {
  const endpoint = process.env.REACT_APP_BACKEND;
  const { state } = useLocation();
  const { parametros } = state || null;

  const [proyeccion, setProyeccion] = useState(null);
  const realizarProyeccion = async (parametros) => {
    try {
      const { data } = await axios.get(`${endpoint}/realizar-prediccion`, {
        params: {
          ...parametros,
        },
      });
      setProyeccion(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [original, setOriginal] = useState([]);

  const [prediccion, setPrediccion] = useState(null);
  const [xAxis, setXAxis] = useState(null);
  const [option, setOption] = useState({});
  useEffect(() => {
    if (proyeccion) {
      setXAxis(proyeccion.periodo);
      setPrediccion(proyeccion.prediccion);
      setOriginal(proyeccion.original);
    }
  }, [proyeccion]);

  useEffect(() => {
    if (prediccion && xAxis) {
      setOption({
        title: {
          text: "Predicción por regresión lineal",
          padding: [20, 20, 10, 20],
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["Serie original", "Predicción"],
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
          type: "category",
          boundaryGap: false,
          data: xAxis.map((item) => item),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: prediccion.map((item) => item),
            name: "Predicción",
            type: "line",
          },
          {
            data: original.map((item) => item),
            name: "Serie original",
            type: "line",
          },
        ],
        grid: {
          top: "10%", // Adjust top padding
          bottom: "10%", // Adjust bottom padding
          left: "10%", // Adjust left padding
          right: "10%", // Adjust right padding
        },
      });
    }
  }, [prediccion, xAxis]);
  useEffect(() => {
    if (parametros) {
      realizarProyeccion(parametros);
    }
  }, []);
  return (
    <div>
      {" "}
      {prediccion && prediccion.length > 0 ? (
        <SimpleChart option={option} border={false}></SimpleChart>
      ) : (
        <div className="h-[500px]">
          <Loading></Loading>
        </div>
      )}
    </div>
  );
};

export default Prediccion;
