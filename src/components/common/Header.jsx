import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { Globe, ArrowRight, Menu, X, Clock, Sparkles } from 'lucide-react';

export default function Header() {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const { isMasterQueueOpen, barbers } = useQueueStore();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  // Listen to window scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const activeBarbers = barbers.filter(b => b.status !== 'ON_BREAK');
  const allOnBreak = activeBarbers.length === 0;

  // Don't render header on the 1080p wall TV display
  if (location.pathname === '/display') {
    return null;
  }

  // Dynamic style depending on scroll and current page - seamless floating aesthetic without dividing line
  const headerBackground = !isHome || isScrolled
    ? 'bg-[#FAF9F6]/95 backdrop-blur-md shadow-xs text-[#0F0F0F]'
    : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white';

  const logoColor = !isHome || isScrolled ? 'text-[#0F0F0F]' : 'text-white';
  const navLinkColor = !isHome || isScrolled
    ? 'text-[#47423C] hover:text-[#0F0F0F]'
    : 'text-white/80 hover:text-white';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBackground}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Monogram & Logo (MÈCHE Luxury Editorial Style) */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
            <span className="font-serif italic text-lg leading-none font-light">M</span>
          </div>
          <span className={`font-serif text-xl sm:text-2xl font-light tracking-[0.25em] uppercase transition-colors ${logoColor}`}>
            {t('brandName')}
          </span>
        </Link>

        {/* Center Editorial Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.22em] font-medium">
          {isHome ? (
            <>
              <a href="#concierge" className={`transition-colors ${navLinkColor}`}>
                Live Lounge
              </a>
              <a href="#services" className={`transition-colors ${navLinkColor}`}>
                Services
              </a>
              <a href="#stylists" className={`transition-colors ${navLinkColor}`}>
                Stylists
              </a>
              <a href="#location" className={`transition-colors ${navLinkColor}`}>
                Atelier
              </a>
            </>
          ) : (
            <>
              <Link to="/" className={`transition-colors ${navLinkColor}`}>
                Atelier Home
              </Link>
              <Link to="/join" className={`transition-colors ${navLinkColor}`}>
                Join Queue
              </Link>
            </>
          )}

          {/* Quick Staff Jump */}
          <div className="h-3 w-px bg-current opacity-20" />
          <Link to="/reception" className={`transition-colors opacity-70 hover:opacity-100 ${navLinkColor}`}>
            Reception
          </Link>
          <Link to="/display" className={`transition-colors opacity-70 hover:opacity-100 ${navLinkColor}`}>
            TV Screen
          </Link>
          <Link to="/admin" className={`transition-colors opacity-70 hover:opacity-100 ${navLinkColor}`}>
            Admin
          </Link>
        </nav>

        {/* Right CTA Actions & Language Toggle with Generous Spacing */}
        <div className="flex items-center gap-3.5 ml-6 xl:ml-12 shrink-0">

          {/* Bilingual Language Segmented Toggle Switch */}
          <div className="flex items-center p-0.5 rounded-full border border-current/20 bg-black/5 dark:bg-white/5">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all ${
                language === 'en'
                  ? 'bg-[#C5A880] text-black shadow-xs'
                  : 'text-current opacity-60 hover:opacity-100'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('gu')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                language === 'gu'
                  ? 'bg-[#C5A880] text-black shadow-xs'
                  : 'text-current opacity-60 hover:opacity-100'
              }`}
            >
              ગુજ
            </button>
          </div>

          {/* Primary Action Button - Slim Single-Line Haute Couture Pill */}
          {isMasterQueueOpen ? (
            <Link
              to="/join"
              className={`hidden md:inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] uppercase tracking-[0.16em] font-medium px-4 py-2 rounded-full transition-all duration-300 shrink-0 ${
                !isHome || isScrolled
                  ? 'bg-[#0F0F0F] text-white hover:bg-[#2C2925] shadow-xs'
                  : 'bg-white text-[#0F0F0F] hover:bg-[#C5A880] hover:text-white shadow-md'
              }`}
            >
              <span>{t('joinLiveQueueCTA')}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          ) : (
            <span className="hidden md:inline-block text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full bg-stone-200 text-stone-600 shrink-0">
              Paused
            </span>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg lg:hidden text-current"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F6] border-b border-[#E7E3DC] text-[#0F0F0F] px-6 py-6 shadow-xl animate-fade-in space-y-4">
          <div className="flex flex-col space-y-3 text-xs uppercase tracking-[0.2em] font-medium">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-200">
              Home & Atelier
            </Link>
            <Link to="/join" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-200 text-[#C5A880]">
              Join Live Queue
            </Link>
            <Link to="/reception" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-200">
              Reception Desk
            </Link>
            <Link to="/display" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-200">
              TV Floor Screen
            </Link>
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-200">
              Admin & Analytics
            </Link>
          </div>

          <div className="pt-2">
            <Link
              to="/join"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#0F0F0F] text-white text-xs uppercase tracking-[0.2em] font-medium"
            >
              <span>{t('joinLiveQueueCTA')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
