import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import NoShowTimerBadge from './NoShowTimerBadge';
import {
  Phone,
  Clock,
  Scissors,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
  User
} from 'lucide-react';

export default function LiveQueueTable({
  queue,
  barbers,
  services,
  onCallNext,
  onStartService,
  onCompleteService,
  onFinishEarlyAndCallNext,
  onMarkNoShow,
  onReAddNoShow,
  onCancelToken
}) {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState('ACTIVE');
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  // Barber map
  const barberMap = barbers.reduce((acc, b) => {
    acc[b.id] = b;
    return acc;
  }, {});

  // Service map
  const serviceMap = services.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  // Filtering logic
  const filteredQueue = queue.filter(item => {
    if (filter === 'ACTIVE') {
      return ['WAITING', 'CALLED', 'IN_SERVICE'].includes(item.status);
    }
    if (filter === 'WAITING') return item.status === 'WAITING';
    if (filter === 'CALLED') return item.status === 'CALLED';
    if (filter === 'IN_SERVICE') return item.status === 'IN_SERVICE';
    if (filter === 'COMPLETED') return item.status === 'COMPLETED';
    if (filter === 'NO_SHOW') return item.status === 'NO_SHOW';
    if (filter.startsWith('barber-')) {
      return item.preferredBarberId === filter || item.assignedBarberId === filter;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E3DC] shadow-sm space-y-6">
      {/* Table Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-sans font-medium block">
            Floor Dispatch
          </span>
          <h3 className="font-serif text-2xl font-light text-[#0F0F0F]">
            {t('liveQueueTitle')}
          </h3>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            {filteredQueue.length} records matching active filter
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ACTIVE', label: 'Active Live' },
            { id: 'WAITING', label: t('filterWaiting') },
            { id: 'CALLED', label: t('filterCalled') },
            { id: 'IN_SERVICE', label: t('filterInService') },
            { id: 'COMPLETED', label: t('statusCompleted') },
            { id: 'NO_SHOW', label: t('statusNoShow') },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-medium whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-[#0F0F0F] text-white shadow-sm'
                  : 'bg-[#FAF9F6] text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Cards / Table Rows */}
      {filteredQueue.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="text-sm font-light font-sans">No guest tokens match this filter view.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQueue.map((item) => {
            const assignedBarber = item.assignedBarberId ? barberMap[item.assignedBarberId] : null;
            const preferredBarber = item.preferredBarberId !== 'ANY' ? barberMap[item.preferredBarberId] : null;

            const serviceNames = item.services.map(sid => {
              const s = serviceMap[sid];
              return s ? (language === 'gu' && s.gujaratiName ? s.gujaratiName : s.name) : sid;
            }).join(' + ');

            const elapsedMinutes = item.joinedAt
              ? Math.floor((Date.now() - item.joinedAt) / (60 * 1000))
              : 0;

            const isCalled = item.status === 'CALLED';
            const isInService = item.status === 'IN_SERVICE';
            const isWaiting = item.status === 'WAITING';
            const isNoShow = item.status === 'NO_SHOW';
            const isCompleted = item.status === 'COMPLETED';

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCalled
                    ? 'border-[#C5A880] bg-[#FAF9F6] shadow-md ring-1 ring-[#C5A880]'
                    : isInService
                    ? 'border-stone-300 bg-stone-50'
                    : isNoShow
                    ? 'border-stone-200 bg-stone-100/50 opacity-60'
                    : isCompleted
                    ? 'border-stone-200 bg-stone-50/50 opacity-60'
                    : 'border-[#E7E3DC] bg-white hover:border-[#C5A880]'
                }`}
              >
                {/* Left: Token ID, Customer Details */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl text-center shrink-0 font-mono font-bold text-xs flex flex-col items-center justify-center border ${
                    isCalled
                      ? 'bg-[#C5A880] text-black border-[#C5A880]'
                      : isInService
                      ? 'bg-amber-600 text-white border-amber-600'
                      : isNoShow
                      ? 'bg-stone-200 text-stone-700 border-stone-300'
                      : 'bg-[#0F0F0F] text-white border-[#0F0F0F]'
                  }`}>
                    <span>{item.id}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-serif text-base font-normal text-[#0F0F0F]">
                        {item.customerName}
                      </h4>
                      <span className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#C5A880]" />
                        {item.phone}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 font-medium">
                        {item.source === 'REMOTE' ? t('sourceRemote') : t('sourceWalkIn')}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mt-1 line-clamp-1 font-light">
                      <span className="font-medium text-[#0F0F0F]">{serviceNames}</span>
                      <span className="mx-1.5 text-stone-300">•</span>
                      <span>{item.totalDuration} {t('minutesAbbr')}</span>
                      <span className="mx-1.5 text-stone-300">•</span>
                      <span className="font-medium text-[#0F0F0F]">{t('currency')}{item.totalPrice}</span>
                    </p>

                    {/* Barber & Timer Info */}
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-stone-500 font-light">
                      <span>
                        Stylist: <strong className="text-[#0F0F0F] font-medium">
                          {assignedBarber
                            ? (language === 'gu' && assignedBarber.gujaratiName ? assignedBarber.gujaratiName : assignedBarber.name)
                            : preferredBarber
                            ? (language === 'gu' && preferredBarber.gujaratiName ? preferredBarber.gujaratiName : preferredBarber.name)
                            : t('anyBarberOption')}
                        </strong>
                      </span>

                      <span className="text-stone-300">•</span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C5A880]" />
                        {t('elapsedWaitLabel')}: {elapsedMinutes}m
                      </span>

                      {isCalled && item.calledAt && (
                        <>
                          <span className="text-stone-300">•</span>
                          <NoShowTimerBadge calledAt={item.calledAt} />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Operational Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                  
                  {/* Waiting Token Actions */}
                  {isWaiting && (
                    <>
                      <button
                        onClick={() => onCallNext(item.preferredBarberId !== 'ANY' ? item.preferredBarberId : barbers[0].id)}
                        className="px-4 py-2 rounded-full bg-[#0F0F0F] hover:bg-[#C5A880] text-white text-[11px] uppercase tracking-wider font-semibold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Scissors className="w-3.5 h-3.5" />
                        <span>{t('callNextBtn')}</span>
                      </button>

                      <button
                        onClick={() => setConfirmCancelId(item.id)}
                        className="px-3 py-2 rounded-full text-stone-500 hover:text-rose-600 hover:bg-rose-50 text-[11px] uppercase tracking-wider font-medium transition-all"
                        title={t('cancel')}
                      >
                        {t('cancel')}
                      </button>
                    </>
                  )}

                  {/* Called Token Actions */}
                  {isCalled && (
                    <>
                      <button
                        onClick={() => onStartService(item.id, item.assignedBarberId || barbers[0].id)}
                        className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] uppercase tracking-wider font-semibold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t('startServiceBtn')}</span>
                      </button>

                      <button
                        onClick={() => onMarkNoShow(item.id)}
                        className="px-3 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{t('markNoShowBtn')}</span>
                      </button>

                      <button
                        onClick={() => setConfirmCancelId(item.id)}
                        className="px-2.5 py-2 rounded-full text-stone-400 hover:text-stone-700 text-[11px]"
                      >
                        {t('cancel')}
                      </button>
                    </>
                  )}

                  {/* In Service Actions */}
                  {isInService && (
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <button
                        onClick={() => onFinishEarlyAndCallNext ? onFinishEarlyAndCallNext(item.id, item.assignedBarberId || barbers[0].id) : onCompleteService(item.id)}
                        className="px-4 py-2 rounded-full bg-[#C5A880] hover:bg-[#B5966B] text-black text-[11px] uppercase tracking-wider font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                        title="Complete service early and dispatch next customer"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>{t('finishEarlyCallNextBtn')}</span>
                      </button>

                      <button
                        onClick={() => onCompleteService(item.id)}
                        className="px-4 py-2 rounded-full bg-[#0F0F0F] hover:bg-stone-800 text-white text-[11px] uppercase tracking-wider font-semibold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t('completeServiceBtn')}</span>
                      </button>
                    </div>
                  )}

                  {/* No-Show Actions (Re-Add at End) */}
                  {isNoShow && (
                    <button
                      onClick={() => onReAddNoShow(item.id)}
                      className="px-4 py-2 rounded-full bg-[#0F0F0F] hover:bg-[#C5A880] text-white text-[11px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t('reAddBtn')}</span>
                    </button>
                  )}
                </div>

                {/* Cancel Confirmation Dialog */}
                {confirmCancelId === item.id && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#FAF9F6] rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl text-center">
                      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                        <XCircle className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif text-lg font-normal text-[#0F0F0F] mb-1">
                        Cancel Token {item.id}?
                      </h4>
                      <p className="text-xs text-stone-500 mb-5 font-light">
                        This customer will be withdrawn from the queue immediately.
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setConfirmCancelId(null)}
                          className="flex-1 py-2.5 rounded-full border border-stone-300 text-xs uppercase tracking-wider font-semibold text-stone-700 hover:bg-stone-100"
                        >
                          Keep
                        </button>
                        <button
                          onClick={() => {
                            onCancelToken(item.id);
                            setConfirmCancelId(null);
                          }}
                          className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs uppercase tracking-wider font-semibold"
                        >
                          Yes, Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
