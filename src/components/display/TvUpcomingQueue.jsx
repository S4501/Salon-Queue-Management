import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { simulateQueueSchedule } from '../../utils/waitTimeCalculator';
import { Clock, Scissors, Zap, QrCode } from 'lucide-react';

export default function TvUpcomingQueue({ waitingTokens = [], queue = [], barbers = [] }) {
  const { language, t } = useLanguage();

  // Compute exact floor simulation wait times for every token in line
  const { schedule } = simulateQueueSchedule({ queue, barbers });

  return (
    <div className="h-full flex flex-col justify-between bg-white rounded-3xl p-6 border border-[#E7E3DC] shadow-sm">
      
      <div>
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-sans font-medium block">
              Floor Priority
            </span>
            <h3 className="font-serif text-xl font-light text-[#0F0F0F] tracking-wide">
              {t('upcomingQueueHeader')}
            </h3>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700">
            {waitingTokens.length} Waiting
          </span>
        </div>

        {/* List of upcoming waiting tokens (Up to 7) */}
        {waitingTokens.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <p className="text-sm font-light font-sans">No patrons waiting in queue right now.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {waitingTokens.slice(0, 7).map((tok, idx) => {
              const wait = schedule.get(tok.id) ?? 0;
              const isReadyNow = wait === 0;

              const prefBarber = tok.preferredBarberId && tok.preferredBarberId !== 'ANY'
                ? barbers.find(b => b.id === tok.preferredBarberId)
                : null;

              const barberName = prefBarber
                ? (language === 'gu' && prefBarber.gujaratiName ? prefBarber.gujaratiName : prefBarber.name)
                : null;

              return (
                <div
                  key={tok.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isReadyNow
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-[#FAF9F6] border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0F0F0F] text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#0F0F0F]">
                          {tok.id}
                        </span>
                        <span className="text-xs font-medium text-[#0F0F0F]">
                          {tok.customerName}
                        </span>
                      </div>

                      {/* Requested Stylist Info */}
                      <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                        {prefBarber ? (
                          <span className="flex items-center gap-1 text-[#C5A880] font-medium">
                            <Scissors className="w-3 h-3 shrink-0" />
                            <span>
                              {barberName} ({t('chairText')} 0{prefBarber.chair})
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-stone-500 font-light">
                            <Zap className="w-3 h-3 text-[#C5A880] shrink-0" />
                            <span>{t('anyBarberOption')}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Wait Time / Ready Now Badge */}
                  <div>
                    {isReadyNow ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        {t('readyNow')}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-xs font-medium text-stone-600">
                        <Clock className="w-3 h-3 text-[#C5A880]" />
                        <span>~{wait}m</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Code Scan Banner at Bottom of Upcoming Queue */}
      <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-stone-200 flex items-center gap-4 mt-4">
        <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[#0F0F0F] shrink-0 shadow-sm">
          <QrCode className="w-7 h-7" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-[#0F0F0F] uppercase tracking-wider">
            {t('scanQRToJoin')}
          </h4>
          <p className="text-[11px] text-stone-500 mt-0.5 font-light leading-relaxed">
            {t('scanQRSub')}
          </p>
        </div>
      </div>

    </div>
  );
}
