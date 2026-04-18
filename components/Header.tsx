'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <span className="text-2xl font-extrabold text-[#0F1C3F] tracking-tight">TidyWay</span>

          <div className="flex items-center gap-4">
            <a
              href="tel:+12260000000"
              className="hidden md:block text-[#0F1C3F] font-semibold text-sm hover:text-[#2DD4A7] transition-colors"
            >
              (226) XXX-XXXX
            </a>
            <button
              onClick={scrollToForm}
              className="bg-[#2DD4A7] hover:bg-[#22c497] text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
            >
              Get My Free Quote
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
