import { useState } from "react";
import { Facebook, Instagram, Linkedin, Twitter, ArrowRight } from "lucide-react";
import diAzaLogo from "@assets/logo_1759773165481.png";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#2D2D2D] text-white">
      <div className="max-w-[1200px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="col-span-1">
            <div className="mb-6">
              <div className="bg-white rounded-full p-3 w-fit">
                <img 
                  src={diAzaLogo} 
                  alt="Di-Aza Studio" 
                  className="h-[70px] w-auto object-contain"
                  data-testid="img-footer-logo"
                />
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-inria" data-testid="text-footer-description">
              Di-Aza Studio transforms spaces through innovative design excellence. Our DIAZA methodology delivers quality, client-focused interiors that elevate every environment.
            </p>
          </div>

          {/* Support Section */}
          <div className="col-span-1">
            <h3 className="text-xl font-semibold mb-6 font-inria" data-testid="text-support-heading">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-inria text-sm" data-testid="link-footer-help">
                  Help
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-inria text-sm" data-testid="link-footer-faq">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors font-inria text-sm" data-testid="link-footer-contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="col-span-1">
            <h3 className="text-xl font-semibold mb-6 font-inria" data-testid="text-company-heading">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors font-inria text-sm" data-testid="link-footer-about">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-inria text-sm" data-testid="link-footer-careers">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-inria text-sm" data-testid="link-footer-presskit">
                  Press kit
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="col-span-1">
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-white hover:text-[#CDA156] transition-colors" aria-label="Facebook" data-testid="link-facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-[#CDA156] transition-colors" aria-label="Instagram" data-testid="link-instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-[#CDA156] transition-colors" aria-label="LinkedIn" data-testid="link-linkedin">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-[#CDA156] transition-colors" aria-label="Twitter" data-testid="link-twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <h3 className="text-lg font-semibold mb-2 font-inria" data-testid="text-newsletter-heading">Subscribe to newsletter.</h3>
            <p className="text-sm text-gray-400 mb-4 font-inria" data-testid="text-newsletter-subheading">Curious about developments.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@diazastudio.com"
                className="w-full bg-[#3D3D3D] text-white placeholder-gray-500 rounded-lg px-4 py-3 pr-12 text-sm font-inria focus:outline-none focus:ring-2 focus:ring-[#CDA156]"
                data-testid="input-newsletter-email"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-[#2D2D2D] rounded-full p-2 hover:bg-[#CDA156] transition-colors"
                data-testid="button-newsletter-subscribe"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400 font-inria" data-testid="text-copyright">
            diazastudio © 2025. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
