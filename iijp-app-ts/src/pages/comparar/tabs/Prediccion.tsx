import type{ EChartsOption } from "echarts-for-react";
import SimpleChart from "../../../components/charts/SimpleChart";
import Loading from "../../../components/Loading";
import  { useEffect, useState } from "react";

interface SerieTemporal {
  periodo: string[];
  cantidad: number[];
}
interface ProyeccionProps {
  proyeccion: {
    periodo: string[];
    prediccion: SerieTemporal[];
    original: SerieTemporal[];
  };
}

const Prediccion = ({ proyeccion }: ProyeccionProps) => {
  const [original, setOriginal] = useState<SerieTemporal[]>([]);

  const [prediccion, setPrediccion] = useState<SerieTemporal[]>([]);
  const [xAxis, setXAxis] = useState<string[]>([]);
  const [option, setOption] = useState<EChartsOption>({});
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
            name: 'Predicción',
            type: "line",
          },
          {
            data: original.map((item) => item),
            name: 'Serie original',
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
  }, [original, prediccion, xAxis]);

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
