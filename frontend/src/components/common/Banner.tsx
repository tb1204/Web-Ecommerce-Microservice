import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import slider1 from "../../assets/banner/slider_1.webp";
import slider2 from "../../assets/banner/slider_2.webp";
import slider3 from "../../assets/banner/slider_3.webp";
import slider4 from "../../assets/banner/slider_4.webp";

interface Slide {
  id: number;
  desktopImg: string;
  title?: string;
}

function Banner() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const slides: Slide[] = [
    {
      id: 1,
      desktopImg: slider1,
      title: "WOLF BED CUTIE",
    },
    {
      id: 2,
      desktopImg: slider2,
      title: "SERENE BLOOMING",
    },
    {
      id: 3,
      desktopImg: slider3,
      title: "SERENE BLOOMING",
    },
    {
      id: 4,
      desktopImg: slider4,
      title: "SERENE BLOOMING",
    },
  ];

  const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

  const totalExtended = extendedSlides.length;

  // Xử lý infinite loop
  useEffect(() => {
    if (currentSlide === totalExtended - 1) {
      setIsTransitioning(false);
      setCurrentSlide(1);
      setTimeout(() => setIsTransitioning(true), 50);
    } else if (currentSlide === 0) {
      setIsTransitioning(false);
      setCurrentSlide(slides.length);
      setTimeout(() => setIsTransitioning(true), 50);
    }
  }, [currentSlide]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused, currentSlide]);
  // Khi người dùng tương tác → tạm dừng rồi resume sau 1 giây
  const handleUserInteraction = () => {
    setIsPaused(true);

    setTimeout(() => {
      setIsPaused(false);
    }, 1000);
  };

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentSlide(index);
    handleUserInteraction();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev - 1);
    handleUserInteraction();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
    handleUserInteraction();
  };

  return (
    <div
      className="relative w-full overflow-hidden group"
      // Optional: pause khi hover (bạn có thể giữ hoặc bỏ)
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides wrapper */}
      <div
        className={`flex ${isTransitioning ? "transition-transform duration-1000 ease-in-out" : "transition-none"}`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {extendedSlides.map((slide, index) => (
          <div key={`${slide.id}-${index}`} className="relative min-w-full">
            <picture>
              <source media="(min-width: 571px)" srcSet={slide.desktopImg} />
              <img
                src={slide.desktopImg}
                alt={slide.title || "Banner slide"}
                width="2000"
                height="1000"
                className="w-full h-auto object-cover object-center min-h-[350px] md:min-h-[500px]"
                loading="lazy"
              />
            </picture>

            {/* Title overlay */}
            {index >= 1 && index <= slides.length && currentSlide === index && (
              <div className="absolute inset-0 flex flex-col items-center justify-start text-center px-4 pt-20 md:pt-32">
                <h2
                  // key={`title-${currentSlide}`}
                  key={currentSlide}
                  className="
                    text-[#4ea675]
                    text-3xl sm:text-4xl md:text-6xl
                    font-serif
                    tracking-[0.15em]
                    mb-8 md:mb-12
                    drop-shadow-lg
                    animate-fadeInUp
                  "
                >
                  {slide.title}
                </h2>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, realIndex) => {
          const displayIndex = realIndex + 1;
          return (
            <button
              key={realIndex}
              onClick={() => goToSlide(displayIndex)}
              className={`h-2.5 w-2.5 md:h-3 md:w-3 transition-all duration-300 rounded-full ${
                currentSlide === displayIndex
                  ? "w-10 md:w-12 bg-white"
                  : "bg-white/50"
              }`}
            />
          );
        })}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-80 hover:bg-black/40 transition-all duration-300"
      >
        <ChevronLeft size={32} strokeWidth={2.5} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-80 hover:bg-black/40 transition-all duration-300"
      >
        <ChevronRight size={32} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default Banner;
