import { MdTimeline } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { GiBolivia } from "react-icons/gi";
export const magistradoItems = [
  {
    id: 1,
    title: "Resumen",
    icon: (className) => <MdDashboard className={className} />,
  },
  {
    id: 2,
    title: "Estadísticas",
    icon: (className) => <IoStatsChart className={className} />,
  },
  {
    id: 3,
    title: "Series Temporales",
    icon: (className) => <MdTimeline className={className} />,
  },
  {
    id: 4,
    title: "Mapa",
    icon: (className) => <GiBolivia className={className} />,
  },
];
