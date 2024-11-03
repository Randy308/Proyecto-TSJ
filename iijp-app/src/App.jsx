import React from "react";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Novedades from "./pages/Novedades";
import Inicio from "./pages/Inicio";
import Footer from "./components/Footer";
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
import Principal from "./pages/analisis/resoluciones/Principal";
import TablaCSV from "./pages/datos/TablaCSV";
import ListaSalas from "./pages/analisis/ListaSalas";
import Sala from "./pages/analisis/salas/Sala";
import CompararDatos from "./pages/comparar/CompararDatos";
import LayoutPublic from "./layouts/LayoutPublic";
import ProtectedRoutes from "./auth/ProtectedRoutes";
import LayoutAdmin from "./layouts/LayoutAdmin";
import Login from "./auth/Login";
import Register from "./auth/Register";
import LayoutUser from "./layouts/LayoutUser";
import { PanelUser } from "./pages/user/PanelUser";
import PanelAdmin from "./pages/admin/PanelAdmin";
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
                path="/jurisprudencia/estadistica/sala/:id"
                element={<Sala />}
              />
              <Route path="/comparar-datos" element={<CompararDatos />} />
              <Route
                path="/jurisprudencia/cronologias/resultados"
                element={<CronologiasResultados />}
              />
              <Route
                path="/jurisprudencia/estadistica/resoluciones"
                element={<Principal />}
              />
              <Route
                path="/jurisprudencia/lista-salas"
                element={<ListaSalas />}
              />
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
    </ThemeProvider>
  );
}

export default App;
