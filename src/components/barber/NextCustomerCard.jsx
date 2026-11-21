import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Bell, Lock, User, Scissors, Clock } from 'lucide-react';

export default function NextCustomerCard({
  nextCustomer,
  barber,
  isChairBusy,
  isOnBreak,
  services,
  onCallCustomer
}) {
  const { language, t } = useLanguage();

  const serviceMap = services.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  const isLocked = isChairBusy || isOnBreak;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E3DC] shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F0F0F]">
          {t('nextEligibleCustomer')}
        </h3>
        {isChairBusy && (
          <span className="text-[10px] uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Locked (Chair Occupied)
          </span>
        )}
      </div>

      {!nextCustomer ? (
        <div className="text-center py-10 px-4 bg-[#FAF9F6] rounded-2xl border border-stone-200">
          <p className="text-xs text-stone-500 font-light">
            {t('noCustomerWaiting')}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-stone-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A880] bg-white px-2.5 py-0.5 rounded-full border border-stone-200">
                  Token {nextCustomer.id}
                </span>
                <h4 className="font-serif text-xl font-normal text-[#0F0F0F] mt-2.5">
                  {nextCustomer.customerName}
                </h4>
                <p className="text-xs text-stone-500 mt-1 font-light">
                  {nextCustomer.services.map(sid => {
                    const s = serviceMap[sid];
                    return s ? (language === 'gu' && s.gujaratiName ? s.gujaratiName : s.name) : sid;
                  }).join(' + ')}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-medium text-stone-700 block">
                  {nextCustomer.totalDuration} {t('minutesAbbr')}
                </span>
                <span className="font-serif text-lg font-light text-[#0F0F0F]">
                  {t('currency')}{nextCustomer.totalPrice}
                </span>
              </div>
            </div>

            {/* Smart FIFO Tag */}
            <div className="mt-3.5 pt-3 border-t border-stone-200/80 text-[11px] text-stone-500 flex items-center gap-2 font-light">
              <Scissors className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>
                {nextCustomer.preferredBarberId === barber.id
                  ? t('explicitRequest')
                  : t('anyStylistRequest')}
              </span>
            </div>
          </div>

          {/* Concurrency Guard Tooltip warning */}
          {isChairBusy && (
            <p className="text-[11px] text-stone-600 bg-stone-50 border border-stone-200 rounded-xl p-3 font-light">
              ℹ️ {t('chairBusyWarning')}
            </p>
          )}

          {/* Action Call Button */}
          <button
            type="button"
            disabled={isLocked}
            onClick={() => onCallCustomer(barber.id)}
            className={`w-full py-4 px-6 rounded-full font-medium text-xs uppercase tracking-[0.2em] shadow-md transition-all flex items-center justify-center gap-2 ${isLocked
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                : 'bg-[#0F0F0F] hover:bg-[#C5A880] text-white active:scale-95'
              }`}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            <span>{t('callThisCustomerBtn')}</span>
          </button>
        </div>
      )}
    </div>
  );
}
