import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import diAzaLogo from "@assets/logo_1759773165481.png";

export function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allLinks = [
    { href: "/", label: "Home" },
    { href: "/project", label: "Project" },
    { href: "/about", label: "About" },
    { href: "/process", label: "Process" },
    { href: "/contact", label: "Contact" },
    { href: "/reviews", label: "Reviews" },
  ];

  const leftLinks = allLinks.slice(0, 3);
  const rightLinks = allLinks.slice(3);

  const isActive = (href: string) => {
    return location === href;
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Desktop/Mobile Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 w-full flex justify-center pt-4 sm:pt-6 md:pt-8 z-50">
        <nav className="relative w-full max-w-[900px] px-2 sm:px-4">
          <div 
            className="flex items-center justify-between md:justify-between h-[60px] sm:h-[65px] md:h-[70px] rounded-[100px] px-3 sm:px-6 md:px-8 bg-[rgba(61,61,61,0.8)] backdrop-blur-sm shadow-lg"
            data-testid="navigation-bar"
          >
            {/* Mobile Menu Button (Left) - Hidden on md+ screens */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 hover:text-white/80 transition-colors"
              data-testid="button-mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Left Navigation Links - Hidden on mobile/tablet */}
            <div className="hidden md:flex items-center gap-1.5 xs:gap-2 sm:gap-4 md:gap-8">
              {leftLinks.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-${link.label.toLowerCase()}`}>
                  <span
                    className={`font-inria font-medium text-xs xs:text-sm sm:text-base cursor-pointer transition-all hover:text-white whitespace-nowrap ${
                      isActive(link.href) ? 'text-white' : 'text-white/80'
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Center Logo - Always visible */}
            <Link href="/" data-testid="link-logo">
              <div className="flex items-center justify-center cursor-pointer transition-transform hover:scale-105 duration-300 bg-white rounded-full p-1 sm:p-1.5 md:p-1.5 mx-1 sm:mx-2">
                <img 
                  src={diAzaLogo} 
                  alt="Di-Aza Studio Logo" 
                  className="h-[78px] xs:h-[82px] sm:h-[84px] md:h-[88px] w-auto object-contain"
                />
              </div>
            </Link>

            {/* Right Navigation Links - Hidden on mobile/tablet */}
            <div className="hidden md:flex items-center gap-1.5 xs:gap-2 sm:gap-4 md:gap-8">
              {rightLinks.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-${link.label.toLowerCase()}`}>
                  <span
                    className={`font-inria font-medium text-xs xs:text-sm sm:text-base cursor-pointer transition-all hover:text-white whitespace-nowrap ${
                      isActive(link.href) ? 'text-white' : 'text-white/80'
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Invisible placeholder for symmetry on mobile */}
            <div className="md:hidden w-10" />
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          data-testid="mobile-menu-overlay"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-[#2D2D2D] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        data-testid="mobile-menu-drawer"
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="bg-white rounded-full p-2">
              <img 
                src={diAzaLogo} 
                alt="Di-Aza Studio" 
                className="h-[50px] w-auto object-contain"
              />
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white p-2 hover:text-white/80 transition-colors"
              data-testid="button-close-mobile-menu"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="flex-1 px-6 py-8">
            <ul className="space-y-6">
              {allLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={handleLinkClick}>
                    <span
                      className={`font-inria text-lg block py-2 transition-colors ${
                        isActive(link.href) 
                          ? 'text-[#CDA156] font-semibold' 
                          : 'text-white hover:text-[#CDA156]'
                      }`}
                      data-testid={`mobile-link-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Menu Footer */}
          <div className="p-6 border-t border-white/10">
            <p className="text-white/60 text-sm font-inria">
              Di-Aza Studio © 2025
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
