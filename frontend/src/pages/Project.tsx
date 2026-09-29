import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import luxuryLivingRoom from "@assets/stock_images/modern_luxury_interi_d54f89a0.jpg";
import { DecorativeDivider1, DecorativeDivider2, DecorativeDivider3 } from "@/components/Decorative";
import type { S3ImageResponse } from "@shared/schema";
import { LOCAL_DRIVE_IMAGES } from "@/lib/driveImages";

export default function Project() {
  const [scrollY, setScrollY] = useState(0);

  const { data, isLoading } = useQuery<S3ImageResponse>({
    queryKey: ['/api/public/s3/images', 'beula/'],
  });

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const imagesToDisplay = (data?.images && data.images.length > 0) ? data.images : LOCAL_DRIVE_IMAGES;
  const imageCount = imagesToDisplay.length;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section 
        className="relative w-full overflow-hidden h-[400px] sm:h-[450px] lg:h-[500px]"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={luxuryLivingRoom} 
            alt="Interior design background" 
            className="w-full h-full object-cover"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-b from-[rgba(61,61,61,0.7)] via-[rgba(61,61,61,0.5)] to-[rgba(61,61,61,0.7)]"
          />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 gap-6">
          <h1 
            className="text-center font-playfair text-4xl sm:text-5xl lg:text-[80px] leading-tight lg:leading-[90px] tracking-[0.12em] text-white font-normal animate-fade-in"
            data-testid="text-project-hero-title"
          >
            OUR PROJECTS
          </h1>
          <div className="animate-fade-up" style={{ animationDelay: '0.3s', opacity: 0, animation: 'fade-up 1s 0.3s ease forwards' }}>
            <DecorativeDivider2 />
          </div>
          <p 
            className="text-white/90 font-inria text-lg sm:text-xl text-center max-w-2xl animate-fade-up"
            style={{ animationDelay: '0.5s', opacity: 0, animation: 'fade-up 1s 0.5s ease forwards' }}
            data-testid="text-project-subtitle"
          >
            Explore our curated collection of stunning interior designs
          </p>
        </div>
      </section>

      {/* Decorative Header Section */}
      <section className="bg-[#FFFAEF] py-16 sm:py-20 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #8B7355 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="text-center space-y-6 animate-fade-up">
            <div className="inline-block">
              <h2 className="text-[#8B7355] font-playfair text-3xl sm:text-4xl lg:text-5xl tracking-wide mb-2">
                Portfolio Gallery
              </h2>
              <div className="h-1 bg-gradient-to-r from-transparent via-[#8B7355] to-transparent" />
            </div>
            <p className="text-[#8B7355]/80 font-inria text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Each project represents our commitment to excellence, attention to detail, and passion for creating spaces that inspire.
            </p>
            {imageCount > 0 && (
              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-4xl font-playfair text-[#8B7355] font-semibold">{imageCount}</div>
                  <div className="text-sm text-[#8B7355]/70 font-inria mt-1">Projects</div>
                </div>
                <div className="h-12 w-px bg-[#8B7355]/30" />
                <div className="text-center">
                  <div className="text-4xl font-playfair text-[#8B7355] font-semibold">100%</div>
                  <div className="text-sm text-[#8B7355]/70 font-inria mt-1">Satisfaction</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16">
          <DecorativeDivider3 />
        </div>
      </section>

      {/* Portfolio Gallery Section */}
      <section className="bg-gradient-to-b from-[#FFFAEF] to-[#FFF8E7] py-16 sm:py-20 lg:py-24 relative">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B7355' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-full h-[350px] bg-[#D4C4B0]/30 rounded-xl" />
              ))}
            </div>
          ) : imagesToDisplay.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-white rounded-2xl shadow-lg">
                <p 
                  className="text-2xl text-[#8B7355] font-playfair mb-2"
                  data-testid="text-project-no-images"
                >
                  No Projects Yet
                </p>
                <p className="text-[#8B7355]/70 font-inria">
                  Please add images to your folder or S3 bucket.
                </p>
              </div>
            </div>
          ) : (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
              data-testid="project-gallery"
            >
              {imagesToDisplay.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-700 animate-fade-up bg-white"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    opacity: 0,
                    animation: `fade-up 0.8s ${index * 0.05}s ease forwards`
                  }}
                  data-testid={`project-image-${index}`}
                >
                  {/* Image Container */}
                  <div className="aspect-[4/3] overflow-hidden bg-[#D4C4B0]/20">
                    <img
                      src={image.s3_url || ''}
                      alt={image.name || `Project ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700 ease-out"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Decorative Elements */}
        <div className="mt-20 space-y-8">
          <DecorativeDivider1 />
          <div className="text-center animate-fade-up">
            <p className="text-[#8B7355]/60 font-inria text-sm sm:text-base italic">
              "Design is not just what it looks like and feels like. Design is how it works."
            </p>
          </div>
          <DecorativeDivider1 />
        </div>
      </section>
    </div>
  );
}
