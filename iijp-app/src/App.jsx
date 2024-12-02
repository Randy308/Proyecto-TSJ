import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Novedades from "./pages/Novedades";
import Inicio from "./pages/Inicio";
import Jurisprudencia from "./pages/Jurisprudencia";
import JurisprudenciaBusqueda from "./pages/busqueda/JurisprudenciaBusqueda";
import JurisprudenciaCronologia from "./pages/cronologia/JurisprudenciaCronologia";
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

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnalisisSala from "./pages/analisis/AnalisisSala";
import Usuarios from "./pages/admin/Usuarios";
import TablaJurisprudenciaCSV from "./pages/datos/TablaJurisprudenciaCSV";
import WebScrapping from "./pages/datos/WebScrapping";
import SubirResoluciones from "./pages/datos/SubirResoluciones";
import ListaRoles from "./pages/admin/Roles/ListaRoles";
import Prediccion from "./pages/prediccion/Prediccion";

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
                path="/jurisprudencia/lista-Magistrados"
                element={<ListaMagistrados />}
              />
              <Route
                path="/jurisprudencia/lista-de-analisis"
                element={<JurisprudenciaLista />}
              />
              <Route path="/busqueda" element={<JurisprudenciaBusqueda />} />
              <Route
                path="/jurisprudencia/cronologias"
                element={<JurisprudenciaCronologia />}
              />
              <Route
                path="/jurisprudencia/magistrado/:id"
                element={<MagistradoTSJ />}
              />

              <Route
                path="/proyeccion"
                element={<Prediccion />}
              />

              <Route
                path="/jurisprudencia/resolucion/:id"
                element={<ResolucionTSJ />}
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
              <Route path="/analisis/sala/:id" element={<AnalisisSala />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registrar" element={<Register />} />
            </Route>
            //rutas admin
            {/* <Route path="/" element={<ProtectedRoutes />}>
              <Route path="/" element={<LayoutAdmin />}>
                <Route path="/admin" element={<PanelAdmin />} />
                <Route path="/admin/subir" element={<SubirResoluciones />} />
                <Route
                  path="/admin/subir/autos-supremos"
                  element={<TablaCSV />}
                />
                <Route
                  path="/admin/subir/jurisprudencia"
                  element={<TablaJurisprudenciaCSV />}
                />
                <Route path="/admin/subir" element={<TablaCSV />} />
                <Route
                  path="/admin/subir-automatico"
                  element={<WebScrapping />}
                />
                <Route path="/admin/usuarios" element={<Usuarios />} />
                <Route path="/admin/roles" element={<ListaRoles />} />
              </Route>
            </Route> */}
            //rutas user
            <Route path="/" element={<ProtectedRoutes />}>
              <Route path="/" element={<LayoutUser />}>
                <Route path="/user" element={<PanelUser />} />
                <Route path="/dashboard" element={<PanelAdmin />} />
                <Route path="/subir-resoluciones" element={<SubirResoluciones />} />
                <Route
                  path="/admin/subir/autos-supremos"
                  element={<TablaCSV />}
                />
                <Route
                  path="/admin/subir/jurisprudencia"
                  element={<TablaJurisprudenciaCSV />}
                />
                <Route path="/admin/subir" element={<TablaCSV />} />
                <Route
                  path="/admin/subir-automatico"
                  element={<WebScrapping />}
                />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/roles" element={<ListaRoles />} />
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
