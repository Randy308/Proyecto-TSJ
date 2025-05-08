import React, { useEffect, useState } from 'react'
import JurisprudenciaService from '../../../services/JurisprudenciaService';
import { filterForm } from '../../../utils/filterForm';
import PaginationData from '../../busqueda/PaginationData';
import Paginate from '../../../components/tables/Paginate';
import { Link } from 'react-router-dom';

const Resoluciones = ({ ids }) => {
  const [lastPage, setLastPage] = useState(1);
  const [actualPage, setActualPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [resoluciones, setResoluciones] = useState([]);
  const [searchType, setSearchType] = useState(null);
  const listaCabeceras = [
    {
      id: 1,
      title: "Fecha Emisión",
      nombre: "fecha_emision",
    },
    {
      id: 2,
      title: "Tipo de resolucion",
      nombre: "tipo_resolucion",
    },
    {
      id: 3,
      title: "Nro de resolucion",
      nombre: "nro_resolucion",
    },
    {
      id: 4,
      title: "Restrictor",
      nombre: "restrictor",
    },
    {
      id: 5,
      title: "Sala",
      nombre: "sala",
    },
  ];
  useEffect(() => {
    if (!ids || ids.length === 0) return; // Verifica si ids está vacío o no existe
    obtenerResoluciones();
  }, [ids]);



  const obtenerResoluciones = async (page = 1) => {


    const validPage = page && !isNaN(page) && page > 0 ? page : 1;
    const validatedData = filterForm({
      ids: ids,
      page: validPage,
    });

    JurisprudenciaService.obtenerResoluciones(validatedData)
      .then(({ data }) => {
        if (data.data.length > 0) {
          setResoluciones(data.data);
          setLastPage(data.last_page);
          setPageCount(data.last_page);
          setTotalCount(data.total)
        } else {
          toast.warning("No existen datos");
        }

      })
      .catch((error) => {
        const message = error.response?.data?.error || "Ocurrió un error";
        console.error("Error fetching data:", message);
      })
      .finally(() => {

      });
  };
  const handlePageClick = (page) => {
    const selectedPage = Math.min(page, lastPage);
    setActualPage(page);
    obtenerResoluciones(selectedPage);
  };


  return (
    <div className="p-4">
      {resoluciones.length > 0 && (
        <>
          <div className="relative overflow-x-auto">
            <table
              className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border
         border-gray-300 dark:border-gray-600 rounded-lg p-4 hidden md:table"
            >
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                    </div>
                  </th>
                  {listaCabeceras.map((item, index) => (

                    <th key={index} className="px-6 py-3">
                      {item.title}
                    </th>


                  ))}
                  <th scope="col" className="px-6 py-3">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {resoluciones.map((item, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >

                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input id={`checkbox-table-search-${index}`} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm  dark:bg-gray-700 dark:border-gray-600"/>
                          <label htmlFor={`checkbox-table-search-${index}`} className="sr-only">checkbox</label>
                      </div>
                    </td>

                    <th scope="row" className="px-6 py-4">
                      {item.fecha_emision}
                    </th>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {item.tipo_resolucion}
                    </td>
                    <td className="px-6 py-4">{item.nro_resolucion}</td>
                    <td className="px-6 py-4">{item.departamento}</td>
                    <td className="px-6 py-4">{item.sala}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/jurisprudencia/resolucion/${item.id}`}
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Ver resolución
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col gap-4 md:hidden">
              {resoluciones.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md"
                >


                  <div className="text-lg font-bold text-gray-900 dark:text-white text-center">
                    {item.nro_resolucion}
                  </div>

                  <div className="text-sm ">
                    <strong>Fecha de emisión:</strong> {item.fecha_emision}
                  </div>
                  <div className="text-sm "><strong>Tipo de resolución:</strong> {item.tipo_resolucion}</div>
                  <div className="text-sm">
                    <strong>Departamento:</strong> <span className="uppercase">{item.departamento}</span>
                  </div>
                  <div className="text-sm">
                    <strong>Sala:</strong> {item.sala}
                  </div>
                  <div className="mt-2 flex gap-4 justify-center">
                    <Link
                      to={`/jurisprudencia/resolucion/${item.id}`}
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Ver resolución
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Paginate
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            actualPage={actualPage}
            totalCount={totalCount}
            lastPage={lastPage}
          />
        </>
      )}
    </div>

  )
}

export default Resoluciones