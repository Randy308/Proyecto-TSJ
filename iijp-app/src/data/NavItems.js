import { FaHome } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa6";
import { CgToolbox } from "react-icons/cg";
export const navItems = [
  {
    id: 0,
    title: "Inicio",
    path: "/inicio",
    cName: "nav-item",
    icon: <FaHome className="w-5 h-5 transition duration-75" />,
  },
  {
    id: 2,
    title: "Jurisprudencia",
    path: "/jurisprudencia",
    cName: "nav-item",
    icon: <CgToolbox className="w-5 h-5 transition duration-75" />,
  },
  {
    id: 3,
    title: "Novedades",
    path: "/novedades",
    cName: "nav-item",
    icon: <FaRegNewspaper className="w-5 h-5 transition duration-75" />,
  },
  // {
  //   id: 4,
  //   title: "Administración",
  //   path: "/admin",
  //   cName: "nav-item",
  //   icon: <FaHome className="icon-style"/>
  // },
];
