import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import SimpleChart from "../../components/charts/SimpleChart";
import { useLocation } from "react-router-dom";
import ResolucionesService from "../../services/ResolucionesService";

const Prediction = () => {
  const { state } = useLocation();
  const { parametros } = state || null;

  const [projection, setProjection] = useState(null);
  const realizarPrediction = async () => {
    ResolucionesService.obtenerPrediccion({
      ...parametros,
    })
      .then(({ data }) => {
        setProjection(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const [original, setOriginal] = useState([]);

  const [prediction, setPrediction] = useState(null);
  const [xAxis, setXAxis] = useState(null);
  const [option, setOption] = useState({});
  useEffect(() => {
    if (projection) {
      setXAxis(projection.periodo);
      setPrediction(projection.prediccion);
      setOriginal(projection.original);
    }
  }, [projection]);

  useEffect(() => {
    if (parametros) {
      realizarPrediction();
    }
  }, []);

  useEffect(() => {
    if (prediction && xAxis) {
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
            data: prediction.map((item) => item),
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
  }, [prediction, xAxis]);

  return (
    <div>
      {" "}
      {prediction && prediction.length > 0 ? (
        <SimpleChart option={option} border={false}></SimpleChart>
      ) : (
        <div className="h-[500px]">
          <Loading></Loading>
        </div>
      )}
    </div>
  );
};

export default Prediction;
