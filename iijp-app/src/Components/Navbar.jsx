import { FaBars, FaTimes, FaHome } from "react-icons/fa";
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { navItems } from "./NavItems";
import "../Styles/main.css";
import NavLinks from "./NavLinks";
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
            <Link to="/Inicio" className="title">
              <FaHome />
              &nbsp;Inicio
            </Link>
            <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
              <FaBars id="bars" key="first" className={menuOpen ? "open" : ""}></FaBars>
              <FaTimes id="close" key="second" className={menuOpen ? "open" : ""}></FaTimes>
            </div>
            <ul className={menuOpen ? "open" : ""}>
            <NavLinks/>
              {navItems.map((item, index) => {
                return (
                  <li key={index}>
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
            <div id="settings" className="p-2 hover:bg-white hover:text-black rounded-lg m-2">
            <FaGear className="text-lg " />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
