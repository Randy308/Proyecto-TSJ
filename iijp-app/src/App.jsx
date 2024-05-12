import React from "react";
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import Analisis from "./Components/pages/Analisis";
import Novedades from "./Components/pages/Novedades";
import Inicio from "./Components/pages/Inicio";
import Footer from "./Components/Footer";
import Generalidades from "./Components/pages/Generalidades";

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
        </Routes>
        <Footer></Footer>
      </React.Fragment>
    </main>
    
  );
}

export default App;
