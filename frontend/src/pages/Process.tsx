import { useEffect, useState, useRef } from "react";
import { Layout, Settings, Zap, Palette, DollarSign, Clock } from "lucide-react";

// Import stock images
import heroImage from "@assets/stock_images/process_background_kitchen.png";
import creativeDesignBlueprintImg from "@assets/stock_images/creative_design_blueprint.jpg";
import technicalExcellenceImg from "@assets/stock_images/technical_excellence_new.jpg";
import switchSenseImg from "@assets/stock_images/switch_sense_electrical_planning.jpg";
import materialWisdomImg from "@assets/stock_images/mood_board_new.jpg";
import budgetBrillianceImg from "@assets/stock_images/budget_brilliance_step5.jpg";
import pulseControlImg from "@assets/stock_images/pulse_control_timeline_management.jpg";

export default function Process() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const progress = scrollY / (documentHeight - windowHeight);
      setScrollProgress(progress);

      sectionRefs.current.forEach((ref, idx) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const inView = rect.top < windowHeight * 0.6 && rect.bottom > windowHeight * 0.4;
          
          if (inView) {
            ref.classList.add('animate-in');
            setActiveStep(idx);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const processSteps = [
    {
      number: 1,
      title: "Captivating Design Blueprint",
      subtitle: "Space & Layout Planning",
      description: "The Captivating Design Blueprint focuses on optimizing space through smart zoning and layout planning, while ensuring seamless modular and storage solutions. It blends custom-built features with a cohesive colour palette and décor theme, creating spaces that are both functional and visually harmonious.",
      image: creativeDesignBlueprintImg,
      icon: Layout,
      color: "#D4A574",
    },
    {
      number: 2,
      title: "Technical Excellence Method",
      subtitle: "Precision & Functionality",
      description: "Technical Excellence Method ensures precision in design through detailed modular optimization and evaluation of every unit. It balances practicality, functionality, and aesthetics right from shutter designs to wall elements while keeping cost control at the forefront for efficient execution.",
      image: technicalExcellenceImg,
      icon: Settings,
      color: "#B08968",
    },
    {
      number: 3,
      title: "Switch Sense Method",
      subtitle: "Electrical Planning & Design",
      description: "Switch Sense Method focuses on smart electrical planning from the very start, including rewiring or recircuiting where needed. It ensures convenience and functionality in everyday use, while aligning switch placements and lighting with the overall design aesthetics.",
      image: switchSenseImg,
      icon: Zap,
      color: "#8B7355",
    },
    {
      number: 4,
      title: "Material Wisdom Process",
      subtitle: "Finishes & Durability",
      description: "Material Wisdom Process emphasizes finishes, textures, and touch that elevate the look and feel of a space. It ensures durability and low maintenance while balancing cost-effectiveness with a carefully curated palette of wallpapers, curtains, handles, and other design elements.",
      image: materialWisdomImg,
      icon: Palette,
      color: "#7D6E5C",
    },
    {
      number: 5,
      title: "Budget Brilliance Blueprint",
      subtitle: "Smart Financial Planning",
      description: "Budget Brilliance Blueprint streamlines design by reducing unnecessary layers and focusing on smart, flexible choices. It ensures optimal budget allocation with affordable alternatives, delivering stylish spaces without compromising on quality or functionality.",
      image: budgetBrillianceImg,
      icon: DollarSign,
      color: "#6B5A4A",
    },
    {
      number: 6,
      title: "Pulse Control Process",
      subtitle: "Timeline & Quality Management",
      description: "Pulse Control Process keeps projects on track with clear timelines, regular status checks, and phase-wise inspections. Using tools like Trello CRM for updates and thorough quality checks before handover, it ensures seamless execution and client satisfaction.",
      image: pulseControlImg,
      icon: Clock,
      color: "#5A4A3A",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFAEF] overflow-x-hidden">
      {/* Hero Section */}
      <section 
        className="relative w-full overflow-hidden h-[300px] sm:h-[350px] lg:h-[400px]"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Interior design process and planning" 
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0 bg-[rgba(61,61,61,0.5)]"
          />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <h1 
            className="text-center font-playfair text-4xl sm:text-5xl lg:text-[72px] leading-tight lg:leading-[80px] tracking-[0.1em] text-white font-normal animate-fade-in"
            data-testid="text-process-hero-title"
          >
            OUR PROCESS
          </h1>
        </div>
      </section>

      {/* Process Steps Section - Staircase Layout */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ perspective: '2000px' }}>
        {/* Diagonal Staircase Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block" style={{ zIndex: 1 }}>
          <defs>
            <linearGradient id="stairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#8B7355', stopOpacity: 0.1 }} />
              <stop offset="50%" style={{ stopColor: '#8B7355', stopOpacity: 0.4 }} />
              <stop offset="100%" style={{ stopColor: '#8B7355', stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          {processSteps.map((_, index) => {
            if (index === processSteps.length - 1) return null;
            const isLeft = index % 2 === 0;
            const yStart = 250 + (index * 550);
            const yEnd = yStart + 550;
            const xStart = isLeft ? '60%' : '40%';
            const xEnd = !isLeft ? '60%' : '40%';
            
            return (
              <line
                key={`line-${index}`}
                x1={xStart}
                y1={yStart}
                x2={xEnd}
                y2={yEnd}
                stroke="url(#stairGradient)"
                strokeWidth="3"
                strokeDasharray="10,5"
                opacity={activeStep && activeStep >= index ? "1" : "0.3"}
                style={{ transition: 'opacity 0.5s' }}
              />
            );
          })}
        </svg>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-0">
          {processSteps.map((step, index) => {
            const isLeft = index % 2 === 0;
            const Icon = step.icon;
            const stairOffset = index * 80;
            
            return (
              <div
                key={step.number}
                ref={(el) => (sectionRefs.current[index] = el)}
                className={`process-step opacity-0 translate-y-20 transition-all duration-1000 ease-out relative mb-32`}
                style={{
                  marginTop: `${stairOffset}px`,
                  zIndex: 10 + index,
                  transformStyle: 'preserve-3d'
                }}
                data-testid={`step-${step.number}`}
              >
                {/* Staircase Step Riser (Background Layer) */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-20 hidden lg:block"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}15 0%, ${step.color}05 100%)`,
                    transform: `translateZ(-${index * 20}px) scale(${1 - index * 0.02})`,
                    filter: `blur(${index * 2}px)`
                  }}
                />

                <div 
                  className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${!isLeft ? 'lg:flex-row-reverse' : ''}`}
                  style={{
                    transform: activeStep === index 
                      ? 'translateZ(40px) rotateY(0deg)' 
                      : isLeft 
                        ? 'translateZ(0px) rotateY(-2deg)' 
                        : 'translateZ(0px) rotateY(2deg)',
                    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  {/* Image Side */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative group">
                      {/* Corner Ribbon */}
                      <div className="absolute -top-4 -right-4 z-20">
                        <div 
                          className="relative w-24 h-24 transform rotate-12 group-hover:rotate-0 transition-transform duration-500"
                          style={{
                            background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`,
                            clipPath: 'polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)'
                          }}
                        >
                          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                            <span className="text-white font-playfair text-2xl font-bold">0{step.number}</span>
                            <span className="text-white/80 text-xs uppercase tracking-wider">Step</span>
                          </div>
                        </div>
                      </div>

                      {/* Parallax Wrapper for Image */}
                      <div 
                        className="relative"
                        style={{
                          transform: `translateY(${scrollProgress * -20 * (index + 1)}px)`,
                          transition: 'transform 0.3s ease-out'
                        }}
                      >
                        {/* Main Image Container with Layered Shadows */}
                        <div 
                          className="relative overflow-hidden rounded-3xl aspect-[4/3] transform transition-all duration-700 group-hover:-translate-y-2"
                          style={{
                            boxShadow: `
                              0 ${10 + index * 5}px ${30 + index * 10}px rgba(0,0,0,0.1),
                              0 ${20 + index * 10}px ${50 + index * 15}px rgba(139, 115, 85, 0.15),
                              0 ${30 + index * 15}px ${80 + index * 20}px rgba(139, 115, 85, 0.1),
                              inset 0 0 0 1px rgba(255,255,255,0.1)
                            `
                          }}
                        >
                          <img 
                            src={step.image}
                            alt={step.title}
                            className="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                          />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                        
                        {/* Animated Border Glow */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: `linear-gradient(45deg, transparent, ${step.color}40, transparent)`,
                            animation: 'borderGlow 3s ease-in-out infinite'
                          }}
                        />
                      </div>
                      </div>

                      {/* Decorative Corner SVG */}
                      <svg 
                        className={`absolute -bottom-4 ${isLeft ? '-right-4' : '-left-4'} w-32 h-32 opacity-30`}
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="50" cy="50" r="40" fill="none" stroke={step.color} strokeWidth="1" strokeDasharray="5,5">
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 50 50"
                            to="360 50 50"
                            dur="20s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle cx="50" cy="50" r="30" fill="none" stroke={step.color} strokeWidth="1" strokeDasharray="3,3">
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="360 50 50"
                            to="0 50 50"
                            dur="15s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </svg>
                    </div>
                  </div>

                  {/* Content Side - Parallax Wrapper */}
                  <div 
                    className={`w-full lg:w-1/2 ${isLeft ? 'lg:pl-12' : 'lg:pr-12'}`}
                    style={{
                      transform: `translateY(${scrollProgress * -15 * (index + 1)}px)`,
                      transition: 'transform 0.3s ease-out'
                    }}
                  >
                    <div className="space-y-6 relative">
                      {/* Floating Geometric Shape */}
                      <div 
                        className={`absolute -top-8 ${isLeft ? '-left-8' : '-right-8'} w-32 h-32 opacity-10 pointer-events-none hidden lg:block`}
                        style={{
                          transform: `rotate(${index * 30}deg) translateY(${scrollProgress * 30}px)`,
                          transition: 'transform 0.5s ease-out'
                        }}
                      >
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <polygon 
                          points="50,10 90,35 90,65 50,90 10,65 10,35" 
                          fill="none" 
                          stroke={step.color} 
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 50 50"
                            to="360 50 50"
                            dur="30s"
                            repeatCount="indefinite"
                          />
                        </polygon>
                        <circle cx="50" cy="50" r="20" fill={step.color} opacity="0.2" />
                      </svg>
                    </div>

                    {/* Icon and Title */}
                    <div className="space-y-4">
                      {/* Icon Circle */}
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
                        style={{ backgroundColor: `${step.color}20` }}
                      >
                        <Icon className="w-8 h-8" style={{ color: step.color }} />
                      </div>

                      {/* Step Subtitle */}
                      <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-gradient-to-r from-[#8B7355] to-transparent" />
                        <span className="text-sm uppercase tracking-widest font-medium" style={{ color: step.color }}>
                          Step {step.number}
                        </span>
                      </div>

                      {/* Main Title */}
                      <h2 
                        className="font-playfair text-5xl lg:text-6xl font-bold text-[#232323] leading-none"
                        data-testid={`step-title-${step.number}`}
                      >
                        {step.title}
                      </h2>

                      {/* Subtitle */}
                      <h3 className="text-2xl text-[#666] font-light italic">
                        {step.subtitle}
                      </h3>
                    </div>

                    {/* Description */}
                    <p 
                      className="text-lg text-[#666] leading-relaxed"
                      data-testid={`step-desc-${step.number}`}
                    >
                      {step.description}
                    </p>

                    {/* Feature Card with Enhanced 3D Effect */}
                    <div 
                      className="mt-8 p-8 rounded-2xl bg-white relative overflow-hidden group/card transform transition-all duration-500 hover:scale-105"
                      style={{
                        boxShadow: `
                          0 ${5 + index * 3}px ${15 + index * 5}px rgba(0,0,0,0.08),
                          0 ${10 + index * 5}px ${25 + index * 8}px rgba(139, 115, 85, 0.12),
                          inset 0 0 0 1px rgba(139, 115, 85, 0.1)
                        `,
                        border: `2px solid ${step.color}20`
                      }}
                    >
                      {/* Animated Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id={`pattern-${index}`} width="20" height="20" patternUnits="userSpaceOnUse">
                              <circle cx="10" cy="10" r="1" fill={step.color} />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#pattern-${index})`} />
                        </svg>
                      </div>

                      {/* Gradient Accent Bar */}
                      <div 
                        className="absolute top-0 left-0 w-1 h-full"
                        style={{
                          background: `linear-gradient(to bottom, ${step.color}, ${step.color}80)`
                        }}
                      />

                      <div className="relative flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover/card:rotate-12 transition-transform duration-500"
                          style={{ backgroundColor: step.color }}
                        >
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#232323] mb-2 text-lg">Excellence Guaranteed</h4>
                          <p className="text-[#666] leading-relaxed">
                            Every detail is meticulously planned and executed with the highest standards of quality and craftsmanship.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                {/* Staircase Step Connector Node (Desktop Only) */}
                <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                  <div className="relative">
                    {/* Outer Glow Ring */}
                    <div 
                      className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
                        activeStep === index ? 'scale-150 opacity-60' : 'scale-100 opacity-30'
                      }`}
                      style={{ backgroundColor: step.color }}
                    />
                    
                    {/* Step Platform - Hexagon Shape */}
                    <svg 
                      width="60" 
                      height="60" 
                      viewBox="0 0 60 60" 
                      className={`relative transition-all duration-500 ${
                        activeStep === index ? 'scale-125' : 'scale-100'
                      }`}
                    >
                      <defs>
                        <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: step.color, stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: step.color, stopOpacity: 0.6 }} />
                        </linearGradient>
                      </defs>
                      <polygon 
                        points="30,5 50,17.5 50,42.5 30,55 10,42.5 10,17.5" 
                        fill={`url(#grad-${index})`}
                        stroke="#FFFAEF"
                        strokeWidth="3"
                      />
                      <circle 
                        cx="30" 
                        cy="30" 
                        r="12" 
                        fill="#FFFAEF"
                      />
                      <text 
                        x="30" 
                        y="36" 
                        textAnchor="middle" 
                        className="font-playfair font-bold"
                        style={{ fontSize: '16px', fill: step.color }}
                      >
                        {step.number}
                      </text>
                    </svg>

                    {/* Active Pulse Animation */}
                    {activeStep === index && (
                      <>
                        <div 
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{ 
                            backgroundColor: step.color,
                            width: '60px',
                            height: '60px',
                            top: '0',
                            left: '0'
                          }}
                        />
                        <svg 
                          width="80" 
                          height="80" 
                          viewBox="0 0 80 80" 
                          className="absolute -top-2.5 -left-2.5"
                          style={{ animation: 'spinSlow 20s linear infinite' }}
                        >
                          <circle 
                            cx="40" 
                            cy="40" 
                            r="35" 
                            fill="none" 
                            stroke={step.color}
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            opacity="0.5"
                          />
                        </svg>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-b from-[#FFFAEF] to-[#F5F1ED]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagon" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <path d="M25 0 L50 14.43 L50 28.87 L25 43.3 L0 28.87 L0 14.43 Z" fill="none" stroke="#8B7355" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagon)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-12">
          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-6 mb-12">
            <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="35" fill="none" stroke="#8B7355" strokeWidth="1" strokeDasharray="2,4" opacity="0.5">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 40 40"
                  to="360 40 40"
                  dur="30s"
                  repeatCount="indefinite"
                />
              </circle>
              <path d="M 40 15 L 50 40 L 40 65 L 30 40 Z" fill="#8B7355" opacity="0.8" />
            </svg>
          </div>

          <h2 className="font-playfair text-5xl lg:text-7xl font-bold text-[#232323] leading-tight">
            Ready to Begin Your Journey?
          </h2>
          
          <p className="text-xl lg:text-2xl text-[#666] leading-relaxed max-w-3xl mx-auto font-light">
            Let's transform your space into something extraordinary. Our proven 6-step process 
            ensures every detail is perfect, every vision is realized, and every expectation is exceeded.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
            <div className="group p-8 rounded-2xl bg-white shadow-xl border border-[#E5DED5] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#D4A574] to-[#8B7355] flex items-center justify-center">
                <span className="text-3xl font-bold text-white">6</span>
              </div>
              <p className="text-[#666] font-medium">Proven Steps</p>
            </div>

            <div className="group p-8 rounded-2xl bg-white shadow-xl border border-[#E5DED5] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#B08968] to-[#8B7355] flex items-center justify-center">
                <span className="text-2xl font-bold text-white">100%</span>
              </div>
              <p className="text-[#666] font-medium">Quality Guaranteed</p>
            </div>

            <div className="group p-8 rounded-2xl bg-white shadow-xl border border-[#E5DED5] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#8B7355] to-[#6B5A4A] flex items-center justify-center">
                <span className="text-3xl font-bold text-white">∞</span>
              </div>
              <p className="text-[#666] font-medium">Creative Possibilities</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <a
              href="/contact"
              className="group relative inline-block px-12 py-5 bg-gradient-to-r from-[#8B7355] to-[#6B5A4A] text-white text-lg font-medium rounded-full shadow-2xl hover:shadow-[#8B7355]/50 transition-all duration-500 hover:scale-105 overflow-hidden"
              data-testid="button-start-journey"
            >
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6B5A4A] to-[#8B7355] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
          opacity: 0;
        }

        .process-step.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) translateX(-50%);
          }
          50% {
            transform: translateY(-15px) translateX(-50%);
          }
        }

        .animate-bounce {
          animation: bounce 3s ease-in-out infinite;
        }

        @keyframes borderGlow {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes floatUp {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        /* 3D Perspective Enhancement */
        .process-step {
          transform-style: preserve-3d;
          will-change: transform, opacity;
        }

        .process-step.animate-in {
          animation: fadeInStair 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes fadeInStair {
          from {
            opacity: 0;
            transform: translateY(50px) translateZ(-100px) rotateX(10deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateZ(0) rotateX(0deg);
          }
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
