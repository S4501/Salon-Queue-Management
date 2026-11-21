import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { calculateWaitTime } from '../../utils/waitTimeCalculator';
import TvBarberCard from '../../components/display/TvBarberCard';
import TvUpcomingQueue from '../../components/display/TvUpcomingQueue';
import CallAnnouncementBanner from '../../components/display/CallAnnouncementBanner';
import { Sparkles, Clock, Volume2, VolumeX } from 'lucide-react';
import { playCallAlertSound } from '../../utils/audioChime';

export default function TvDisplayPage() {
  const { t } = useLanguage();

  const {
    barbers,
    queue,
    services,
    lastCalledToken,
    lastCalledTimestamp
  } = useQueueStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCallAlert, setShowCallAlert] = useState(false);

  // Audio beep alert preference (defaults to enabled, persisted in localStorage)
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem('makeover_tv_chime_enabled');
      return stored !== 'false';
    } catch {
      return true;
    }
  });

  const toggleSound = () => {
    setIsSoundEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('makeover_tv_chime_enabled', String(next));
      } catch {
        // ignore
      }
      if (next) {
        playCallAlertSound();
      }
      return next;
    });
  };

  // Digital clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Show announcement banner and play beep alert when a customer is called
  useEffect(() => {
    if (lastCalledTimestamp && Date.now() - lastCalledTimestamp < 8000) {
      setShowCallAlert(true);
      if (isSoundEnabled) {
        playCallAlertSound();
      }
      const timer = setTimeout(() => {
        setShowCallAlert(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [lastCalledTimestamp, isSoundEnabled]);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  // Waiting tokens
  const waitingTokens = queue.filter(t => t.status === 'WAITING');

  const waitCalc = calculateWaitTime({
    token: waitingTokens[0] || null,
    queue,
    barbers,
    servicesMap: {}
  });

  const avgWaitMinutes = waitCalc.isPaused ? 0 : waitCalc.waitMinutes;

  return (
    <div className="h-screen w-screen bg-[#FAF9F6] p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none text-[#0F0F0F]">
      
      {/* High-Impact Slide-Down Call Announcement Banner */}
      {showCallAlert && lastCalledToken && (
        <CallAnnouncementBanner
          token={lastCalledToken}
          barber={barbers.find(b => b.id === lastCalledToken.assignedBarberId)}
        />
      )}

      {/* 1080p Top Header Bar */}
      <header className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E7E3DC] shadow-sm flex items-center justify-between mb-4">
        {/* Salon Brand (MÈCHE Luxury Editorial Style) */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border border-stone-300 flex items-center justify-center text-[#0F0F0F] bg-[#FAF9F6] shadow-sm">
            <span className="font-serif italic text-xl font-light">M</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-light tracking-[0.2em] uppercase text-[#0F0F0F]">
                {t('wallDisplayTitle')}
              </h1>
              <span className="text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-[#C5A880] font-semibold">
                Lounge Display
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-light -mt-0.5">
              Live Lounge Floor Display & Turn Announcer
            </p>
          </div>
        </div>

        {/* Right Section: Sound Toggle & Digital Clock */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Beep / Audio Chime Toggle Button */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs uppercase tracking-wider font-semibold transition-all shadow-sm active:scale-95 ${
              isSoundEnabled
                ? 'bg-[#0F0F0F] text-white border-black hover:bg-stone-800'
                : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
            }`}
            title="Toggle customer call beep audio alert"
          >
            {isSoundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-[#C5A880] animate-pulse" />
                <span>{t('tvAudioAlertOn')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-stone-400" />
                <span>{t('tvAudioAlertOff')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              </>
            )}
          </button>

          {/* Digital Clock */}
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#0F0F0F] text-tabular">
              {formattedTime}
            </div>
            <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-widest">
              {formattedDate}
            </div>
          </div>

        </div>
      </header>

      {/* Main Split Screen: Left 60% Chairs, Right 40% Upcoming Queue */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        
        {/* Left 60% (7 Cols): 4 Barber Station Chairs */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F0F0F]">
              {t('nowServingHeader')}
            </h2>
            <span className="text-xs font-medium text-stone-500">
              4 Styling Stations
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5 flex-1">
            {barbers.map((barber) => {
              const currentToken = barber.currentServiceToken
                ? queue.find(t => t.id === barber.currentServiceToken)
                : null;

              const isRecentlyCalled = lastCalledToken?.assignedBarberId === barber.id && showCallAlert;

              return (
                <TvBarberCard
                  key={barber.id}
                  barber={barber}
                  currentToken={currentToken}
                  services={services}
                  isRecentlyCalled={isRecentlyCalled}
                />
              );
            })}
          </div>
        </div>

        {/* Right 40% (5 Cols): Upcoming Queue */}
        <div className="lg:col-span-5 h-full">
          <TvUpcomingQueue
            waitingTokens={waitingTokens}
            queue={queue}
            barbers={barbers}
          />
        </div>

      </main>

      {/* Bottom Footer Info Strip */}
      <footer className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 font-light px-2">
        <div className="flex items-center gap-4">
          <span>📍 102 Heritage Plaza, Ahmedabad</span>
          <span>📞 +91 98765 43210</span>
        </div>
        <div>
          <span>Make Over Real-Time Queue Orchestration</span>
        </div>
      </footer>

    </div>
  );
}
