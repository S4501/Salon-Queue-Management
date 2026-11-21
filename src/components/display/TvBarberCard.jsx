import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Scissors, Coffee, CheckCircle, User } from 'lucide-react';

export default function TvBarberCard({
  barber,
  currentToken,
  services,
  isRecentlyCalled
}) {
  const { language, t } = useLanguage();

  const isBreak = barber.status === 'ON_BREAK';
  const isBusy = barber.status === 'BUSY' && currentToken;
  const isAvailable = !isBreak && !isBusy;

  const serviceMap = services.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  const barberName = language === 'gu' && barber.gujaratiName ? barber.gujaratiName : barber.name;

  return (
    <div className={`relative rounded-3xl p-5 border transition-all duration-500 overflow-hidden flex flex-col justify-between ${
      isRecentlyCalled
        ? 'border-[#C5A880] bg-[#FAF9F6] shadow-xl scale-[1.01] ring-2 ring-[#C5A880]'
        : isBreak
        ? 'border-stone-200 bg-stone-100/60 opacity-80'
        : isBusy
        ? 'border-stone-300 bg-white shadow-sm'
        : 'border-emerald-200 bg-white shadow-sm'
    }`}>
      
      {/* Top Strip: Chair # & Status Pill */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#0F0F0F] text-white">
          {t('chairText')} 0{barber.chair}
        </span>

        {isBreak ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-stone-200 text-stone-700">
            <Coffee className="w-3 h-3" />
            {t('onBreak')}
          </span>
        ) : isBusy ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-900 border border-stone-200 animate-pulse">
            <Scissors className="w-3 h-3 text-[#C5A880]" />
            {t('busy')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            {t('availableNow')}
          </span>
        )}
      </div>

      {/* Middle: Barber Profile */}
      <div className="flex items-center gap-4 my-3">
        <img
          src={barber.avatar}
          alt={barber.name}
          className="w-16 h-16 rounded-full object-cover border border-stone-200 shadow-sm shrink-0 grayscale contrast-125"
        />
        <div>
          <h3 className="font-serif text-xl font-normal text-[#0F0F0F] leading-snug">
            {barberName}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 line-clamp-1 font-sans font-light">
            {barber.specialty}
          </p>
        </div>
      </div>

      {/* Bottom: Current Token Details */}
      <div className="pt-3 border-t border-stone-100">
        {isBusy && currentToken ? (
          <div className="bg-[#FAF9F6] rounded-2xl p-3 border border-stone-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-widest">
                Now Styling
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#0F0F0F] text-white">
                {currentToken.id}
              </span>
            </div>
            <p className="text-sm font-semibold text-[#0F0F0F] mt-1.5 truncate">
              {currentToken.customerName}
            </p>
            <p className="text-[11px] text-[#C5A880] font-medium mt-0.5 truncate">
              {currentToken.services.map(sid => {
                const s = serviceMap[sid];
                return s ? (language === 'gu' && s.gujaratiName ? s.gujaratiName : s.name) : sid;
              }).join(', ')}
            </p>
          </div>
        ) : isBreak ? (
          <div className="py-2.5 text-center text-xs text-stone-400 font-light">
            Scheduled Break • Resuming Shortly
          </div>
        ) : (
          <div className="py-2.5 text-center text-xs text-emerald-700 font-medium bg-emerald-50/50 rounded-xl border border-emerald-100">
            Ready for Next Customer
          </div>
        )}
      </div>

    </div>
  );
}
