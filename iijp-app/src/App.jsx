import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
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
import Usuarios from "./pages/admin/usuarios/Usuarios";
import TablaJurisprudenciaCSV from "./pages/datos/TablaJurisprudenciaCSV";
import WebScrapping from "./pages/datos/WebScrapping";
import SubirResoluciones from "./pages/datos/SubirResoluciones";
import ListaRoles from "./pages/admin/Roles/ListaRoles";
import Prediction from "./pages/prediccion/Prediction";
import AnalisisAvanzado from "./pages/analisis/AnalisisAvanzado";
import ResultadoAvanzado from "./pages/analisis/ResultadoAvanzado";
import { MagistradosContextProvider } from "./context/magistradosContext";
import { HistoricContextProvider } from "./context/historicContext";
import { PostContextProvider } from "./context/postContext";

//context para rutas protegidas
import { RoleContextProvider } from "./context/roleContext";
import { PermissionContextProvider } from "./context/permissionContext";
import { UserContextProvider } from "./context/userContext";
import { NotificationContextProvider } from "./context/notificationContext";
import { VariablesContextProvider } from "./context/variablesContext";
import EstadisticasBasicas from "./pages/estadisticas-basicas/EstadisticasBasicas";
import AnalisisBasico from "./pages/estadisticas-basicas/AnalisisBasico";
import Busqueda from "./pages/busqueda/Busqueda";
import { NodosContextProvider } from "./context/nodosContext";
import CronologiasBasicas from "./pages/cronologia/CronologiasBasicas";
import CronologiasAvanzadas from "./pages/cronologia/CronologiasAvanzadas";

function App() {
  return (
    <ThemeProvider>
      <PostContextProvider>
        <MagistradosContextProvider>
          <HistoricContextProvider>
            <NodosContextProvider>
              <VariablesContextProvider>
                {/* Contexto para el usuario */}

                <main>
                  <Routes>
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

                    {/* Rutas públicas */}
                    <Route path="/" element={<LayoutPublic />}>
                      <Route index element={<Navigate to="/inicio" />} />
                      <Route path="inicio" element={<Inicio />} />
                      <Route path="novedades" element={<Novedades />} />
                      <Route
                        path="jurisprudencia"
                        element={<Jurisprudencia />}
                      />
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
                        element={<EstadisticasBasicas />}
                      />
                      <Route
                        path="estadisticas-basicas/:id"
                        element={<AnalisisBasico />}
                      />
                      <Route path="busqueda" element={<Busqueda />} />
                      <Route
                        path="jurisprudencia/cronologias"
                        element={<CronologiasBasicas />}
                      />

                      <Route
                        path="busqueda-de-jurisprudencia"
                        element={<CronologiasAvanzadas />}
                      />

                      <Route path="proyeccion" element={<Prediction />} />

                      <Route
                        path="comparar-datos"
                        element={<CompararDatos />}
                      />
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

                      <Route
                        path="analisis/sala/:id"
                        element={<AnalisisSala />}
                      />
                      <Route path="iijp-login" element={<Login />} />
                      <Route path="registrar" element={<Register />} />
                    </Route>
                  </Routes>
                </main>
                <ToastContainer />
              </VariablesContextProvider>
            </NodosContextProvider>
          </HistoricContextProvider>
        </MagistradosContextProvider>
      </PostContextProvider>
    </ThemeProvider>
  );
}

export default App;
