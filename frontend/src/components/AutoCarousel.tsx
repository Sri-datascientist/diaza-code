import { useEffect, useState } from "react";
import { LOCAL_DRIVE_IMAGES } from "@/lib/driveImages";
import { getCloudinaryUrl, getCloudinarySrcSet } from "@/lib/cloudinary";

interface AutoCarouselProps {
  speed?: number;
  className?: string;
  showTwoRows?: boolean;
}

export function AutoCarousel({ speed = 30, className = "", showTwoRows = false }: AutoCarouselProps) {
  const [duplicatedImages, setDuplicatedImages] = useState<any[]>([]);
  const [firstRowImages, setFirstRowImages] = useState<any[]>([]);
  const [secondRowImages, setSecondRowImages] = useState<any[]>([]);

  useEffect(() => {
    const images = LOCAL_DRIVE_IMAGES;
    if (images && images.length > 0) {
      if (showTwoRows) {
        // First row: top-to-bottom sequence (original order)
        const firstRow = [...images, ...images, ...images];
        setFirstRowImages(firstRow);
        
        // Second row: bottom-to-top sequence (reversed order)
        const reversedImages = [...images].reverse();
        const secondRow = [...reversedImages, ...reversedImages, ...reversedImages];
        setSecondRowImages(secondRow);
      } else {
        // Single row (original behavior)
        setDuplicatedImages([...images, ...images, ...images]);
      }
    }
  }, [showTwoRows]);

  // Pure Cloudinary static loading - render directly without S3 loading wait

  const activeImages = LOCAL_DRIVE_IMAGES;
  if (!activeImages || activeImages.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-[#8B7355]">No images found</p>
      </div>
    );
  }

  if (showTwoRows) {
    return (
      <div className={`relative overflow-hidden ${className}`} data-testid="dual-carousel-container">
        {/* First Row: Top to Bottom sequence, Right to Left movement */}
        <div className="mb-12" data-testid="first-row">
          <div 
            className="flex gap-6"
            style={{
              animation: `scroll-left ${speed}s linear infinite`,
              width: 'fit-content'
            }}
            data-testid="first-row-track"
          >
            {firstRowImages.map((image, index) => {
              const rawSrc = image.s3_url || '';
              const fallback = image.localPath || rawSrc;
              const imgSrc = getCloudinaryUrl(rawSrc, { width: 600 });
              const srcSet = getCloudinarySrcSet(rawSrc, [300, 450, 600]);
              return (
                <div 
                  key={`first-${image.id}-${index}`} 
                  className="flex-shrink-0 w-[300px] h-[200px] sm:w-[350px] sm:h-[230px] lg:w-[400px] lg:h-[260px] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  data-testid={`first-row-image-${index}`}
                >
                  <img
                    src={imgSrc}
                    srcSet={srcSet || undefined}
                    sizes="(max-width: 640px) 300px, (max-width: 1024px) 350px, 400px"
                    alt={image.name || `Portfolio image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (fallback && target.src !== fallback && !target.src.endsWith(fallback)) {
                        target.srcset = "";
                        target.src = fallback;
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Second Row: Bottom to Top sequence, Left to Right movement */}
        <div data-testid="second-row">
          <div 
            className="flex gap-6"
            style={{
              animation: `scroll-right ${speed}s linear infinite`,
              width: 'fit-content'
            }}
            data-testid="second-row-track"
          >
            {secondRowImages.map((image, index) => {
              const rawSrc = image.s3_url || '';
              const fallback = image.localPath || rawSrc;
              const imgSrc = getCloudinaryUrl(rawSrc, { width: 600 });
              const srcSet = getCloudinarySrcSet(rawSrc, [300, 450, 600]);
              return (
                <div 
                  key={`second-${image.id}-${index}`} 
                  className="flex-shrink-0 w-[300px] h-[200px] sm:w-[350px] sm:h-[230px] lg:w-[400px] lg:h-[260px] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  data-testid={`second-row-image-${index}`}
                >
                  <img
                    src={imgSrc}
                    srcSet={srcSet || undefined}
                    sizes="(max-width: 640px) 300px, (max-width: 1024px) 350px, 400px"
                    alt={image.name || `Portfolio image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (fallback && target.src !== fallback && !target.src.endsWith(fallback)) {
                        target.srcset = "";
                        target.src = fallback;
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.333%);
            }
          }
          @keyframes scroll-right {
            0% {
              transform: translateX(-33.333%);
            }
            100% {
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    );
  }

  // Single row (original behavior)
  return (
    <div className={`relative overflow-hidden ${className}`} data-testid="carousel-container">
      <div 
        className="flex gap-6"
        style={{
          animation: `scroll-left ${speed}s linear infinite`,
          width: 'fit-content'
        }}
        data-testid="carousel-track"
      >
        {duplicatedImages.map((image, index) => {
          const rawSrc = image.s3_url || '';
          const fallback = image.localPath || rawSrc;
          const imgSrc = getCloudinaryUrl(rawSrc, { width: 600 });
          const srcSet = getCloudinarySrcSet(rawSrc, [300, 450, 600]);
          return (
            <div 
              key={`${image.id}-${index}`} 
              className="flex-shrink-0 w-[300px] h-[200px] sm:w-[350px] sm:h-[230px] lg:w-[400px] lg:h-[260px] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              data-testid={`carousel-image-${index}`}
            >
              <img
                src={imgSrc}
                srcSet={srcSet || undefined}
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 350px, 400px"
                alt={image.name || `Portfolio image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (fallback && target.src !== fallback && !target.src.endsWith(fallback)) {
                    target.srcset = "";
                    target.src = fallback;
                  }
                }}
              />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </div>
  );
}

