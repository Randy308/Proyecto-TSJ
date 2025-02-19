import DateRangeSlider from "../../../components/DateRangeSlider ";
import { useMagistradosContext } from "../../../context/magistradosContext";
import EChart from "../../../pages/analisis/EChart";
import React, { useEffect, useState } from "react";
import MagistradoService from "../../../services/MagistradoService";
import AsyncButton from "../../../components/AsyncButton";
import TablaX from "../../../components/tables/TablaX";

const Mapa = ({ contenido, id, setDepartamentos }) => {
  const { magistrados } = useMagistradosContext();
  const [isLoading, setIsLoading] = useState(false);
  const [minDate, setMinDate] = useState("2009-01-01");
  const [maxDate, setMaxDate] = useState("2024-12-31");
  const [isTable, setIsTable] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [lista, setLista] = useState([]);
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    if (magistrados?.length) {
      const magistrado = magistrados.find((item) => item.id === parseInt(id));
      if (magistrado) {
        setMinDate(magistrado.fecha_min || "2009-01-01");
        setMaxDate(magistrado.fecha_max || "2024-12-31");
      }
    }
  }, [magistrados, id]);

  const handleDateChange = (range) => {
    console.log("Nuevo rango de fechas:", range);
    setEndDate(range.endDate);
    setStartDate(range.startDate);
  };

  const handleClick = async () => {
    if (isLoading) return;

    if (endDate && startDate) {
      setIsLoading(true);
      MagistradoService.getDepartamentos(id, {
        min_date: startDate,
        max_date: endDate,
      })
        .then(({ data }) => {
          if (data) {
            setDepartamentos(data);
          }
        })
        .catch((err) => {
          console.log("Existe un error " + err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      alert("Seleccione un rango de fechas");
    }
  };

  useEffect(() => {
    if (contenido && contenido.length > 0) {
      const totalCounts = { "Departamento": "Total" };

     const processedData = contenido.map((item) => ({
       Departamento: item.name,
       Cantidad: item.value,
     }));

      processedData.forEach((entry) => {
        Object.keys(entry).forEach((key) => {
          if (key !== "Departamento") {
            totalCounts[key] = (totalCounts[key] || 0) + entry[key];
          }
        });
      });
      setLista([...processedData, totalCounts]);
    }
  }, [contenido]);

  useEffect(() => {
    if (lista && lista.length > 0) {
      let keys = Object.keys(lista[0]);
      setColumns(
        keys.map((item) => ({
          accessorKey: item,
          header: item
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()),
          enableSorting: true,
        }))
      );
    }
  }, [lista]);

  return (
    <>
      <div className="p-10">
        <h2 className="text-lg font-bold mb-4">
          Filtrar Datos por Rango de Fechas
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Utiliza el control deslizante para seleccionar un rango de fechas y
          filtrar los datos visualizados en el gráfico.
        </p>
        <div className="flex items-center gap-1 flex-wrap">
          <DateRangeSlider
            minDate={minDate}
            maxDate={maxDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <AsyncButton
            asyncFunction={handleClick}
            isLoading={isLoading}
            name="Filtrar Datos"
            full={false}
          ></AsyncButton>

          <button
            className={`text-xs inline-flex items-center px-4 py-3 rounded-lg font-medium text-white  active bg-red-octopus-700 hover:bg-red-octopus-600 dark:bg-blue-700 dark:hover:bg-blue-600"
            `}
            onClick={() => setIsTable((prev) => !prev)}
          >
            {isTable ? "Visualizar gráfico" : "Visualizar tabla"}
          </button>
        </div>
      </div>

      {isTable ? (
        <TablaX data={lista} columns={columns} />
      ) : (
        <div className="h-[600px] border border-gray-300 p-4 m-4 custom:p-2 custom:m-0 rounded-xl shadow-lg bg-white dark:bg-[#100C2A]">
          <EChart contenido={contenido} />
        </div>
      )}
    </>
  );
};

export default Mapa;
