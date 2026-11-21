import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Zap, Clock, User, Coffee } from 'lucide-react';

export default function BarberRadioGroup({
  barbers,
  selectedBarberId,
  onSelect,
  queue
}) {
  const { language, t } = useLanguage();

  // Helper to count waiting people for each barber
  const getWaitingCountForBarber = (barberId) => {
    return queue.filter(t => t.status === 'WAITING' && t.preferredBarberId === barberId).length;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F0F0F]">
          {t('step3Barber')}
        </label>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {/* Option A: Any Barber (Fastest) */}
        <button
          type="button"
          onClick={() => onSelect('ANY')}
          className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
            selectedBarberId === 'ANY'
              ? 'border-[#0F0F0F] bg-stone-50 shadow-sm ring-1 ring-[#0F0F0F]'
              : 'border-stone-200 bg-white hover:border-[#C5A880] hover:bg-stone-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F0F0F] text-[#C5A880] flex items-center justify-center shrink-0 shadow-sm">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#0F0F0F] group-hover:text-[#C5A880] transition-colors">
                  {t('anyBarberOption')}
                </span>
                <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-[#C5A880] text-black uppercase tracking-wider">
                  {t('fastestTag')}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1 font-light">
                {t('anyBarberDesc')}
              </p>
            </div>
          </div>

          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            selectedBarberId === 'ANY' ? 'border-[#0F0F0F]' : 'border-stone-300'
          }`}>
            {selectedBarberId === 'ANY' && (
              <div className="w-2.5 h-2.5 rounded-full bg-[#0F0F0F]" />
            )}
          </div>
        </button>

        {/* Specific Barbers */}
        {barbers.map((barber) => {
          const isSelected = selectedBarberId === barber.id;
          const waitingCount = getWaitingCountForBarber(barber.id);
          const isOnBreak = barber.status === 'ON_BREAK';

          return (
            <button
              key={barber.id}
              type="button"
              disabled={isOnBreak}
              onClick={() => onSelect(barber.id)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                isSelected
                  ? 'border-[#0F0F0F] bg-stone-50 shadow-sm ring-1 ring-[#0F0F0F]'
                  : isOnBreak
                  ? 'border-stone-100 bg-stone-50 opacity-40 cursor-not-allowed'
                  : 'border-stone-200 bg-white hover:border-[#C5A880] hover:bg-stone-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={barber.avatar}
                  alt={barber.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200 grayscale contrast-125"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#0F0F0F]">
                      {language === 'gu' && barber.gujaratiName ? barber.gujaratiName : barber.name}
                    </span>
                    <span className="text-[10px] font-light text-stone-500">
                      (Chair {barber.chair})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                    <span className="text-stone-500 font-light line-clamp-1">{barber.specialty}</span>
                    <span className="text-stone-300">•</span>
                    {isOnBreak ? (
                      <span className="text-amber-700 font-medium">{t('onBreak')}</span>
                    ) : (
                      <span className="text-stone-600 font-medium">
                        {waitingCount} {t('aheadCount')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                isSelected ? 'border-[#0F0F0F]' : 'border-stone-300'
              }`}>
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0F0F0F]" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
