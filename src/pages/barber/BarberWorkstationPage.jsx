import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import ActiveChairCard from '../../components/barber/ActiveChairCard';
import NextCustomerCard from '../../components/barber/NextCustomerCard';
import { Coffee, Scissors, Users, ArrowLeft, Sparkles } from 'lucide-react';

export default function BarberWorkstationPage() {
  const { name } = useParams();
  const { language, t } = useLanguage();

  const {
    barbers,
    queue,
    services,
    callNextCustomer,
    startService,
    completeService,
    finishEarlyAndCallNext,
    toggleBarberBreak
  } = useQueueStore();

  // Find barber matching param (matches by id or slugified name)
  const barber = barbers.find(b => {
    if (b.id.toLowerCase() === (name || '').toLowerCase()) return true;
    const slug = b.name.toLowerCase().replace(/\s+/g, '-');
    return slug === (name || '').toLowerCase();
  }) || barbers[0];

  const isOnBreak = barber.status === 'ON_BREAK';

  // Find active customer in chair
  const currentToken = barber.currentServiceToken
    ? queue.find(t => t.id === barber.currentServiceToken && ['IN_SERVICE', 'CALLED'].includes(t.status))
    : null;

  const isChairBusy = !!currentToken && currentToken.status === 'IN_SERVICE';

  // Smart FIFO next customer for this barber
  const waitingTokens = queue.filter(t => t.status === 'WAITING');
  let nextEligibleCustomer = null;
  for (const tok of waitingTokens) {
    if (tok.preferredBarberId === barber.id || tok.preferredBarberId === 'ANY') {
      nextEligibleCustomer = tok;
      break;
    }
  }

  // Mini queue preview for this barber
  const myQueue = waitingTokens.filter(tok => tok.preferredBarberId === barber.id || tok.preferredBarberId === 'ANY');

  const barberDisplayName = language === 'gu' && barber.gujaratiName ? barber.gujaratiName : barber.name;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      
      {/* Top Bar with Barber Switcher & Break Toggle */}
      <div className="bg-white rounded-3xl p-6 border border-[#E7E3DC] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={barber.avatar}
            alt={barber.name}
            className="w-14 h-14 rounded-full object-cover border border-[#C5A880] grayscale contrast-125"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl font-normal text-[#0F0F0F]">
                {barberDisplayName}
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C5A880]">
                ({t('chairLabel')} 0{barber.chair})
              </span>
            </div>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              {barber.specialty}
            </p>
          </div>
        </div>

        {/* Break Toggle Button */}
        <button
          onClick={() => toggleBarberBreak(barber.id)}
          className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center gap-1.5 active:scale-95 ${
            isOnBreak
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>{isOnBreak ? t('resumeShiftBtn') : t('toggleBreakBtn')}</span>
        </button>
      </div>

      {/* Break Warning if currently on break */}
      {isOnBreak && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-medium text-amber-900 flex items-center gap-2">
          <Coffee className="w-4 h-4 text-amber-700 shrink-0" />
          <span>You are currently ON BREAK. Your chair is temporarily paused from queue dispatch.</span>
        </div>
      )}

      {/* Card 1: Active Chair (In-Service or Available) */}
      <ActiveChairCard
        barber={barber}
        currentToken={currentToken}
        services={services}
        onCompleteService={completeService}
        onFinishEarlyAndCallNext={finishEarlyAndCallNext}
      />

      {/* Card 2: Next Customer (Smart FIFO Dispatch) */}
      <NextCustomerCard
        nextCustomer={nextEligibleCustomer}
        barber={barber}
        isChairBusy={isChairBusy}
        isOnBreak={isOnBreak}
        services={services}
        onCallCustomer={callNextCustomer}
      />

      {/* Card 3: Stylist Mini Queue Preview */}
      <div className="bg-white rounded-3xl p-6 border border-[#E7E3DC] shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F0F0F]">
            {t('myQueuePreview')}
          </h3>
          <span className="text-xs font-medium text-stone-500">
            {myQueue.length} {t('currentlyWaiting')}
          </span>
        </div>

        {myQueue.length === 0 ? (
          <p className="text-xs text-stone-400 py-3 text-center font-light">
            {t('noCustomerWaiting')}
          </p>
        ) : (
          <div className="space-y-2">
            {myQueue.slice(0, 5).map((tok, idx) => (
              <div
                key={tok.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F6] border border-stone-200 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0F0F0F] text-white text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-mono font-bold text-[#0F0F0F]">{tok.id}</span>
                  <span className="text-stone-700 font-medium">{tok.customerName}</span>
                </div>
                <span className="text-[10px] text-stone-500 font-light">
                  {tok.preferredBarberId === barber.id ? 'Requested You' : 'Any Stylist'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
