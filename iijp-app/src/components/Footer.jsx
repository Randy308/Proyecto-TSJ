import React from "react";
import "../styles/footer.css";
import { FaFacebook } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

import iijp from "../images/iijp.png";

const Footer = () => {
  return (
    <footer>
      <div className="footer flex flex-row justify-center flex-wrap gap-10 p-4">
        <div className="flex justify-center items-center">
          <img src={iijp} alt="Logo del IIJP" id="imagen-footer" className="rounded-md" />
        </div>
        <div className="footer-title flex  flex-col items-start justify-center gap-4">
          <div className="titulo">Ubicacion</div>
          <p className="titulo">
            © 2024 IIJP - Instituto de Investigaciones Juridicas y Politicas
          </p>
        </div>
        <div className="flex flex-col justify-center flex-wrap gap-4 items-start">
          <div className="titulo">Redes Sociales</div>
          <div id="footer-icons" className="flex flex-row flex-wrap gap-4 justify-center">
            <FaFacebook className="footer-icon p-2 text-4xl" />
            <FaWhatsapp className="footer-icon p-2 text-4xl" />
            <FaInstagram className="footer-icon p-2 text-4xl" />
            <FaPhoneAlt className="footer-icon p-2 text-4xl" />
            <IoMail className="footer-icon p-2 text-4xl" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
