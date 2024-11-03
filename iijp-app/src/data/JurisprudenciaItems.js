import { FaChartLine, FaSearch, FaClock } from 'react-icons/fa'; // Importa los iconos que necesitas

export const jurisprudenciaItems = [
  {
    id: 1,
    title: "Estadisticas",
    path: "/jurisprudencia/lista-de-analisis",
    cName: "tool-item",
    resumen : "El módulo de Estadísticas está diseñado para recuperar la información almacenada y presentarla de manera clara y comprensible para los usuarios. ",
    icon: <FaChartLine className="icon-style"/> ,
    color: "f86c6b"
  },{
    id: 2,
    title: "Cronojuridicas",
    path: "/jurisprudencia/cronologias",
    cName: "tool-item",
    resumen : "El módulo de Cronojurídicas se encarga de recuperar la información segmentada de la jurisprudencia, y presentarla de manera estructurada, facilitando su comprensión y utilización posterior",
    icon: <FaSearch className="icon-style"/> ,
    color: "ffc107"
  },{
    id: 3,
    title: "Analisis Avanzado",
    path: "/comparar-datos",
    cName: "tool-item",
    resumen : "El Módulo de Análisis Avanzado está diseñado para proporcionar a los usuarios herramientas poderosas para la comparación y el análisis profundo de datos.",
    icon: <FaClock className="icon-style"/> ,
    color: "4dbd74"
  },
];
