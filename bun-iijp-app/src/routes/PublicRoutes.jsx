import { Navigate, Route } from "react-router-dom";
import LayoutPublic from "../layouts/LayoutPublic";
import Inicio from "../pages/Inicio";
import Novedades from "../pages/Novedades";
import Jurisprudencia from "../pages/Jurisprudencia";
import EstadisticasBasicas from "../pages/estadisticas-basicas/EstadisticasBasicas";
import AnalisisBasico from "../pages/estadisticas-basicas/AnalisisBasico";
import Busqueda from "../pages/busqueda/Busqueda";
import GeneracionRapida from "../pages/cronologia/GeneracionRapida";
import CronologiasAvanzadas from "../pages/cronologia/CronologiasAvanzadas";
import AnalisisAvanzado from "../pages/analisis/AnalisisAvanzado";
import CronologiasResultados from "../pages/cronologia/CronologiasResultados";
import SerieTemporal from "../pages/analisis/SerieTemporal";
import Mapa from "../pages/analisis/Mapa";
import Login from "../auth/Login";
import AnalisisHome from "../pages/analisis/AnalisisHome";
import CompararDatos from "../pages/comparar/CompararDatos";

export function PublicRoutes() {
  return (
    <>
      <Route path="/" element={<LayoutPublic />}>
        <Route index element={<Navigate to="/inicio" />} />
        <Route path="inicio" element={<Inicio />} />
        <Route path="novedades" element={<Novedades />} />
        <Route path="jurisprudencia" element={<Jurisprudencia />} />
        <Route path="analisis" element={<AnalisisHome />} />
        <Route path="estadisticas-basicas" element={<EstadisticasBasicas />} />
        <Route path="estadisticas-basicas/:id" element={<AnalisisBasico />} />
        <Route path="busqueda" element={<Busqueda />} />

        <Route path="generacion-rapida" element={<GeneracionRapida />} />
        <Route path="comparar-datos" element={<CompararDatos />} />
        <Route
          path="busqueda-de-jurisprudencia"
          element={<CronologiasAvanzadas />}
        />

        <Route
          path="jurisprudencia/cronologias/resultados"
          element={<CronologiasResultados />}
        />
        <Route path="analisis-avanzado" element={<AnalisisAvanzado />} />
        <Route path="serie-temporal/:id" element={<SerieTemporal />} />
        <Route path="mapa-estadistico/:id" element={<Mapa />} />

        <Route path="iijp-login" element={<Login />} />
      </Route>
    </>
  );
}
