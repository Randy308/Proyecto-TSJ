import "../styles/footer.css";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="text-white bg-white border-t-2 mt-8">
      {/* Sección de logos */}
      <div className="bg-white flex flex-wrap justify-center items-center gap-6 p-6 border-b border-gray-700">
        {[
          { src: "./umss.webp", alt: "Logo UMSS", w: "w-32" },
          { src: "./tsj.webp", alt: "Logo TSJ", w: "h-16" },
          { src: "./fcjyp.webp", alt: "Logo FCJyP", w: "w-32" },
          { src: "./fcyt.webp", alt: "Logo FCyT", w: "w-20" },
          { src: "./iijp.webp", alt: "Logo IIJP", w: "w-32" },
        ].map((logo, i) => (
          <img
            key={i}
            src={logo.src}
            alt={logo.alt}
            className={`bg-white rounded-md ${logo.w}  object-contain`}
          />
        ))}
      </div>

      {/* Sección de información y redes */}
      <div className="grid footer md:grid-cols-2 gap-8 p-6 text-sm">
        {/* Información institucional */}
        <div className="flex flex-col items-start gap-3">
          <p className="text-lg font-semibold">Instituto de Investigaciones Jurídicas y Políticas</p>
          <p>Dirección: Av. Oquendo esq. Sucre, Campus Universitario.</p>
          <p className="text-gray-400">© 2025 IIJP - Todos los derechos reservados</p>
        </div>

        {/* Redes sociales */}
        <div className="flex flex-col items-end gap-3">
          <p className="text-lg font-semibold">Síguenos</p>
          <div className="flex gap-4">
            <button
              aria-label="Facebook"
              onClick={() =>
                window.open(
                  "https://www.facebook.com/people/Instituto-de-Investigaciones-Jur%C3%ADdicas-y-Pol%C3%ADticas-FCJyP/100075651683119/",
                  "_blank"
                )
              }
              className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition"
            >
              <FaFacebook className="text-2xl" />
            </button>

            <button
              aria-label="WhatsApp"
              onClick={() =>
                window.open(
                  "http://twitter.com/share?text=INSTITUTO%20DE%20INVESTIGACIONES%20JUR%C3%8DDICAS%20Y%20POL%C3%8DTICAS%20%28IIJP%29&url=https%3A%2F%2Fwww.umss.edu.bo%2Finstituto-de-investigaciones-juridicas-y-politicas-iijp%2F",
                  "_blank"
                )
              }
              className="p-2 rounded-full bg-gray-800 hover:bg-green-500 transition"
            >
              <FaWhatsapp className="text-2xl" />
            </button>

            <button
              aria-label="Correo electrónico"
              onClick={() =>
                window.open(
                  "https://mail.google.com/mail/u/0/?view=cm&fs=1&su=INSTITUTO%20DE%20INVESTIGACIONES%20JUR%C3%8DDICAS%20Y%20POL%C3%8DTICAS%20%28IIJP%29&body=https%3A%2F%2Fwww.umss.edu.bo%2Finstituto-de-investigaciones-juridicas-y-politicas-iijp%2F&ui=2&tf=1",
                  "_blank"
                )
              }
              className="p-2 rounded-full bg-gray-800 hover:bg-red-500 transition"
            >
              <IoMail className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
