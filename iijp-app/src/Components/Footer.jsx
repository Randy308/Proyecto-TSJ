import React from "react";
import "../Styles/footer.css";
import { FaFacebook } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
const Footer = () => {
  return (
    <footer>
      <div className="footer flex flex-col">
        <div id="footer-icons" className="flex flex-row justify-center p-4">
          <FaFacebook className="footer-icon" />
          <FaWhatsapp className="footer-icon" />
          <FaInstagram className="footer-icon" />
          <FaPhoneAlt className="footer-icon" />
          <IoMail className="footer-icon" />
        </div>
        <div>
          <p>
            © 2024 IIJP - Instituto de Investigaciones Juridicas y Politicas
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
