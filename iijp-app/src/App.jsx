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
import { useLocation } from 'react-router-dom';
import JurisprudenciaLista from "./pages/analisis/JurisprudenciaLista";
import ListaMagistrados from "./pages/analisis/ListaMagistrados";
import MagistradoTSJ from "./pages/magistrados/MagistradoTSJ";
import Principal from "./pages/analisis/resoluciones/Principal";
import TablaCSV from "./pages/datos/TablaCSV";
import ListaSalas from "./pages/analisis/ListaSalas";
import Sala from "./pages/analisis/salas/Sala";
function App() {

  const location = useLocation();
  const noNavbarRoutes = ['/Jurisprudencia/Resolucion/:id']; // Agrega más rutas según sea necesario
  const noFooterRoutes = ['/Jurisprudencia/Resolucion/:id', '/Jurisprudencia/Busqueda','/Jurisprudencia/Cronologias'];
  const FooterRoutes = ['/Inicio', '/Novedades','/Jurisprudencia'];
  const shouldShowNavbar = !noNavbarRoutes.some((route) =>
    location.pathname.match(new RegExp(`^${route.replace(':id', '\\d+')}$`))
  );

  const shouldShowFooter = FooterRoutes.some((route) =>
    location.pathname.match(new RegExp(`^${route.replace(':id', '\\d+')}$`))
  );

  return (
    <ThemeProvider>
    <main>
      <React.Fragment>
        {shouldShowNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Navigate to="/Inicio" />} />
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Novedades" element={<Novedades />} />
          <Route path="/Jurisprudencia" element={<Jurisprudencia />} />
          <Route path="/Jurisprudencia/Analisis-Materia" element={<AnalisisMateria />} />
          <Route path="/Jurisprudencia/Lista-Magistrados" element={<ListaMagistrados />} />
          <Route path="/Jurisprudencia/Lista-de-analisis" element={<JurisprudenciaLista />} />
          <Route path="/Jurisprudencia/Resultados" element={<ResultadoAnalisis />} />
          <Route path="/Jurisprudencia/Busqueda" element={<JurisprudenciaBusqueda />} />
          <Route path="/Jurisprudencia/Cronologias" element={<JurisprudenciaCronologia />} />
          <Route path="/Jurisprudencia/Magistrado/:id" element={<MagistradoTSJ />} />
          <Route path="/Jurisprudencia/Resolucion/:id" element={<ResolucionTSJ />} />
          <Route path="/Jurisprudencia/Estadistica/sala/:id" element={<Sala />} />
          <Route path="/Jurisprudencia/Cronologias/Resultados" element={<CronologiasResultados />} />
          <Route path="/Jurisprudencia/Estadistica/Resoluciones" element={<Principal/>} />
          <Route path="//Jurisprudencia/lista-salas" element={<ListaSalas/>}/>
          <Route path="/insertar-datos" element={<TablaCSV/>}/>
        </Routes>
        {shouldShowFooter && <Footer />}
      </React.Fragment>
    </main>
  </ThemeProvider>
  );
}

export default App;
