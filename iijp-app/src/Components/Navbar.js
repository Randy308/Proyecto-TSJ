import { FaBars, FaTimes, FaHome } from "react-icons/fa";
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { navItems } from "./NavItems";
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
              {navItems.map((item) => {
                return (
                  <li>
                    <NavLink
                      to={item.path}
                      onClick={() => setMenuOpen(!menuOpen)}
                    >
                      {item.title}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
