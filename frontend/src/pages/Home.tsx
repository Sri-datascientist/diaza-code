import { useState, useEffect } from "react";
import { DecorativeDivider2, DecorativeDivider3 } from "@/components/Decorative";
import { AutoCarousel } from "@/components/AutoCarousel";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { SEO } from "@/components/SEO";
import heroImage1 from "@assets/stock_images/compact_guest_bedroom.png";
import heroImage2 from "@assets/stock_images/informal_living_room.png";
import heroImage3 from "@assets/stock_images/cinematic_bedroom.png";
import heroImage4 from "@assets/stock_images/luxury_compact_kitchen.png";
import heroImage5 from "@assets/stock_images/kids_play_area.png";

const heroImages = [heroImage1, heroImage2, heroImage3, heroImage4, heroImage5];

export default function Home() {
  const [activeCarouselDot, setActiveCarouselDot] = useState(0);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCarouselDot((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen">
      <SEO 
        title="Di-Aza Studio | Luxury Interior Design Studio in Bangalore"
        description="Di-Aza Studio is a premier interior design firm in Bangalore delivering bespoke luxury interiors for villas, apartments, and modern living spaces."
      />
      {/* Hero Section - 848px height */}
      <section 
        className="relative w-full overflow-hidden h-[500px] sm:h-[600px] lg:h-[848px]"
      >
        {/* Background Images Slideshow */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === activeCarouselDot ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={getCloudinaryUrl(image, { width: 1920 })}
                alt={`Luxury interior design ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
              />
              <div className="absolute inset-0 bg-[rgba(61,61,61,0.5)]" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          {/* Main Heading */}
          <h1 
            className="text-center mb-6 font-playfair text-4xl sm:text-6xl lg:text-[92px] leading-tight lg:leading-[100px] tracking-[-0.02em] text-white max-w-[926px] w-full animate-fade-in px-4"
            data-testid="text-hero-heading"
          >
            Di-Aza Studio
          </h1>

          {/* Subheading */}
          <p 
            className="text-center mb-12 font-inria text-lg sm:text-2xl lg:text-[27px] leading-relaxed lg:leading-[37px] text-white max-w-[800px] animate-fade-in px-4"
            style={{ animationDelay: '0.2s' }}
            data-testid="text-hero-subheading"
          >
            Changing Your Perspective
          </p>

          {/* Explore Button */}
          <a
            href="/project"
            className="bg-white/50 text-xl sm:text-2xl lg:text-[36px] font-medium text-black rounded-full px-8 sm:px-12 lg:w-[237px] h-16 lg:h-[95px] border-none cursor-pointer transition-all hover:opacity-90 hover:scale-105 font-inter-tight animate-fade-up flex items-center justify-center"
            style={{ animationDelay: '0.4s' }}
            data-testid="button-explore"
          >
            Explore
          </a>

          {/* Carousel Indicators */}
          <div className="absolute bottom-12 flex gap-3" data-testid="carousel-indicators">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveCarouselDot(index)}
                className={`w-4 h-4 rounded-full border-none cursor-pointer transition-all ${
                  index === activeCarouselDot ? 'bg-white' : 'bg-white/25'
                }`}
                data-testid={`carousel-dot-${index}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Dual Row Infinite Scroller with Mixed Projects */}
      <section 
        className="w-full py-10 sm:py-16 lg:py-20 flex flex-col justify-center bg-[#FFFAEF] min-h-[600px] gap-12"
      >
        <DecorativeDivider2 />

        <div className="w-full">
          <AutoCarousel 
            showTwoRows={true}
          />
        </div>

        <DecorativeDivider3 />
      </section>
    </main>
  );
}
