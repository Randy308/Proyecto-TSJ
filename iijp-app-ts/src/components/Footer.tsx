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
          <img
            src={iijp}
            alt="Logo del IIJP"
            id="imagen-footer"
            className="rounded-md"
          />
        </div>
        <div className="footer-title flex  flex-col items-start justify-center gap-4">
          <div className="titulo">Dirección: Av. Oquendo esq. Sucre Campus Universitario.     </div>
          <p className="titulo">
            © 2025 IIJP - Instituto de Investigaciones Juridicas y Politicas
          </p>
        </div>
        <div className="flex flex-col justify-center flex-wrap gap-4 items-start">
          <div className="titulo">Redes Sociales</div>
          <div
            id="footer-icons"
            className="flex flex-row flex-wrap gap-4 justify-center"
          >
            <a
              onClick={() =>
                window.open(
                  "https://www.facebook.com/people/Instituto-de-Investigaciones-Jur%C3%ADdicas-y-Pol%C3%ADticas-FCJyP/100075651683119/",
                  "_blank"
                )
              }
            >
              <FaFacebook className="footer-icon p-2 text-4xl" />
            </a>

            <a onClick={() =>
                window.open(
                  "http://twitter.com/share?text=INSTITUTO%20DE%20INVESTIGACIONES%20JUR%C3%8DDICAS%20Y%20POL%C3%8DTICAS%20%28IIJP%29&url=https%3A%2F%2Fwww.umss.edu.bo%2Finstituto-de-investigaciones-juridicas-y-politicas-iijp%2F",
                  "_blank"
                )
              }>
              <FaWhatsapp className="footer-icon p-2 text-4xl" />
            </a>

            <a
              onClick={() =>
                window.open(
                  "https://mail.google.com/mail/u/0/?view=cm&fs=1&su=INSTITUTO%20DE%20INVESTIGACIONES%20JUR%C3%8DDICAS%20Y%20POL%C3%8DTICAS%20%28IIJP%29&body=https%3A%2F%2Fwww.umss.edu.bo%2Finstituto-de-investigaciones-juridicas-y-politicas-iijp%2F&ui=2&tf=1",
                  "_blank"
                )
              }
            >
              <IoMail className="footer-icon p-2 text-4xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
