import { useEffect, useState } from "react";
import { useAuthContext } from "../context";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { FaChartPie } from "react-icons/fa";
import { FaMagnifyingGlassChart } from "react-icons/fa6";

const Exportar = () => {
  const { can, hasAnyPermission } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!can("exportar_datos")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [can, navigate]);

  const tarjetas = [
    {
      nombre: "Exportar Materias",
      path: "/admin/exportar/materias",
      icon: <FaChartPie className="w-14 h-14 text-blue-500 group-hover:text-blue-400 transition-colors" />,
      permiso: "exportar_materias",
    },
    {
      nombre: "Exportar Resoluciones",
      path: "/admin/exportar/resoluciones",
      icon: <FaMagnifyingGlassChart className="w-14 h-14 text-green-500 group-hover:text-green-400 transition-colors" />,
      permiso: "exportar_datos",
    },
  ];

  useEffect(() => {
    if (!hasAnyPermission(["exportar_datos", "exportar_materias"])) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [hasAnyPermission, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col container mx-auto pt-6">
      {/* Breadcrumb */}
      <span className="mb-4 text-gray-600 dark:text-gray-400 text-sm">
        <a href="/" className="hover:underline hover:text-blue-500">
          Inicio
        </a>{" "}
        <span className="font-bold">/ Exportar datos</span>
      </span>

      {/* Título */}
      <h1 className="text-3xl font-extrabold mb-10 text-gray-900 dark:text-gray-100 text-center">
        Opciones para exportar datos
      </h1>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        {tarjetas.map((tarjeta) =>
          can(tarjeta.permiso) ? (
            <Link to={tarjeta.path} key={tarjeta.nombre}>
              <div className="group bg-white dark:bg-[#1E1E2F] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 p-6 flex flex-col items-center text-center">
                <div className="mb-4">{tarjeta.icon}</div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
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

export default Exportar;
