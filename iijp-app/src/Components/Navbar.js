import { FaBars, FaTimes, FaHome } from "react-icons/fa";
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "../Styles/main.css";
function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header>
      <div id="nav-container">
        <div id="nav-content-1">
          <img src={require("../images/facultad.jpeg")} alt=""></img>

          <img src={require("../images/iijp.png")} alt=""></img>

          <img src={require("../images/umss.png")} alt=""></img>
        </div>
        <div id="nav-content-2">
          <nav>
            <Link to="/" className="title">
              <FaHome />
              &nbsp;Inicio
            </Link>
            <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <ul className={menuOpen ? "open" : ""}>
              
              <li>
                <NavLink to="/Analisis">Analisis de Datos</NavLink>
              </li>

              <li>
                <NavLink to="/Novedades">Novedades</NavLink>
              </li>
              <li>
                <NavLink to="/Recursos">Recursos</NavLink>
              </li>
              <li>
                <NavLink to="/Preguntas">Preguntas</NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
