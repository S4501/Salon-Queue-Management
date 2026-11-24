import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { calculateWaitTime } from '../../utils/waitTimeCalculator';
import ZeroBarberNotice from '../../components/common/ZeroBarberNotice';
import {
  Users,
  Clock,
  Scissors,
  ArrowRight,
  Search,
  Sparkles,
  MapPin,
  Phone,
  Shield,
  Coffee,
  CheckCircle2,
  ChevronDown,
  Calendar,
  Award,
  Star
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const {
    queue,
    barbers,
    services,
    isMasterQueueOpen
  } = useQueueStore();

  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackQuery, setTrackQuery] = useState('');
  const [trackError, setTrackError] = useState('');

  // Active Stylists (not on break)
  const activeBarbers = barbers.filter(b => b.status !== 'ON_BREAK');
  const allOnBreak = activeBarbers.length === 0;

  // Waiting count
  const waitingTokens = queue.filter(t => t.status === 'WAITING');
  const waitingCount = waitingTokens.length;

  // Dynamic Average wait time
  const waitCalc = calculateWaitTime({
    token: waitingTokens[0] || null,
    queue,
    barbers,
    servicesMap: {}
  });

  const avgWaitTime = waitCalc.isPaused ? 0 : waitCalc.waitMinutes;

  // Track token modal search handler
  const handleTrackSubmit = (e) => {
    e.preventDefault();
    setTrackError('');
    const query = trackQuery.trim();
    if (!query) return;

    const cleanDigits = query.replace(/\D/g, '').slice(-10);

    const activeTokens = queue.filter(t => ['WAITING', 'CALLED', 'IN_SERVICE'].includes(t.status));
    let found = activeTokens.find(t => {
      if (t.id.toLowerCase() === query.toLowerCase()) return true;
      if (cleanDigits && t.phone && t.phone.replace(/\D/g, '').slice(-10) === cleanDigits) return true;
      return false;
    }) || queue.find(t => {
      if (t.id.toLowerCase() === query.toLowerCase()) return true;
      if (cleanDigits && t.phone && t.phone.replace(/\D/g, '').slice(-10) === cleanDigits) return true;
      return false;
    });

    // If matching an old token that was re-added, route directly to the active replacement
    if (found && found.status === 'RE_ADDED' && found.reAddedTokenId) {
      const activeReplacement = queue.find(t => t.id === found.reAddedTokenId);
      if (activeReplacement) {
        found = activeReplacement;
      }
    }

    if (found) {
      setIsTrackModalOpen(false);
      navigate(`/status/${found.id}`);
    } else {
      setTrackError(t('tokenNotFound'));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0F0F0F] selection:bg-[#C5A880] selection:text-white">

      {/* =========================================================================
          SECTION 1: HERO AMBIENT VIDEO EXPERIENCE (MÈCHE EDITORIAL STYLE)
      ========================================================================== */}
      <section className="relative w-full h-[95vh] min-h-[640px] flex items-center justify-center overflow-hidden bg-black">

        {/* Hero Background Photo */}
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80"
          alt="Make Over Luxury Unisex Salon & Atelier"
          className="absolute inset-0 w-full h-full object-cover opacity-85 scale-105"
        />

        {/* Multi-stop Haute Couture Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/85 pointer-events-none" />

        {/* Hero Content Box */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white space-y-6 pt-12">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880] border border-[#C5A880]/40 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-[#C5A880]" />
            <span>{t('atelierEyebrow')}</span>
          </div>

          {/* Grand Haute Couture Title */}
          <div className="space-y-3">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light tracking-[0.25em] uppercase text-white leading-tight">
              {t('brandName')}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 sm:w-12 bg-[#C5A880]/60" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C5A880] font-sans font-medium">
                UNISEX SALON & ATELIER
              </span>
              <span className="h-px w-8 sm:w-12 bg-[#C5A880]/60" />
            </div>
          </div>

          {/* Tagline & Subtagline */}
          <p className="font-serif italic text-lg sm:text-2xl text-stone-200/95 max-w-2xl mx-auto font-light leading-relaxed">
            {t('subtagline')}
          </p>

          {/* Live Floor Snapshot Pill */}
          <div className="pt-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-black/50 backdrop-blur-md border border-white/15 px-6 py-2.5 rounded-full text-xs sm:text-sm text-stone-200">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${!isMasterQueueOpen ? 'bg-rose-500' : allOnBreak ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
                <span className="font-light tracking-wider uppercase text-[11px]">
                  {!isMasterQueueOpen ? t('salonPausedBadge') : allOnBreak ? t('allStylistsBreak') : t('salonOpenBadge')}
                </span>
              </div>
              <div className="hidden sm:block w-px h-3 bg-white/20" />
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{waitingCount} {waitingCount === 1 ? 'Guest' : 'Guests'} Waiting</span>
              </div>
              <div className="hidden sm:block w-px h-3 bg-white/20" />
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{allOnBreak ? '--' : `~${avgWaitTime} mins wait`}</span>
              </div>
            </div>
          </div>

          {/* Dual Action CTAs - Slim Haute Couture Capsules */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-lg mx-auto">
            {isMasterQueueOpen ? (
              <Link
                to="/join"
                className="w-full sm:w-auto py-2.5 px-6 rounded-full bg-white text-[#0F0F0F] hover:bg-[#C5A880] hover:text-white uppercase text-[11px] tracking-[0.18em] font-semibold transition-all duration-300 shadow-md flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                <span>{t('joinLiveQueueCTA')}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <div className="w-full sm:w-auto py-2.5 px-6 rounded-full bg-stone-800 text-stone-400 uppercase text-[11px] tracking-[0.18em] font-semibold text-center cursor-not-allowed whitespace-nowrap">
                {t('queuePausedNotice')}
              </div>
            )}

            <button
              onClick={() => setIsTrackModalOpen(true)}
              className="w-full sm:w-auto py-2.5 px-6 rounded-full border border-white/60 bg-white/10 hover:bg-white hover:text-black text-white backdrop-blur-sm uppercase text-[11px] tracking-[0.18em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t('trackExistingCTA')}</span>
            </button>
          </div>

        </div>

        {/* Scroll Prompt Indicator */}
        <a
          href="#philosophy"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/70 hover:text-white flex flex-col items-center gap-1 transition-colors"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] font-sans">Discover</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>
      </section>


      {/* Zero Barber Warning if everyone is on scheduled break */}
      {allOnBreak && (
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <ZeroBarberNotice />
        </div>
      )}


      {/* =========================================================================
          SECTION 2: THE PHILOSOPHY & EDITORIAL STATEMENT (MÈCHE LA STYLE)
      ========================================================================== */}
      <section id="philosophy" className="py-20 sm:py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Big Haute Couture Statement */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#C5A880]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-medium font-sans">
                The Atelier Philosophy
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#0F0F0F] tracking-tight leading-[1.15]">
              {t('philosophyTitle')}
            </h2>

            <blockquote className="font-serif italic text-xl sm:text-2xl text-stone-700 leading-relaxed border-l-2 border-[#C5A880] pl-6 my-6">
              {t('philosophyQuote')}
            </blockquote>

            <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed font-sans max-w-2xl">
              {t('philosophyBody')}
            </p>

            <div className="pt-4 flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-stone-800">
              <div className="flex flex-col">
                <span className="font-serif text-3xl text-[#0F0F0F] font-light">100%</span>
                <span className="text-[10px] text-stone-500 mt-1">Live Queue Transparency</span>
              </div>
              <div className="w-px h-10 bg-stone-300" />
              <div className="flex flex-col">
                <span className="font-serif text-3xl text-[#0F0F0F] font-light">4</span>
                <span className="text-[10px] text-stone-500 mt-1">Master Styling Chairs</span>
              </div>
              <div className="w-px h-10 bg-stone-300" />
              <div className="flex flex-col">
                <span className="font-serif text-3xl text-[#0F0F0F] font-light">0</span>
                <span className="text-[10px] text-stone-500 mt-1">Wasted Waiting Time</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fashion Editorial Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl bg-stone-900 group">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
                alt="Make Over Luxury Salon Interior"
                className="w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-sans">
                  Private Salon Floor
                </span>
                <p className="font-serif text-lg font-light text-white/95 mt-1">
                  102 Heritage Plaza • Ring Road, Ahmedabad
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 3: LIVE LOUNGE CONCIERGE & STATIONS (THE REAL-TIME FLOOR)
      ========================================================================== */}
      <section id="concierge" className="py-20 bg-[#F5F3EF] border-y border-[#E7E3DC]">
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium font-sans mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('liveConciergeTitle')}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#0F0F0F]">
                Current Floor Occupancy
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 font-light max-w-xl">
                {t('liveConciergeSub')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/join"
                className="px-6 py-3 rounded-full bg-[#0F0F0F] text-white hover:bg-[#C5A880] uppercase text-xs tracking-[0.2em] font-medium transition-colors"
              >
                Join Waitlist Now
              </Link>
            </div>
          </div>

          {/* 4 Styling Stations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {barbers.map((barber) => {
              const isAvailable = barber.status === 'AVAILABLE';
              const isBusy = barber.status === 'BUSY';
              const isOnBreak = barber.status === 'ON_BREAK';

              return (
                <div
                  key={barber.id}
                  className={`bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${isBusy
                      ? 'border-stone-300'
                      : isAvailable
                        ? 'border-emerald-300 shadow-sm'
                        : 'border-amber-200 opacity-85'
                    }`}
                >
                  {/* Station Number & Badge */}
                  <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">
                      CHAIR {barber.chair}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full ${isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isBusy
                            ? 'bg-stone-100 text-stone-700 border border-stone-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                    >
                      {isAvailable ? 'Available Now' : isBusy ? 'In Service' : 'On Break'}
                    </span>
                  </div>

                  {/* Stylist Identity */}
                  <div className="pt-5 flex items-center gap-4">
                    <img
                      src={barber.avatar}
                      alt={barber.name}
                      className="w-14 h-14 rounded-full object-cover border border-stone-200 grayscale contrast-125"
                    />
                    <div>
                      <h3 className="font-serif text-lg font-normal text-[#0F0F0F]">
                        {language === 'gu' && barber.gujaratiName ? barber.gujaratiName : barber.name}
                      </h3>
                      <p className="text-[11px] text-stone-500 font-sans mt-0.5 line-clamp-1">
                        {barber.specialty}
                      </p>
                    </div>
                  </div>

                  {/* Current Floor Action */}
                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400">
                      Current State
                    </span>
                    <span className="font-medium text-stone-800">
                      {isAvailable ? 'Ready for Guest' : isBusy ? `Token ${barber.currentServiceToken || 'In Chair'}` : 'Resting'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 4: CURATED SERVICE ATELIER (MENU PREVIEW)
      ========================================================================== */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-medium font-sans">
            Menu of Craftsmanship
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl font-light text-[#0F0F0F]">
            {t('servicesMenuTitle')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light font-sans">
            {t('servicesMenuSub')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl p-7 border border-[#E7E3DC] hover:border-[#C5A880] transition-all duration-300 group shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-400 font-sans">
                    0{idx + 1} • {srv.category || 'Styling'}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-stone-500">
                    <Clock className="w-3 h-3 text-[#C5A880]" />
                    <span>{srv.duration} mins</span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl font-light text-[#0F0F0F] group-hover:text-[#C5A880] transition-colors">
                  {language === 'gu' && srv.gujaratiName ? srv.gujaratiName : srv.name}
                </h3>

                <p className="text-xs text-stone-600 font-light mt-2 line-clamp-2 leading-relaxed">
                  {srv.description || 'Precision bespoke haircutting and ritual finishing customized to facial contours.'}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Investment</span>
                  <span className="font-serif text-xl font-light text-[#0F0F0F]">₹{srv.price}</span>
                </div>

                <Link
                  to="/join"
                  className="text-[10px] uppercase tracking-[0.2em] font-semibold px-4 py-2 rounded-full border border-stone-200 group-hover:border-[#0F0F0F] group-hover:bg-[#0F0F0F] group-hover:text-white transition-all"
                >
                  Select & Reserve →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* =========================================================================
          SECTION 5: MASTER STYLISTS & COLORISTS COLLECTIVE
      ========================================================================== */}
      <section id="stylists" className="py-24 bg-[#0F0F0F] text-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-medium font-sans">
              The Collective
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-light text-white">
              {t('stylistsRosterTitle')}
            </h2>
            <p className="text-sm text-stone-400 font-light font-sans">
              {t('stylistsRosterSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {barbers.map((barber) => (
              <div key={barber.id} className="group text-left space-y-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-900 border border-white/10">
                  <img
                    src={barber.avatar}
                    alt={barber.name}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="text-[9px] uppercase tracking-[0.25em] font-medium bg-black/60 backdrop-blur-sm border border-white/20 text-[#C5A880] px-3 py-1 rounded-full">
                      Station 0{barber.chair}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase tracking-wider text-stone-300">
                      {barber.status === 'AVAILABLE' ? '• Available Now' : barber.status === 'BUSY' ? '• In Chair' : '• On Break'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-light text-white group-hover:text-[#C5A880] transition-colors">
                    {language === 'gu' && barber.gujaratiName ? barber.gujaratiName : barber.name}
                  </h3>
                  <p className="text-xs text-stone-400 font-light mt-1 font-sans">
                    {barber.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>



      {/* =========================================================================
          SECTION 7: THE ATELIER LOCATION & HOURS
      ========================================================================== */}
      <section id="location" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-6 space-y-8">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-medium font-sans">
              Visit The Atelier
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-light text-[#0F0F0F]">
              {t('salonLocationTitle')}
            </h2>

            <div className="space-y-6 text-sm text-stone-600 font-light">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#0F0F0F] uppercase tracking-wider text-xs">Address</p>
                  <p className="mt-1">{t('address')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#0F0F0F] uppercase tracking-wider text-xs">Concierge & Inquiries</p>
                  <p className="mt-1">{t('phoneNum')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#0F0F0F] uppercase tracking-wider text-xs">Atelier Hours</p>
                  <p className="mt-1">{t('openingHours')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Coffee className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#0F0F0F] uppercase tracking-wider text-xs">Hospitality & Valet</p>
                  <p className="mt-1">{t('valetComplimentary')}. Artisanal coffee and restorative herbal infusions served upon arrival.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/join"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0F0F0F] text-white hover:bg-[#C5A880] uppercase text-xs tracking-[0.2em] font-medium transition-colors shadow-lg"
              >
                <span>{t('joinLiveQueueCTA')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden aspect-[4/3] border border-[#E7E3DC] shadow-xl bg-stone-900 relative">
              <img
                src="/images/atelier/atelier-visit.jpg"
                alt="Make Over Hair Atelier"
                className="w-full h-full object-cover grayscale contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="font-serif text-xl font-light">Make Over Unisex Atelier • Ahmedabad</p>
                <p className="text-xs text-stone-300 font-sans mt-0.5">Walk-Ins Welcome & Digital Waitlist Enabled</p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 8: THE NOIR EDITORIAL FOOTER
      ========================================================================== */}
      <footer className="bg-[#0F0F0F] text-white pt-20 pb-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 space-y-16">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

            {/* Brand Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-serif text-3xl font-light tracking-[0.25em] uppercase text-white">
                  {t('brandName')}
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full border border-[#C5A880]/60 text-[#C5A880] font-sans font-medium">
                  UNISEX
                </span>
              </div>
              <p className="text-xs text-stone-400 font-light font-sans max-w-sm leading-relaxed">
                Elevating hair design through modern craftsmanship, bespoke dimensional styling, and real-time lounge queue orchestration.
              </p>
              <div className="pt-2 text-xs text-[#C5A880] tracking-wider uppercase font-sans">
                AHMEDABAD • BEVERLY HILLS
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="md:col-span-3 space-y-3 text-xs uppercase tracking-[0.2em] font-medium text-stone-400">
              <p className="text-white font-serif text-sm tracking-widest uppercase mb-4">Navigation</p>
              <p><a href="#philosophy" className="hover:text-white transition-colors">Philosophy</a></p>
              <p><a href="#concierge" className="hover:text-white transition-colors">Live Lounge</a></p>
              <p><a href="#services" className="hover:text-white transition-colors">Services Atelier</a></p>
              <p><a href="#stylists" className="hover:text-white transition-colors">Our Stylists</a></p>
              <p><Link to="/join" className="text-[#C5A880] hover:text-white transition-colors">Join Online Queue</Link></p>
            </div>

            {/* Staff & Admin Links */}
            <div className="md:col-span-4 space-y-3 text-xs uppercase tracking-[0.2em] font-medium text-stone-400">
              <p className="text-white font-serif text-sm tracking-widest uppercase mb-4">Staff Portals</p>
              <p><Link to="/reception" className="hover:text-white transition-colors">Reception Desk →</Link></p>
              <p><Link to="/display" className="hover:text-white transition-colors">Wall TV Display →</Link></p>
              <p><Link to="/barber/chris-mcmillan" className="hover:text-white transition-colors">Stylist Workstation →</Link></p>
              <p><Link to="/admin" className="hover:text-white transition-colors">Owner Console →</Link></p>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 font-light">
            <p>© {new Date().getFullYear()} {t('brandName')} Atelier. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Curated with zero wait times & live queue technology.</p>
          </div>

        </div>
      </footer>


      {/* =========================================================================
          TRACK EXISTING TOKEN MODAL (HAUTE COUTURE LUXURY EDITORIAL STYLE)
      ========================================================================== */}
      {isTrackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#FAF9F6] rounded-3xl p-8 max-w-md w-full border border-[#E7E3DC] shadow-2xl relative text-[#0F0F0F]">

            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-sans font-medium">
                Live Token Lookup
              </span>
              <button
                onClick={() => setIsTrackModalOpen(false)}
                className="text-stone-400 hover:text-black text-sm"
              >
                ✕
              </button>
            </div>

            <h3 className="font-serif text-2xl font-light text-[#0F0F0F] mb-1">
              {t('trackModalTitle')}
            </h3>
            <p className="text-xs text-stone-600 mb-6 font-light font-sans">
              {t('trackModalPrompt')}
            </p>

            {trackError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {trackError}
              </div>
            )}

            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <input
                type="text"
                autoFocus
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder={t('trackModalInputPlaceholder')}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] bg-white font-sans text-[#0F0F0F]"
              />

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTrackModalOpen(false)}
                  className="flex-1 py-3 rounded-full border border-stone-300 text-xs uppercase tracking-wider font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#0F0F0F] hover:bg-[#C5A880] text-white text-xs uppercase tracking-wider font-semibold shadow-md transition-colors"
                >
                  {t('trackTokenBtn')}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
