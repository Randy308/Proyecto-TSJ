import React from "react";
import Navbar from "./Components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Analisis from "./Components/pages/Preguntas";
import Novedades from "./Components/pages/Novedades";
import Inicio from "./Components/pages/Inicio";
import Footer from "./Components/Footer";
import Preguntas from "./Components/pages/Preguntas";
import Jurisprudencia from "./Components/pages/pages_randy/Jurisprudencia";
import JurisprudenciaBusqueda from "./Components/pages/pages_randy/JurisprudenciaBusqueda";
import JurisprudenciaAnalisis from "./Components/pages/pages_randy/JurisprudenciaAnalisis";
import JurisprudenciaCronologia from "./Components/pages/pages_randy/JurisprudenciaCronologia";
import ResultadoAnalisis from "./Components/pages/pages_randy/ResultadoAnalisis";
import { ThemeProvider } from "./Components/ThemeProvider";
import ResolucionTSJ from "./Components/pages/pages_randy/resoluciones/ResolucionTSJ";
import CronologiasResultados from "./Components/pages/pages_randy/CronologiasResultados";
import { useLocation } from 'react-router-dom';
function App() {

  const location = useLocation();
  const noNavbarRoutes = ['/Jurisprudencia/Resolucion/:id']; // Agrega más rutas según sea necesario
  const noFooterRoutes = ['/Jurisprudencia/Resolucion/:id', '/Jurisprudencia/Busqueda','/Jurisprudencia/Cronologias'];
  const shouldShowNavbar = !noNavbarRoutes.some((route) =>
    location.pathname.match(new RegExp(`^${route.replace(':id', '\\d+')}$`))
  );

  const shouldShowFooter = !noFooterRoutes.some((route) =>
    location.pathname.match(new RegExp(`^${route.replace(':id', '\\d+')}$`))
  );

  return (
    <ThemeProvider>
    <main>
      <React.Fragment>
        {shouldShowNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Navigate to="/Inicio" />} />
          <Route path="/Analisis" element={<Analisis />} />
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Novedades" element={<Novedades />} />
          <Route path="/Preguntas" element={<Preguntas />} />
          <Route path="/Jurisprudencia" element={<Jurisprudencia />} />
          <Route path="/Jurisprudencia/Analisis" element={<JurisprudenciaAnalisis />} />
          <Route path="/Jurisprudencia/Resultados" element={<ResultadoAnalisis />} />
          <Route path="/Jurisprudencia/Busqueda" element={<JurisprudenciaBusqueda />} />
          <Route path="/Jurisprudencia/Cronologias" element={<JurisprudenciaCronologia />} />
          <Route path="/Jurisprudencia/Resolucion/:id" element={<ResolucionTSJ />} />
          <Route path="/Jurisprudencia/Cronologias/Resultados" element={<CronologiasResultados />} />
        </Routes>
        {shouldShowFooter && <Footer />}
      </React.Fragment>
    </main>
  </ThemeProvider>
  );
}

export default App;
