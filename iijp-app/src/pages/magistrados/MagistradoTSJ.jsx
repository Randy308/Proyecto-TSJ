import React, { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";
import { ImUserTie } from "react-icons/im";
import "../../styles/magistradosTSJ.css";
import "../../styles/tabs.css";

import { magistradoItems } from "../../data/MagistradoItems";
import Resumen from "./analisis/Resumen";
import TimesSeries from "./analisis/TimesSeries";
import Mapa from "./analisis/Mapa";
import AnalisisMagistrado from "./analisis/AnalisisMagistrado";
import MagistradoService from "../../services/MagistradoService";
const MagistradoTSJ = () => {
  const { id } = useParams();
  const [magistrado, setMagistrado] = useState([]);
  const [activeTab, setActiveTab] = useState(1);

  const [multiVariable, setMultiVariable] = useState(false);
  const [departamentos, setDepartamentos] = useState(null);
  const [hasFetchedDep, setHasFetchedDep] = useState(false);

  const handleClick = async () => {
    if (!hasFetchedDep) {
      MagistradoService.getDepartamentos(id, {})
        .then(({ data }) => {
          if (data) {
            setDepartamentos(data);
            setHasFetchedDep(true);
          }
        })
        .catch(({ err }) => {
          console.error("Error fetching data:", err);
        });
    }
  };

  const [params, setParams] = useState(null);
  const [hasParams, setHasParams] = useState(false);

  const handleClickParams = async () => {
    if (!hasParams) {
      MagistradoService.getParametros({
        id: id,
        salas: salasId,
      })
        .then(({ data }) => {
          if (data) {
            setParams(data);
            setHasParams(true);
          }
        })
        .catch(({ err }) => {
          console.error("Error fetching data:", err);
        });
    }
  };

  const [resoluciones, setResoluciones] = useState([]);
  const [valor, setValor] = useState(null);
  const lista = ["year", "month", "day"];
  const actual = useRef(0);

  const [salasId, setSalasId] = useState([]);
  const [salasData, setSalasData] = useState(null);

  const generarFecha = () => {
    if (valor !== null) {
      const selectedData = resoluciones.find((item) => item.fecha === valor);
      return selectedData
        ? selectedData.fecha_inicio
        : resoluciones[0].fecha_inicio;
    }
  };

  const recorrerLista = (reversa) => {
    if (reversa && actual.current === 0) {
      console.log("limite superior alcanzado");
    } else if (!reversa && actual.current === lista.length - 1) {
      console.log("limite inferior alcanzado");
    } else {
      actual.current = reversa ? actual.current - 1 : actual.current + 1;
      console.log(lista[actual.current]);
      getSerieTemporal();
    }
  };

  useEffect(() => {
    const obtenerResumen = async () => {
      await MagistradoService.getResumen(id)
        .then(({ data }) => {
          if (data) {
            setMagistrado(data);
          }
        })
        .catch(({ err }) => {
          console.error("Existe un error " + err);
        });
    };
    obtenerResumen();
  }, [id]);

  const getSerieTemporal = async () => {
    setResoluciones([]);

    await MagistradoService.getSerieTemporal(id, {
      actual: lista[actual.current],
      dato: generarFecha(),
    })
      .then(({ data }) => {
        if (data) {
          setResoluciones(data.data);
        }
      })
      .catch(({ err }) => {
        console.log("Existe un error " + err);
      });
  };

  useEffect(() => {
    if (valor != null) {
      recorrerLista(false);
    }
  }, [valor]);

  useEffect(() => {
    if (magistrado && magistrado.salas && magistrado.salas.length > 0) {
      setSalasId(magistrado.salas.map((item) => item.id));
      setSalasData(
        magistrado.salas.map((item) => ({
          sala: item.nombre,
          cantidad: item.cantidad,
        }))
      );
    }
  }, [magistrado]);

  useEffect(() => {
    getSerieTemporal();
  }, []);

  const handleTabs = (number) => {
    switch (number) {
      case 1:
        setActiveTab(number);
        return;
      case 2:
        handleClickParams();
        setActiveTab(number);
        return;
      case 3:
        setActiveTab(number);
        return;
      case 4:
        handleClick();
        setActiveTab(number);
      default:
        return;
    }
  };

  const renderContent = (number) => {
    switch (number) {
      case 1:
        return <Resumen magistrado={magistrado} />;
      case 2:
        return (
          <AnalisisMagistrado
            params={params}
            data={salasData}
            setData={setSalasData}
            salas={salasId}
            id={id}
            multiVariable={multiVariable}
            setMultiVariable={setMultiVariable}
          />
        );
      case 3:
        return (
          <TimesSeries
            resoluciones={resoluciones}
            setValor={setValor}
            recorrerLista={recorrerLista}
          />
        );
      case 4:
        return (
          <Mapa
            contenido={departamentos}
            setDepartamentos={setDepartamentos}
            id={id}
          />
        );
      default:
        return <div>Contenido por defecto</div>;
    }
  };

  return (
    <div className="container mx-auto border border-gray-300 rounded-lg p-4 mt-4 ">
      <div className="flex flex-row gap-4 p-4">
        <div className="flex justify-end">
          <ImUserTie className="w-[120px] h-[120px] custom:w-[90px] custom:h-[90px] dark:text-white rounded-lg" />
        </div>
        <div>
          <span
            className="bg-red-octopus-50 text-red-octopus-900 text-md font-semibold px-2.5 
          py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3 mb-4"
          >
            Magistrado Relator
          </span>

          <h1 className="my-2 ms-3 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {magistrado.nombre}
          </h1>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          {magistradoItems.map((item, index) => (
            <li key={index} className="me-2">
              <a
                href="#"
                onClick={() => handleTabs(item.id)}
                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group 
                ${
                  item.id === activeTab
                    ? "text-[#7E3045] border-[#7E3045] active dark:text-blue-500 dark:border-blue-500 "
                    : "border-transparent  hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                } `}
              >
                {item.icon(
                  `w-4 h-4 me-2 ${
                    item.id === activeTab
                      ? "text-[#7E3045] dark:text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                  }`
                )}
                {item.title}
              </a>
            </li>
          ))}
        </ul>

        <div className="p-4 custom:p-0 mt-4 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
          {magistradoItems.map(
            (item) =>
              item.id === activeTab && (
                <div key={item.id}>{renderContent(item.id)}</div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default MagistradoTSJ;
