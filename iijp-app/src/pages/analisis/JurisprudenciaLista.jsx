import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LineChart from "./LineChart";
import { HiDocumentReport } from "react-icons/hi";
import { GrDocumentUser } from "react-icons/gr";
import Loading from "../../components/Loading";
const JurisprudenciaLista = () => {
  const jurisprudenciaItems = [
    {
      id: 1,
      title: "Análisis por Resoluciones",
      descripcion: "Quis commodo deserunt pariatur eu ea ut.",
      path: "/Jurisprudencia/Estadistica/Resoluciones",
      cName: "tool-item",
      icon: <HiDocumentReport className="h-8 w-8" />,
    },
    {
      id: 2,
      title: "Análisis por Magistrados",
      descripcion:
        "Commodo fugiat sint Lorem minim tempor cupidatat enim adipisicing.",
      path: "/Jurisprudencia/Lista-Magistrados",
      cName: "tool-item",
      icon: <GrDocumentUser className="h-8 w-8" />,
    },
    {
      id: 2,
      title: "Análisis por Salas",
      descripcion:
        "Commodo fugiat sint Lorem minim tempor cupidatat enim adipisicing.",
      path: "/Jurisprudencia/lista-salas",
      cName: "tool-item",
      icon: <GrDocumentUser className="h-8 w-8" />,
    },
  ];
  const endpoint = process.env.REACT_APP_BACKEND;
  const [resoluciones, setResoluciones] = useState([]);
  const [jurisprudencia, setJurisprudencia] = useState([]);
  const [xAxis, setXAxis] = useState([]);
  const [legend, setLegend] = useState([]);
  useEffect(() => {
    getAllSalas();
  }, []);

  const getAllSalas = async () => {
    try {
      const response = await axios.get(`${endpoint}/all-resoluciones`);
      setLegend(Object.keys(response.data));
      setXAxis(response.data.Resoluciones.map((item) => item.year));
      setResoluciones(response.data.Resoluciones.map((item) => item.cantidad));

      setJurisprudencia(
        response.data.Jurisprudencia.map((item) => item.cantidad)
      );
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




  /** 
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
        name: "Jurisprudencia",
        type: "bar",
        tooltip: {
          valueFormatter: (value) => `${value}`,
        },
        data: jurisprudencia,
      },

      {
        name: "Resoluciones",
        type: "line",
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: (value) => `${value} `,
        },
        data: resoluciones,
      },
    ],
  };
  **/
  const option = {
    // Make gradient line here
    visualMap: [
      {
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: 0,
        max: Math.max(...resoluciones)
      },
      {
        show: false,
        type: 'continuous',
        seriesIndex: 1,
        dimension: 0,
        min: 0,
        max: jurisprudencia.length -1
      }
    ],
    toolbox: {
      feature: {
        magicType: { show: true, type: ['line', 'bar'] },
        saveAsImage: { show: true }
      }
    },
    title: [
      {
        left: 'center',
        text: 'Cantidad de resoluciones por periodo'
      },
      {
        top: '55%',
        left: 'center',
        text: 'Cantidad de jurisprudencia por periodo'
      }
    ],
    tooltip: {
      trigger: 'axis'
    },
    xAxis: [
      {
        data: xAxis,
      },
      {
        data: xAxis,
        gridIndex: 1
      }
    ],
    yAxis: [
      {},
      {
        gridIndex: 1
      }
    ],
    grid: [
      {
        bottom: '60%'
      },
      {
        top: '60%'
      }
    ],
    series: [
      {
        type: 'line',
        showSymbol: false,

        data: resoluciones
      },
      {
        type: 'line',
        showSymbol: false,
        data: jurisprudencia,

        xAxisIndex: 1,
        yAxisIndex: 1
      }
    ]
  };
  
  const [valor, setValor] = useState(null);
  useEffect(() => {
    if (valor) {
      console.log(valor);
    }
  }, [valor]);
  return (
    <div className="lista-analisis flex flex-col items-center justify-center py-4 my-4">
      <div className="flex justify-center">
        <span className="font-bold text-center text-2xl titulo">
          Histórico de Resoluciones
        </span>
      </div>
      <div style={styles.pages} className="p-4 m-4 mb-0 pb-0 w-3/6 custom:w-full">
        {resoluciones && resoluciones.length > 0 ? (
          <LineChart option={option} setData={setValor}></LineChart>
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
