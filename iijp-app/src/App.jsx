import React from "react";
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import Analisis from "./Components/pages/Analisis";
import Novedades from "./Components/pages/Novedades";
import Inicio from "./Components/pages/Inicio";
import Footer from "./Components/Footer";
import Generalidades from "./Components/pages/Generalidades";
import Jurisprudencia from "./Components/pages/Jurisprudencia";
import JurisprudenciaBusqueda from "./Components/pages/Jurisprudencia/JurisprudenciaBusqueda";
import JurisprudenciaAnalisis from "./Components/pages/Jurisprudencia/JurisprudenciaAnalisis";
import JurisprudenciaCronologia from "./Components/pages/Jurisprudencia/JurisprudenciaCronologia";
function App() {
  return (
    <main>
      <React.Fragment>
        <Navbar></Navbar>
        <Routes>
          <Route path="/Analisis" element={<Analisis />}></Route>
          <Route path="/Inicio" element={<Inicio />}></Route>
          <Route path="/Novedades" element={<Novedades />}></Route>
          <Route path="/Generalidades" element={<Generalidades />}></Route>
          <Route path="/Jurisprudencia" element={<Jurisprudencia />}></Route>


          <Route path="/Jurisprudencia/Analisis" element={<JurisprudenciaAnalisis />}></Route>
          <Route path="/Jurisprudencia/Busqueda" element={<JurisprudenciaBusqueda />}></Route>
          <Route path="/Jurisprudencia/Cronologias" element={<JurisprudenciaCronologia />}></Route>
        </Routes>
        <Footer></Footer>
      </React.Fragment>
    </main>
    
  );
}

export default App;
