import { FaHome } from "react-icons/fa";
import { FaFolderOpen, FaRegChartBar, FaRegNewspaper } from "react-icons/fa6";
import { CgToolbox } from "react-icons/cg";
import { MdOutlineSsidChart } from "react-icons/md";
export const navItems = [
  {
    id: 0,
    title: "Inicio",
    path: "/inicio",
    cName: "nav-item",
    icon: <FaHome className="flex-shrink-0 w-5 h-5  transition duration-75 " />,
  },
  {
    id: 1,
    title: "Estadísticas Básicas",
    path: "/estadisticas-basicas",
    cName: "nav-item",
    icon: <FaRegChartBar  className="flex-shrink-0 w-5 h-5 transition duration-75" />,
  },
  {
    id: 2,
    title: "Documentos",
    path: "/jurisprudencia",
    cName: "nav-item",
    icon: <FaFolderOpen  className="flex-shrink-0 w-5 h-5 transition duration-75" />,
  },
  {
    id: 3,
    title: "Analisis Avanzado",
    path: "/comparar-datos",
    cName: "nav-item",
    icon: <MdOutlineSsidChart  className="flex-shrink-0 w-5 h-5 transition duration-75" />,
  },
  {
    id: 4,
    title: "Novedades",
    path: "/novedades",
    cName: "nav-item",
    icon: <FaRegNewspaper className="flex-shrink-0 w-5 h-5 transition duration-75" />,
  },
  // {
  //   id: 4,
  //   title: "Administración",
  //   path: "/admin",
  //   cName: "nav-item",
  //   icon: <FaHome className="icon-style"/>
  // },
];
