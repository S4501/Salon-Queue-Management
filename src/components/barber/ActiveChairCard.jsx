import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Scissors, CheckCircle, Clock, Zap, Sparkles } from 'lucide-react';

export default function ActiveChairCard({
  barber,
  currentToken,
  services,
  onCompleteService,
  onFinishEarlyAndCallNext
}) {
  const { language, t } = useLanguage();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!barber.serviceStartedAt && !currentToken?.serviceStartedAt) {
      setElapsedSeconds(0);
      return;
    }

    const startTime = barber.serviceStartedAt || currentToken?.serviceStartedAt || Date.now();
    
    const update = () => {
      const sec = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(Math.max(0, sec));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [barber.serviceStartedAt, currentToken?.serviceStartedAt]);

  const serviceMap = services.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const stopwatchFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const totalEstDuration = currentToken?.totalDuration || 30;
  const progressPercent = Math.min(100, Math.round((minutes / totalEstDuration) * 100));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E3DC] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F0F0F]">
          {t('currentChairStatus')}
        </h3>
        <span className={`text-[11px] font-semibold uppercase tracking-wider px-3.5 py-1 rounded-full ${
          currentToken
            ? 'bg-stone-100 text-stone-900 border border-stone-200 animate-pulse'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          {currentToken ? t('statusInService') : t('barberStatusAvailable')}
        </span>
      </div>

      {!currentToken ? (
        <div className="text-center py-10 px-4 bg-[#FAF9F6] rounded-2xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-white text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <CheckCircle className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-[#0F0F0F] uppercase tracking-wider">
            {t('chairAvailablePrompt')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880] border border-[#C5A880]/30 bg-stone-50 px-3 py-1 rounded-full">
                Token {currentToken.id}
              </span>
              <h2 className="font-serif text-2xl font-light text-[#0F0F0F] mt-2.5">
                {currentToken.customerName}
              </h2>
              <p className="text-xs text-stone-500 mt-1 font-light">
                {currentToken.services.map(sid => {
                  const s = serviceMap[sid];
                  return s ? (language === 'gu' && s.gujaratiName ? s.gujaratiName : s.name) : sid;
                }).join(' + ')}
              </p>
            </div>

            {/* Stopwatch Display */}
            <div className="text-right">
              <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400 block">
                {t('serviceStopwatchLabel')}
              </span>
              <span className="font-mono text-2xl font-bold text-[#0F0F0F] tracking-wider text-tabular block mt-0.5">
                {stopwatchFormatted}
              </span>
              <span className="text-[11px] text-stone-500 font-light block">
                Est. {totalEstDuration} mins
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-stone-500 font-light">
              <span>Elapsed Service Time</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C5A880] transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Dual Action Buttons: Finish Early / Regular Complete */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onFinishEarlyAndCallNext ? onFinishEarlyAndCallNext(currentToken.id, barber.id) : onCompleteService(currentToken.id)}
              className="py-3.5 px-4 rounded-full bg-[#C5A880] hover:bg-[#B5966B] text-black font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              title="Immediately completes current client and calls next in line"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{t('finishEarlyCallNextBtn')}</span>
            </button>

            <button
              onClick={() => onCompleteService(currentToken.id)}
              className="py-3.5 px-4 rounded-full bg-[#0F0F0F] hover:bg-stone-800 text-white font-medium text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{t('completeServiceBtn')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
