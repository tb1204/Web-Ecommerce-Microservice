import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  desktopImg: string;
  mobileImg: string;
  title?: string;
}


function Banner(){
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemSlide : Slide[] = [
    {
      id: 1,
      desktopImg: "https://bizweb.dktcdn.net/100/606/643/themes/1052255/assets/slider_3.jpg?1763084656509",
      mobileImg: "https://bizweb.dktcdn.net/100/606/643/themes/1052255/assets/slider_mb_3.jpg?1763084656509",
      title: "WOLF BED CUTIE"
    },
    {
      id: 2,
      desktopImg: "https://bizweb.dktcdn.net/100/606/643/themes/1052255/assets/slider_2.jpg", 
      mobileImg: "https://bizweb.dktcdn.net/100/606/643/themes/1052255/assets/slider_mb_2.jpg", 
      title: "SERENE BLOOMING"
    }
  ]

  // Tu dong chuyen anh
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === itemSlide.length - 1 ? 0 : prev + 1));
    }, 8000);

    return () => clearInterval(timer);
  }, [itemSlide.length]);

  return (
    <>
    <div className="relative w-full overflow-hidden group">
      {/* wrapper cho cac slide */}
      <div className="flex transition-transform duration-1000 ease-in-out"
            style={{transform: `translateX(-${currentSlide*100}%)`}}>
        
        {itemSlide.map((slide, index) => (
          <div key={slide.id} className="relative min-w-full">
            <picture>
              {/* Dieu chinh anh cho tung kich thuoc man hinh */}
              <source media="(max-width: 570px)" srcSet={slide.mobileImg}></source>
              <source media="(min-width: 571px)" srcSet={slide.desktopImg}></source>
              <img
                src={slide.desktopImg}
                alt={slide.title}
                width="2000"
                height="1000"
                className="w-full h-auto object-cover object-center min-h-[350px] md:min-h-[500px]" 
              ></img>
            </picture>
            {/* Nội dung text đè lên ảnh */}
            <div className="absolute inset-0 flex flex-col items-center justify-start text-center px-4 pt-20">
              {currentSlide === index && (
                <h2 className="text-green-500 text-3xl md:text-6xl font-serif tracking-[0.15em] mb-8 drop-shadow-md animate-fadeInUp">
                {slide.title}
                </h2>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Cac dau cham phia duoi khi chuyen slide  */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {itemSlide.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 transition-all duration-300 rounded-full ${
              currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>

      <button 
        onClick={() => setCurrentSlide(currentSlide === 0 ? itemSlide.length - 1 : currentSlide - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={32} strokeWidth={2} />
      </button>
      <button 
        onClick={() => setCurrentSlide(currentSlide === itemSlide.length - 1 ? 0 : currentSlide + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={32} strokeWidth={2} />
      </button>
    </div>
    </>
  )
}

export default Banner;