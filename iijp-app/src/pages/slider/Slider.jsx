import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import "../../styles/slider.css";
import { usePostContext } from "../../context/postContext";
const Slider = () => {
  const endpoint = process.env.REACT_APP_IMAGE_SERVER;
  const [currentSlide, setCurrentSlide] = useState(0);
  const { posts } = usePostContext();
  const slideLength = posts.length;

  const autoScroll = false;
  let slideInterval;
  let intervalTime = 9000;

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
    console.log("next");
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
    console.log("prev");
  };

  function auto() {
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  useEffect(() => {
    if (autoScroll) {
      auto();
    }
    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  return (
    <div className="slider relative bg-white dark:bg-gray-900 text-black dark:text-white m-4 rounded-lg shadow-lg">
      <button
        type="button"
        className="arrow prev absolute left-0 top-1/2 m-2 p-2 sm:p-4 sm:m-4 opacity-50 hover:opacity-100 bg-gray-300 dark:bg-gray-600 rounded-full text-black dark:text-white"
        onClick={prevSlide}
      >
        <IoIosArrowBack className="w-5 h-5" />
      </button>
      <button
        type="button"
        className="arrow next absolute top-1/2 right-0 m-2 p-2 sm:p-4 sm:m-4 opacity-50 hover:opacity-100 bg-gray-300 rounded-full dark:bg-gray-600 text-black dark:text-white"
        onClick={nextSlide}
      >
        <IoIosArrowForward className="w-5 h-5" />
      </button>

      {posts.map((slide, index) => {
        return (
          <div
            className={index === currentSlide ? "slide current" : "slide"}
            key={index}
          >
            {index === currentSlide && (
              <div
                id="grid-content"
                className="sm:m-4 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div id="image-card" className="custom:p-1">
                  <figure className="image-container w-full h-auto sm:h-[500px] overflow-hidden rounded-lg">
                    <img
                      src={`${endpoint}/${slide.ruta_imagen}`}
                      alt="slide"
                      className="image rounded-lg"
                    />
                  </figure>
                </div>
                <div className="flex m-4 flex-col flex-wrap gap-4 custom:p-0">
                  <div className="titulo-card text-xl mt-4 font-bold text-black dark:text-white">
                    <h2>{slide.titulo}</h2>
                  </div>
                  <div className="pt-4 desc-card dark:text-gray-200 text-justify text-xs sm:text-lg text-gray-500">
                    <p>{slide.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Slider;
