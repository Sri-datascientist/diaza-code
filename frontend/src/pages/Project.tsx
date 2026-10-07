import { useState } from "react";
import luxuryLivingRoom from "@assets/stock_images/modern_luxury_interi_d54f89a0.jpg";
import { DecorativeDivider1, DecorativeDivider2, DecorativeDivider3 } from "@/components/Decorative";
import { LOCAL_DRIVE_IMAGES } from "@/lib/driveImages";
import { getCloudinaryUrl, getCloudinarySrcSet } from "@/lib/cloudinary";
import { SEO } from "@/components/SEO";

const PROJECT_CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "Parvathy Site Project", label: "Parvathy Site" },
  { id: "Samyukta Project", label: "Samyukta" },
  { id: "Tusar Diaza Project", label: "Tusar Diaza" },
  { id: "Reju Diaza Project", label: "Reju Diaza" },
  { id: "Vasundhara Diaza Project", label: "Vasundhara Diaza" },
  { id: "Sagamitra Diaza Project", label: "Sagamitra Diaza" }
];

export default function Project() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const imagesToDisplay = selectedCategory === "all" 
    ? LOCAL_DRIVE_IMAGES 
    : LOCAL_DRIVE_IMAGES.filter(img => img.project === selectedCategory);

  const imageCount = imagesToDisplay.length;

  return (
    <div className="min-h-screen">
      <SEO 
        title="Interior Design Portfolio & Projects | Di-Aza Studio Bangalore"
        description="Browse Di-Aza Studio's comprehensive portfolio of 230+ completed luxury interior design projects in Bangalore across apartments and villas."
      />
      {/* Hero Section with Parallax */}
      <section 
        className="relative w-full overflow-hidden h-[400px] sm:h-[450px] lg:h-[500px]"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={getCloudinaryUrl(luxuryLivingRoom, { width: 1920 })} 
            alt="Interior design background" 
            className="w-full h-full object-cover"
            loading="eager"
            {...{ fetchpriority: "high" }}
            onError={(e) => {
              e.currentTarget.src = luxuryLivingRoom;
            }}
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
                  <div className="text-sm text-[#8B7355]/70 font-inria mt-1">Photos</div>
                </div>
                <div className="h-12 w-px bg-[#8B7355]/30" />
                <div className="text-center">
                  <div className="text-4xl font-playfair text-[#8B7355] font-semibold">100%</div>
                  <div className="text-sm text-[#8B7355]/70 font-inria mt-1">Satisfaction</div>
                </div>
              </div>
            )}

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6 max-w-4xl mx-auto">
              {PROJECT_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = cat.id === "all" 
                  ? LOCAL_DRIVE_IMAGES.length 
                  : LOCAL_DRIVE_IMAGES.filter(img => img.project === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-inria font-medium transition-all duration-300 border ${
                      isSelected
                        ? "bg-[#8B7355] text-white border-[#8B7355] shadow-lg shadow-[#8B7355]/30 ring-2 ring-[#8B7355]/20 scale-105"
                        : "bg-white text-[#8B7355] border-[#8B7355]/40 shadow-sm hover:shadow-md hover:border-[#8B7355] hover:bg-[#8B7355]/5 hover:scale-[1.02]"
                    }`}
                  >
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>
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
          {imagesToDisplay.length === 0 ? (
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
              {imagesToDisplay.map((image, index) => {
                const rawSrc = image.s3_url || '';
                const imgSrc = getCloudinaryUrl(rawSrc, { width: 800 });
                const srcSet = getCloudinarySrcSet(rawSrc, [400, 800, 1200]);

                return (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-white"
                    data-testid={`project-image-${index}`}
                  >
                    {/* Image Container */}
                    <div className="aspect-[4/3] overflow-hidden bg-[#D4C4B0]/20">
                      <img
                        src={imgSrc}
                        srcSet={srcSet || undefined}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        alt={image.name || `Project ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading={index < 6 ? "eager" : "lazy"}
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const fallback = (image as any).localPath || rawSrc;
                          if (fallback && target.src !== fallback && !target.src.endsWith(fallback)) {
                            target.srcset = "";
                            target.src = fallback;
                          }
                        }}
                      />
                    </div>
                  </div>
                );
              })}
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

