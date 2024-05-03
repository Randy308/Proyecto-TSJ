import React from 'react';
import Navbar from "./Components/Navbar";
import { Route,Routes } from 'react-router-dom';
import Analisis from './Components/pages/Analisis';
import Novedades from './Components/pages/Novedades';

function App() {
  return (
    <React.Fragment>
      <Navbar></Navbar>
      <Routes>
    <Route path="/Analisis" element={<Analisis/>}></Route>
    <Route path="/Novedades" element={<Novedades/>}></Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;
