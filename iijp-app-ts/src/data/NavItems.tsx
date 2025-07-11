import { FaHome, FaSearch } from "react-icons/fa";
import { FaClock, FaFolderOpen, FaRegChartBar } from "react-icons/fa6";
import { MdOutlineSsidChart } from "react-icons/md";


export const jurisprudenciaItems = [
  {
    id: 1,
    title: "Generacion rápida",
    path: "/generacion-rapida",
    cName: "tool-item",
    resumen:
      "El módulo está diseñado para recuperar la información almacenada y presentarla de manera clara y comprensible para los usuarios. ",
    icon: <FaClock className="icon-style" />,
    color: "f86c6b",
  },
  {
    id: 2,
    title: "Generación avanzada",
    path: "/busqueda-de-jurisprudencia",
    cName: "tool-item",
    resumen:
      "El módulo de Cronojurídicas se encarga de recuperar la información segmentada de la jurisprudencia, y presentarla de manera estructurada, facilitando su comprensión y utilización posterior",
    icon: <FaSearch className="icon-style" />,
    color: "ffc107",
  },
];

export const navItemsAnalisis = [
  {
    id: 1,
    title: "Estadísticas Básicas",
    path: "/estadisticas-basicas",
    cName: "nav-item",
    icon: (
      <FaRegChartBar className="flex-shrink-0 w-5 h-5 transition duration-75" />
    ),
  },
  {
    id: 2,
    title: "Analisis Avanzado",
    path: "/analisis-avanzado",
    cName: "nav-item",
    icon: (
      <MdOutlineSsidChart className="flex-shrink-0 w-5 h-5 transition duration-75" />
    ),
  },

  // {
  //   id: 3,
  //   title: "Comparar Datos",
  //   path: "/comparar-datos",
  //   cName: "nav-item",
  //   icon: (
  //     <MdOutlineSsidChart className="flex-shrink-0 w-5 h-5 transition duration-75" />
  //   ),
  // },
];
export const navItems = [
  {
    id: 1,
    title: "Inicio",
    path: "/inicio",
    cName: "nav-item",
    lista: [],
    icon: <FaHome className="flex-shrink-0 w-5 h-5  transition duration-75 " />,
  },
  {
    id: 2,
    title: "Análisis",
    path: "/analisis",
    lista: navItemsAnalisis,
    cName: "nav-item",
    icon: (
      <FaRegChartBar className="flex-shrink-0 w-5 h-5 transition duration-75" />
    ),
  },
  {
    id: 3,
    title: "Cronojuridicas",
    path: "/jurisprudencia",
    cName: "nav-item",
    lista:  jurisprudenciaItems,
    icon: (
      <FaFolderOpen className="flex-shrink-0 w-5 h-5 transition duration-75" />
    ),
  },
  {
    id: 4,
    title: "Busqueda",
    path: "/busqueda",
    cName: "nav-item",
    lista: [],
    icon: <FaHome className="icon-style"/>
  },
];
