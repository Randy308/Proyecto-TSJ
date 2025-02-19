import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Novedades from "./pages/Novedades";
import Inicio from "./pages/Inicio";
import Jurisprudencia from "./pages/Jurisprudencia";
import JurisprudenciaBusqueda from "./pages/busqueda/JurisprudenciaBusqueda";
import JurisprudenciaCronologia from "./pages/cronologia/JurisprudenciaCronologia";
import { ThemeProvider } from "./context/ThemeProvider";
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

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnalisisSala from "./pages/analisis/AnalisisSala";
import Usuarios from "./pages/admin/Usuarios";
import TablaJurisprudenciaCSV from "./pages/datos/TablaJurisprudenciaCSV";
import WebScrapping from "./pages/datos/WebScrapping";
import SubirResoluciones from "./pages/datos/SubirResoluciones";
import ListaRoles from "./pages/admin/Roles/ListaRoles";
import Prediction from "./pages/prediccion/Prediction";
import AnalisisAvanzado from "./pages/analisis/AnalisisAvanzado";
import ResultadoAvanzado from "./pages/analisis/ResultadoAvanzado";
import { MagistradosContextProvider } from "./context/magistradosContext";
import { HistoricContextProvider } from "./context/historicContext";

function App() {
  return (
    <ThemeProvider>
      <MagistradosContextProvider>
        <HistoricContextProvider>
          <main>
            <Routes>
              {/* Rutas públicas */}
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
                  path="jurisprudencia/lista-de-analisis"
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

              {/* Rutas protegidas */}
              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<LayoutUser />}>
                  <Route path="user" element={<PanelUser />} />
                  <Route path="dashboard" element={<PanelAdmin />} />
                  <Route
                    path="subir-resoluciones"
                    element={<SubirResoluciones />}
                  />
                  <Route
                    path="admin/subir/autos-supremos"
                    element={<TablaCSV />}
                  />
                  <Route
                    path="admin/subir/jurisprudencia"
                    element={<TablaJurisprudenciaCSV />}
                  />
                  <Route path="admin/subir" element={<TablaCSV />} />
                  <Route
                    path="admin/subir-automatico"
                    element={<WebScrapping />}
                  />
                  <Route path="usuarios" element={<Usuarios />} />
                  <Route path="roles" element={<ListaRoles />} />
                </Route>
              </Route>
            </Routes>
          </main>
          <ToastContainer />
        </HistoricContextProvider>
      </MagistradosContextProvider>
    </ThemeProvider>
  );
}

export default App;

