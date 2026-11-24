import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { Globe, ArrowRight, Menu, X, Clock, Sparkles, Lock } from 'lucide-react';

export default function Header() {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const { isMasterQueueOpen, barbers } = useQueueStore();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/reception');

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        
        {/* Brand Monogram & Logo (MÈCHE Luxury Editorial Style) */}
        <Link to="/" className="flex items-center gap-3 group z-10 shrink-0">
          <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
            <span className="font-serif italic text-lg leading-none font-light">M</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className={`font-serif text-xl sm:text-2xl font-light tracking-[0.25em] uppercase transition-colors ${logoColor}`}>
              {t('brandName')}
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border border-[#C5A880]/60 text-[#C5A880] font-sans font-medium">
              UNISEX
            </span>
          </div>
        </Link>

        {/* Center Editorial Navigation Links (Desktop - Customer Facing Only - Perfectly Centered) */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.22em] font-medium absolute left-1/2 -translate-x-1/2 pointer-events-auto">
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
        </nav>

        {/* Right CTA Actions & Language Toggle with Generous Spacing */}
        <div className="flex items-center gap-2.5 sm:gap-3 ml-auto shrink-0 z-10">

          {/* Admin Capsule: Only visible on landing/customer pages, hidden on admin console */}
          {!isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-current/20 hover:border-[#C5A880] text-[10px] uppercase tracking-wider font-semibold transition-all hover:text-[#C5A880] bg-black/5 dark:bg-white/5 active:scale-95 shadow-xs"
              title="Open Admin Executive Console"
            >
              <Lock className="w-3 h-3 text-[#C5A880]" />
              <span>Admin</span>
            </Link>
          )}

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

      {/* Mobile Drawer Menu (Customer Facing) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F6] border-b border-[#E7E3DC] text-[#0F0F0F] px-6 py-6 shadow-xl animate-fade-in space-y-4">
          <div className="flex flex-col space-y-3 text-xs uppercase tracking-[0.2em] font-medium">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-200">
              Home & Atelier
            </Link>
            <Link to="/join" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-200 text-[#C5A880]">
              Join Live Queue
            </Link>
            <a href="/#concierge" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-200">
              Live Lounge
            </a>
            <a href="/#services" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-200">
              Services
            </a>
            <a href="/#stylists" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-200">
              Stylists
            </a>
            <a href="/#location" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-stone-200">
              Atelier
            </a>
            {!isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-stone-200 text-left flex items-center justify-between text-stone-700 hover:text-black font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Admin Console</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400">Portal</span>
              </Link>
            )}
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
