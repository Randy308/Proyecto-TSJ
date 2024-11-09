import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Novedades from "./pages/Novedades";
import Inicio from "./pages/Inicio";
import Jurisprudencia from "./pages/Jurisprudencia";
import JurisprudenciaBusqueda from "./pages/busqueda/JurisprudenciaBusqueda";
import AnalisisMateria from "./pages/analisis/AnalisisMateria";
import JurisprudenciaCronologia from "./pages/cronologia/JurisprudenciaCronologia";
import ResultadoAnalisis from "./pages/analisis/ResultadoAnalisis";
import { ThemeProvider } from "./components/ThemeProvider";
import ResolucionTSJ from "./pages/resoluciones/ResolucionTSJ";
import CronologiasResultados from "./pages/cronologia/CronologiasResultados";
import JurisprudenciaLista from "./pages/analisis/JurisprudenciaLista";
import ListaMagistrados from "./pages/analisis/ListaMagistrados";
import MagistradoTSJ from "./pages/magistrados/MagistradoTSJ";
import TablaCSV from "./pages/datos/TablaCSV";
import ListaSalas from "./pages/analisis/ListaSalas";
import CompararDatos from "./pages/comparar/CompararDatos";
import LayoutPublic from "./layouts/LayoutPublic";
import ProtectedRoutes from "./auth/ProtectedRoutes";
import LayoutAdmin from "./layouts/LayoutAdmin";
import Login from "./auth/Login";
import Register from "./auth/Register";
import LayoutUser from "./layouts/LayoutUser";
import { PanelUser } from "./pages/user/PanelUser";
import PanelAdmin from "./pages/admin/PanelAdmin";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnalisisSala from "./pages/analisis/AnalisisSala";
import TablaXYZ from "./components/TablaXYZ";
import Prueba from "./components/Prueba";
import TablaXY from "./components/TablaXY";
import Analisis2D from "./pages/analisis/Analisis2D";

function App() {
  return (
    <ThemeProvider>
      <main>
        <React.Fragment>
          <Routes>
            //rutas publicas
            <Route path="/" element={<LayoutPublic />}>
              <Route index element={<Navigate to="/inicio" />} />
              <Route path="inicio" element={<Inicio />} />
              <Route path="/novedades" element={<Novedades />} />
              <Route path="/jurisprudencia" element={<Jurisprudencia />} />
              <Route
                path="/jurisprudencia/analisis-Materia"
                element={<AnalisisMateria />}
              />
              <Route
                path="/jurisprudencia/lista-Magistrados"
                element={<ListaMagistrados />}
              />
              <Route
                path="/jurisprudencia/lista-de-analisis"
                element={<JurisprudenciaLista />}
              />
              <Route
                path="/jurisprudencia/resultados"
                element={<ResultadoAnalisis />}
              />
              <Route
                path="/jurisprudencia/busqueda"
                element={<JurisprudenciaBusqueda />}
              />
              <Route
                path="/jurisprudencia/cronologias"
                element={<JurisprudenciaCronologia />}
              />
              <Route
                path="/jurisprudencia/magistrado/:id"
                element={<MagistradoTSJ />}
              />
              <Route
                path="/jurisprudencia/resolucion/:id"
                element={<ResolucionTSJ />}
              />

              <Route
                path="/prueba-tabla"
                element={<Analisis2D />}
              />
              <Route path="/comparar-datos" element={<CompararDatos />} />
              <Route
                path="/jurisprudencia/cronologias/resultados"
                element={<CronologiasResultados />}
              />
              <Route
                path="/jurisprudencia/lista-salas"
                element={<ListaSalas />}
              />
              <Route path="/grafica/prueba" element={<Prueba/>} />
              <Route path="/analisis/sala/:id" element={<AnalisisSala />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registrar" element={<Register />} />
            </Route>
            //rutas admin
            <Route path="/" element={<ProtectedRoutes />}>
              <Route path="/" element={<LayoutAdmin />}>
                <Route path="/admin" element={<PanelAdmin />} />
                <Route path="/admin/subir" element={<TablaCSV />} />
              </Route>
            </Route>
            //rutas user
            <Route path="/" element={<ProtectedRoutes />}>
              <Route path="/" element={<LayoutUser />}>
                <Route path="/user" element={<PanelUser />} />
              </Route>
            </Route>
          </Routes>
        </React.Fragment>
      </main>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
