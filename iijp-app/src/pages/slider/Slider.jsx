import { useState, useEffect } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { sliderData } from "../../data/SliderData";

import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import "../../Styles/Styles_randy/slider.css";
const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideLength = sliderData.length;

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
    <div className="slider">
    <div className="arrow-container"></div>
      <IoIosArrowBack className="arrow prev" onClick={prevSlide} />
      <IoIosArrowForward className="arrow next" onClick={nextSlide} />
      {sliderData.map((slide, index) => {
        return (
          <div
            className={index === currentSlide ? "slide current" : "slide"}
            key={index}
          >
            {index === currentSlide && (
              <div id="grid-content" className="custom:p-0">
                <div id="image-card" className="custom:p-1">
                  <figure>
                    <img
                      src={slide.image}
                      alt="slide"
                      className="image rounded-lg"
                    />
                  </figure>
                </div>
                <div className="content custom:p-0">
                  <div className="titulo-card">
                    <h2>{slide.heading}</h2>
                  </div>
                  <div className="desc-card">
                    <p>{slide.desc}</p>
                    <button className="bg-blue-500 my-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Ver mas
                    </button>
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
