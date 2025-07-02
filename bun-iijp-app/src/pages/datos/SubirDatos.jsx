import React, { useEffect, useState } from "react";
import {
  FaChartPie,
  FaMagnifyingGlassChart,
  FaRegCircle,
} from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import AuthUser from "../../auth/AuthUser";
import Loading from "../../components/Loading";
import { useResolutionContext } from "../../context/resolutionContext";
import Paginate from "../../components/tables/Paginate";
import { FaCheckCircle } from "react-icons/fa";
import PortalButton from "../../components/modal/PortalButton";
import { MdOutlineZoomInMap } from "react-icons/md";
import ResolucionTSJ from "../resoluciones/ResolucionTSJ";

const SubirDatos = () => {
  const { getToken, can, hasAnyPermission } = AuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const {
    resolutions,
    totalResolutions,
    pageCount,
    current,
    obtenerResolutions,
  } = useResolutionContext();
  const tarjetas = [
    {
      nombre: "Carga de Autos Supremos (CSV)",
      path: "/admin/subir-autos-supremos",
      icon: <FaChartPie className="text-white w-[50px] h-[50px]" />,
      permiso: "subir_resoluciones",
    },
    {
      nombre: "Carga de Jurisprudencias (CSV)",
      path: "/admin/subir-jurisprudencia",
      icon: <FaMagnifyingGlassChart className="text-white w-[50px] h-[50px]" />,
      permiso: "subir_jurisprudencia",
    },
    {
      nombre: "Carga Automática (Web Scraping)",
      path: "/admin/realizar-web-scrapping",
      icon: <FaMagnifyingGlassChart className="text-white w-[50px] h-[50px]" />,
      permiso: "realizar_web_scrapping",
    },
  ];
  const handlePageClick = (page) => {
    const selectedPage = Math.min(page, pageCount);
    obtenerResolutions(selectedPage);
  };

  useEffect(() => {
    if (
      !hasAnyPermission([
        "subir_resoluciones",
        "subir_jurisprudencia",
        "realizar_web_scrapping",
      ])
    ) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [hasAnyPermission, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center container mx-auto pt-4 mt-4">
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-white text-center">
        Opciones para subir Resoluciones
      </h1>

      <div className="flex flex-row flex-wrap gap-4 justify-center items-center">
        {tarjetas.map((tarjeta) =>
          can(tarjeta.permiso) ? (
            <Link to={tarjeta.path} key={tarjeta.nombre}>
              <div className="group box-content bg-[#31363F] hover:bg-[#222831] p-4 hover:cursor-pointer rounded-lg hover:scale-125">
                <div className="flex justify-center p-4 transition-transform border-black group-hover:animate-bounce">
                  {tarjeta.icon}
                </div>
                <p className="text-center text-white my-4 py-4">
                  {tarjeta.nombre}
                </p>
              </div>
            </Link>
          ) : null
        )}
      </div>
      {resolutions.length > 0 ? (
        <>
          <div className="relative md:w-full overflow-x-auto space-y-4 my-4">
            {/* Selector global */}
            <table
              className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border
         border-gray-300 dark:border-gray-600 rounded-lg p-4 hidden md:table"
            >
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {Object.keys(resolutions[0]).map((item) => (
                    <th scope="col" className="px-6 py-3">
                      {item}
                    </th>
                  ))}

                  <th scope="col" className="px-6 py-3">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {resolutions.map((item, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <th scope="row" className="px-6 py-4">
                      {item.id}
                    </th>
                    <th scope="row" className="px-6 py-4">
                      {item.fecha_emision}
                    </th>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {item.nro_expediente}
                    </td>
                    <td className="px-6 py-4">{item.nro_resolucion}</td>
                    <td className="px-6 py-4">
                      <PortalButton
                        Icon={MdOutlineZoomInMap}
                        title="Auto Supremo"
                        color="red"
                        name={"Ver"}
                        large={true}
                        full={false}
                        content={(setShowModal) => (
                          <ResolucionTSJ id={item.id} />
                        )}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tarjetas */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {resolutions.map((item, index) => (
                <div
                  key={index}
                  className={`relative p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-md border-2 hover:shadow-lg transition border-gray-100`}
                >
                  {/* Botón de ver resolución */}
                  <div className="mt-2 flex justify-center text-center text-xl">
                    <PortalButton
                      Icon={MdOutlineZoomInMap}
                      title="Auto Supremo"
                      name={`Resolución ${item.nro_resolucion}`}
                      color="link"
                      full={false}
                      large={true}
                      content={(setShowModal) => <ResolucionTSJ id={item.id} />}
                    />
                  </div>

                  {/* Información detallada */}
                  <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="mb-1">
                      <span className="font-medium">Periodo:</span>{" "}
                      {item.fecha_emision}
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">
                          Numero de expediente:
                        </span>
                        <div
                          className="pl-2 mt-1 border-l-4 border-blue-500 dark:border-blue-400"
                          dangerouslySetInnerHTML={{
                            __html: item.nro_expediente,
                          }}
                        />
                      </div>
                      <div>
                        <span className="font-medium">
                          Numero de resolución:
                        </span>
                        <div
                          className="pl-2 mt-1 border-l-4 border-green-500 dark:border-green-400"
                          dangerouslySetInnerHTML={{
                            __html: item.nro_resolucion,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paginación */}
          <div className="mt-6">
            <Paginate
              handlePageClick={handlePageClick}
              pageCount={pageCount}
              actualPage={current}
              totalCount={totalResolutions}
              lastPage={pageCount}
            />
          </div>
        </>
      ) : (
        <div className="text-center my-8 h-[400px] flex flex-col items-center justify-center">
         
          <p className="text-gray-600 dark:text-gray-400">
            No cuenta con resoluciones registradas con su cuenta.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubirDatos;
