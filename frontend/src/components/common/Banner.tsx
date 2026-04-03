// const fixedTitles = [
//   "SERENE BLOOM",
//   "MORNING VIBES",
//   "DREAMY HOME",
//   "NATURAL REST",
//   "BETTER SLEEP, BETTER LIFE",
//   "NATURALLY BETTER SLEEP",
// ];
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string;
  image: string;
  title: string;
}

function Banner() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  // ================== LOAD SLIDES ==================
  useEffect(() => {
    const loadSlides = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:8081/api/admin/sliders/list?folder=slider&max=50",
          {
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const resources = data.resources || [];
        console.log(resources);

        const loaded: Slide[] = resources.map((r: any) => ({
          id: r.public_id,
          image: r.secure_url,
          title:
            r.context?.title || 
            r.context?.custom?.title || 
            r.metadata?.title ||
            "",
        }));

        setSlides(loaded);
      } catch (err) {
        console.error("Load slider error:", err);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    loadSlides();
  }, []);

  // ================== LOOP SLIDE FIX ==================
  useEffect(() => {
    if (slides.length === 0) return;

    const total = slides.length + 2;

    if (currentSlide === total - 1) {
      setIsTransitioning(false);
      setCurrentSlide(1);
      setTimeout(() => setIsTransitioning(true), 50);
    }

    if (currentSlide === 0) {
      setIsTransitioning(false);
      setCurrentSlide(slides.length);
      setTimeout(() => setIsTransitioning(true), 50);
    }
  }, [currentSlide, slides.length]);

  // ================== AUTO PLAY ==================
  useEffect(() => {
    if (slides.length === 0 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 3500);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const handleUserInteraction = () => {
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 4000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev - 1);
    handleUserInteraction();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
    handleUserInteraction();
  };

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentSlide(index);
    handleUserInteraction();
  };

  // ================== RENDER ==================

  if (loading) {
    return (
      <div className="w-full h-[400px] bg-gray-50 flex items-center justify-center relative">
        <div className="w-[200px] h-[200px] overflow-hidden relative">
          <div className="w-full h-full relative">
            <div
              className="
              absolute top-[20px] left-[20px] 
              w-[160px] h-[160px] rounded-full 
              animate-eclipseRotate 
              origin-[80px_82px] 
              shadow-[0_4px_0_0_var(--tw-shadow-color)] 
              shadow-ft
            "
            ></div>
          </div>
        </div>

        <p className="absolute bottom-16 text-ft font-medium animate-pulse text-lg">
          Đang tải banner...
        </p>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
        Chưa có ảnh banner
      </div>
    );
  }

  const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

  return (
    <div
      className="relative w-full overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`flex ${
          isTransitioning
            ? "transition-transform duration-1000 ease-in-out"
            : "transition-none"
        }`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {extendedSlides.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className="relative min-w-full h-[350px] md:h-[600px]"
          >
            <img
              src={slide.image}
              alt={slide.title || "Banner"}
              className="w-full h-full object-cover"
              loading={index < 3 ? "eager" : "lazy"}
            />

            {/* TITLE */}
            {index >= 1 &&
              index <= slides.length &&
              currentSlide === index &&
              slide.title && (
                <div className="absolute inset-0 flex items-start justify-center pt-24 md:pt-32">
                  <h2
                    key={currentSlide}
                    className="
                      text-[#4ea675]
                      text-3xl sm:text-4xl md:text-6xl
                      font-serif
                      tracking-[0.15em]
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

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, i) => {
          const idx = i + 1;
          return (
            <button
              key={i}
              onClick={() => goToSlide(idx)}
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === idx ? "w-10 bg-white" : "w-2.5 bg-white/50"
              }`}
            />
          );
        })}
      </div>

      {/* ARROWS */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-80"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-80"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
}

export default Banner;
