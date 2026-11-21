import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Bell, CheckCircle2, MapPin } from 'lucide-react';
import { playChime } from '../../utils/audioChime';

export default function ApproachModal({
  token,
  barber,
  onAcknowledge
}) {
  const { language, t } = useLanguage();
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes

  useEffect(() => {
    // Play sound and trigger vibration if supported
    playChime();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([200, 100, 200, 100, 400]);
      } catch {
        // ignore
      }
    }

    // 10-minute countdown timer based on calledAt timestamp
    const interval = setInterval(() => {
      if (token?.calledAt) {
        const elapsedSecs = Math.floor((Date.now() - token.calledAt) / 1000);
        const rem = Math.max(0, 600 - elapsedSecs);
        setSecondsRemaining(rem);
      } else {
        setSecondsRemaining(prev => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const barberDisplayName = barber
    ? (language === 'gu' && barber.gujaratiName ? barber.gujaratiName : barber.name)
    : 'Stylist';

  const chairNumber = barber ? barber.chair : '1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="max-w-md w-full bg-[#FAF9F6] rounded-3xl p-6 sm:p-8 border-2 border-[#C5A880] shadow-2xl text-center relative overflow-hidden text-[#0F0F0F]">
        
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C5A880] via-[#F4EFEA] to-[#C5A880]" />

        {/* Pulsing Bell Icon */}
        <div className="w-14 h-14 rounded-full bg-[#0F0F0F] text-[#C5A880] flex items-center justify-center mx-auto mb-4 animate-bounce shadow-md">
          <Bell className="w-6 h-6 fill-current" />
        </div>

        {/* Alert Heading */}
        <span className="inline-block text-[10px] uppercase font-semibold tracking-[0.25em] text-[#C5A880] bg-black px-3.5 py-1 rounded-full mb-3">
          Token {token?.id}
        </span>
        <h2 className="font-serif text-3xl font-light text-[#0F0F0F] tracking-tight mb-2">
          {t('turnModalTitle')}
        </h2>

        {/* Stylist & Chair Callout Box */}
        <div className="bg-white border border-[#E7E3DC] rounded-2xl p-4 my-4 shadow-sm">
          <p className="text-[11px] text-stone-500 uppercase tracking-wider font-medium">
            {t('proceedToChair')}
          </p>
          <div className="flex items-center justify-center gap-3.5 mt-3">
            {barber?.avatar && (
              <img
                src={barber.avatar}
                alt={barber.name}
                className="w-12 h-12 rounded-full object-cover border border-[#C5A880] grayscale contrast-125"
              />
            )}
            <div className="text-left">
              <h3 className="font-serif text-lg font-normal text-[#0F0F0F]">
                {barberDisplayName}
              </h3>
              <p className="text-xs font-semibold text-[#C5A880] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {t('chairLabel')} # {chairNumber}
              </p>
            </div>
          </div>
        </div>

        {/* 10-Minute Grace Countdown */}
        <div className="mb-6">
          <p className="text-xs text-stone-500 mb-1 font-light font-sans">
            {t('gracePeriodCountdown')}
          </p>
          <div className="text-2xl font-mono font-bold text-[#0F0F0F] tracking-wider text-tabular">
            {formattedTimer}
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-1000 ${
                secondsRemaining < 120 ? 'bg-rose-500' : 'bg-[#C5A880]'
              }`}
              style={{ width: `${(secondsRemaining / 600) * 100}%` }}
            />
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onAcknowledge}
          className="w-full py-4 px-6 rounded-full bg-[#0F0F0F] hover:bg-[#C5A880] text-white font-medium text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{t('iAmHereBtn')}</span>
        </button>
      </div>
    </div>
  );
}
