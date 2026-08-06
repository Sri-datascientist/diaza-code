import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { S3Image } from "@shared/schema";

interface ImageSliderProps {
  folderPath?: string;
  className?: string;
  autoPlayInterval?: number;
}

export function ImageSlider({ 
  folderPath, 
  className = "", 
  autoPlayInterval = 5000 
}: ImageSliderProps) {
  const { data, isLoading } = useQuery<{ images: S3Image[] }>({
    queryKey: ['/api/public/s3/images', folderPath],
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const images = data?.images || [];

  useEffect(() => {
    if (!isPaused && images.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoPlayInterval);

      return () => clearInterval(timer);
    }
  }, [isPaused, images.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (isLoading) {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-[#D4C4B0] rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-[#8B7355]">No images found in S3 bucket</p>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full max-w-6xl mx-auto ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-testid="image-slider-container"
    >
      {/* Main Image Container */}
      <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-2xl">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            data-testid={`slider-image-${index}`}
          >
            <img
              src={image.s3_url || ''}
              alt={image.name || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg z-10"
          aria-label="Previous image"
          data-testid="button-slider-prev"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg z-10"
          aria-label="Next image"
          data-testid="button-slider-next"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6" data-testid="slider-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-[#8B7355] w-8' 
                : 'bg-[#D4C4B0] hover:bg-[#B8A490]'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`slider-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
