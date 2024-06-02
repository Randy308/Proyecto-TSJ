import { FaChartLine, FaSearch, FaClock } from 'react-icons/fa'; // Importa los iconos que necesitas

export const jurisprudenciaItems = [
  {
    id: 1,
    title: "Analisis",
    path: "/Jurisprudencia/Analisis",
    cName: "tool-item",
    icon: <FaChartLine className="icon-style"/> 
  },{
    id: 2,
    title: "Busqueda",
    path: "/Jurisprudencia/Busqueda",
    cName: "tool-item",
    icon: <FaSearch className="icon-style"/> 
  },{
    id: 3,
    title: "Cronologias",
    path: "/Jurisprudencia/Cronologias",
    cName: "tool-item",
    icon: <FaClock className="icon-style"/> 
  },
];
