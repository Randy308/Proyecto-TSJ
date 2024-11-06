import Loading from "../../components/Loading";
import { useFreeApi } from "../../hooks/api/useFreeApi";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiInjustice } from "react-icons/gi";
import axios from "axios";
import TanstackTabla from "../../components/TanstackTabla";



const ListaSalas = () => {
  const endpoint = process.env.REACT_APP_BACKEND;

  const { contenido, isLoading, error } = useFreeApi(`${endpoint}/all-salas`);

  const [selectedIds, setSelectedIds] = useState([]);
  const [resoluciones, setResoluciones] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [totalRes, setTotalRes] = useState(0);
  // Manejar el cambio de estado del checkbox
  const handleCheckboxChange = (event) => {
    const id = event.target.name;
    if (event.target.checked) {
      // Agregar el ID a la lista si se selecciona
      setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);
    } else {
      // Eliminar el ID de la lista si se deselecciona
      setSelectedIds((prevSelectedIds) =>
        prevSelectedIds.filter((item) => item !== id)
      );
    }
  };

  const getDatos = async () => {
    try {
      const { data } = await axios.get(`${endpoint}/obtener-datos-salas`, {
        params: {
          salas: selectedIds,
        },
      });

      setResoluciones(data.data);

      setTotalRes(data.total);
      const headers = Object.keys(data.data[0])
      .map((header) => {
        // Excluir la columna `id`
        if (header === "id") {
          return null;
        }
        return {
          accessorKey: header, // Nombre de la clave para acceder a los datos
          header: header.charAt(0).toUpperCase() + header.slice(1), // Título de la columna, con la primera letra en mayúscula
          enableSorting: true, // Habilita la opción de ordenar
        };
      })
      .filter(Boolean);
    
    setColumnDefs(headers);
    
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  useEffect(() => {
    console.log(selectedIds);
  }, [selectedIds]);

  if (isLoading) return <Loading />;
  if (error) return <p>{error}</p>;

  if (!Array.isArray(contenido) || contenido.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }

  return (
    <div>
      <div>
        <div className="flex p-4 justify-center items-center">
          <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">
            Lista de salas
          </h3>
        </div>
        <ul className="flex flex-row flex-wrap gap-4 justify-center items-center p-2">
          {contenido.map((item) => (
            <li key={item.id}>
              <input
                type="checkbox"
                key={item.id}
                id={item.nombre}
                name={item.id}
                value=""
                className="hidden peer"
                required=""
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor={item.nombre}
                className="inline-flex items-center justify-between  p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="flex flex-row gap-4">
                  <GiInjustice className="mb-2 text-black w-7 h-7" />
                  <div className="roboto-regular text-black dark:text-white">
                    {item.nombre}
                  </div>
                </div>
              </label>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap p-4 justify-end">
          <button
            type="button"
            onClick={() => getDatos()}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Obtener datos
          </button>
        </div>

        {totalRes && totalRes > 0 ? (
          <div className="mb-5 p-4">
            <div className="text-center p-4 roboto-regular text-2xl text-black dark:text-white">
              <p>Tabla de frecuencias</p>
            </div>
            <TanstackTabla data={resoluciones} />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ListaSalas;
