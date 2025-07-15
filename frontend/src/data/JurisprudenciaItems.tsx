import type { ReactNode } from "react";
import { FaSearch, FaClock } from "react-icons/fa";

interface Items {
  id: number;
  title: string;
  path: string;
  cName: string;
  resumen: string;
  color: string;
  icon: ReactNode;
}

export const jurisprudenciaItems: Items[] = [
  {
    id: 1,
    title: "Generacion rápida",
    path: "/generacion-rapida",
    cName: "tool-item",
    resumen:
      "El módulo está diseñado para recuperar la información almacenada y presentarla de manera clara y comprensible para los usuarios.",
    icon: <FaClock className="icon-style" />,
    color: "#f86c6b",
  },
  {
    id: 2,
    title: "Generación avanzada",
    path: "/busqueda-de-jurisprudencia",
    cName: "tool-item",
    resumen:
      "El módulo de Cronojurídicas se encarga de recuperar la información segmentada de la jurisprudencia, y presentarla de manera estructurada, facilitando su comprensión y utilización posterior.",
    icon: <FaSearch className="icon-style" />,
    color: "#ffc107",
  },
];
