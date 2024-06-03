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

function App() {

  return (
    <ThemeProvider>
      <main>
        <React.Fragment>
          <Navbar></Navbar>
         
          <Routes>
            <Route path="/" element={<Navigate to="/Inicio" />}></Route>
            <Route path="/Analisis" element={<Analisis />}></Route>
            <Route path="/Inicio" element={<Inicio />}></Route>
            <Route path="/Novedades" element={<Novedades />}></Route>
            <Route path="/Preguntas" element={<Preguntas />}></Route>
            <Route path="/Jurisprudencia" element={<Jurisprudencia />}></Route>
            <Route
              path="/Jurisprudencia/Analisis"
              element={<JurisprudenciaAnalisis />}
            ></Route>
            <Route
              path="/Jurisprudencia/Resultados"
              element={<ResultadoAnalisis />}
            ></Route>
            <Route
              path="/Jurisprudencia/Busqueda"
              element={<JurisprudenciaBusqueda />}
            ></Route>
            <Route
              path="/Jurisprudencia/Cronologias"
              element={<JurisprudenciaCronologia />}
            ></Route>
          </Routes>
          <Footer></Footer>
        </React.Fragment>
      </main>
    </ThemeProvider>
  );
}

export default App;
