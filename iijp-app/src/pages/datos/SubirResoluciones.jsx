import React, { useEffect, useState } from "react";
import { FaChartPie, FaMagnifyingGlassChart } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import AuthUser from "../../auth/AuthUser";
import Loading from "../../components/Loading";

const SubirResoluciones = () => {
  const { getToken, can, hasAnyPermission } = AuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const tarjetas = [
    {
      nombre: "Carga de Autos Supremos (CSV)",
      path: "/admin/subir/autos-supremos",
      icon: <FaChartPie className="text-white w-[50px] h-[50px]" />,
      permiso: "subir_resoluciones",
    },
    {
      nombre: "Carga de Jurisprudencias (CSV)",
      path: "/admin/subir/jurisprudencia",
      icon: <FaMagnifyingGlassChart className="text-white w-[50px] h-[50px]" />,
      permiso: "subir_jurisprudencia",
    },
    {
      nombre: "Carga Automática (Web Scraping)",
      path: "/admin/subir-automatico",
      icon: <FaMagnifyingGlassChart className="text-white w-[50px] h-[50px]" />,
      permiso: "web_scrapping",
    },
  ];

  useEffect(() => {
    if (
      !hasAnyPermission([
        "subir_resoluciones",
        "subir_jurisprudencia",
        "web_scrapping",
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
              <div className="group box-content bg-[#31363F] hover:bg-[#222831] p-4 m-4 hover:cursor-pointer rounded-lg hover:scale-125">
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
    </div>
  );
};

export default SubirResoluciones;
