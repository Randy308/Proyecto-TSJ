import { Navigate, Route, Routes } from "react-router-dom";
import LayoutPublic from "../layouts/LayoutPublic";
import Inicio from "../pages/Inicio";
import Novedades from "../pages/Novedades";
import Jurisprudencia from "../pages/Jurisprudencia";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ListaMagistrados from "../pages/analisis/ListaMagistrados";
import MagistradoTSJ from "../pages/magistrados/MagistradoTSJ";
import JurisprudenciaLista from "../pages/analisis/JurisprudenciaLista";
import JurisprudenciaBusqueda from "../pages/busqueda/JurisprudenciaBusqueda";
import JurisprudenciaCronologia from "../pages/cronologia/JurisprudenciaCronologia";
import Prediction from "../pages/prediccion/Prediction";
import ResolucionTSJ from "../pages/resoluciones/ResolucionTSJ";
import CompararDatos from "../pages/comparar/CompararDatos";
import CronologiasResultados from "../pages/cronologia/CronologiasResultados";
import ListaSalas from "../pages/analisis/ListaSalas";
import AnalisisAvanzado from "../pages/analisis/AnalisisAvanzado";
import ResultadoAvanzado from "../pages/analisis/ResultadoAvanzado";
import AnalisisSala from "../pages/analisis/AnalisisSala";


const PublicRoutes = () => {
    return (

        <Route path="/" element={<LayoutPublic />}>
            <Route index element={<Navigate to="/inicio" />} />
            <Route path="inicio" element={<Inicio />} />
            <Route path="novedades" element={<Novedades />} />
            <Route path="jurisprudencia" element={<Jurisprudencia />} />

            <Route
                path="jurisprudencia/lista-Magistrados"
                element={<ListaMagistrados />}
            />
            <Route
                path="jurisprudencia/magistrado/:id"
                element={<MagistradoTSJ />}
            />

            <Route
                path="estadisticas-basicas"
                element={<JurisprudenciaLista />}
            />
            <Route path="busqueda" element={<JurisprudenciaBusqueda />} />
            <Route
                path="jurisprudencia/cronologias"
                element={<JurisprudenciaCronologia />}
            />
            <Route path="proyeccion" element={<Prediction />} />
            <Route
                path="jurisprudencia/resolucion/:id"
                element={<ResolucionTSJ />}
            />
            <Route path="comparar-datos" element={<CompararDatos />} />
            <Route
                path="jurisprudencia/cronologias/resultados"
                element={<CronologiasResultados />}
            />
            <Route
                path="jurisprudencia/lista-salas"
                element={<ListaSalas />}
            />
            <Route
                path="analisis/avanzado"
                element={<AnalisisAvanzado />}
            />
            <Route
                path="analisis/avanzado/:id"
                element={<ResultadoAvanzado />}
            />
            <Route path="analisis/sala/:id" element={<AnalisisSala />} />
            <Route path="iijp-login" element={<Login />} />
            <Route path="registrar" element={<Register />} />
        </Route>

    );
};

export default PublicRoutes;
