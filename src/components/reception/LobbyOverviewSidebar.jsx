import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Users, Clock, CheckCircle2, UserX, Scissors, Coffee } from 'lucide-react';

export default function LobbyOverviewSidebar({
  queue,
  barbers,
  avgWaitMinutes,
  completedCount,
  noShowCount,
  onToggleBarberBreak,
  onCallNext
}) {
  const { language, t } = useLanguage();

  const waitingCount = queue.filter(t => t.status === 'WAITING').length;
  const calledCount = queue.filter(t => t.status === 'CALLED').length;
  const inServiceCount = queue.filter(t => t.status === 'IN_SERVICE').length;

  return (
    <div className="space-y-6">
      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Waiting */}
        <div className="bg-white rounded-2xl p-4 border border-[#E7E3DC] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {t('totalWaitingCount')}
            </span>
            <Users className="w-3.5 h-3.5 text-[#C5A880]" />
          </div>
          <div className="font-serif text-3xl font-light text-[#0F0F0F] text-tabular mt-1">
            {waitingCount}
          </div>
          <p className="text-[10px] text-stone-400 mt-1 font-light">
            +{calledCount} {t('filterCalled').toLowerCase()}
          </p>
        </div>

        {/* Avg Wait */}
        <div className="bg-white rounded-2xl p-4 border border-[#E7E3DC] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {t('estWaitTime')}
            </span>
            <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
          </div>
          <div className="font-serif text-3xl font-light text-[#0F0F0F] text-tabular mt-1">
            ~{avgWaitMinutes}
          </div>
          <p className="text-[10px] text-stone-400 mt-1 font-light">
            {t('minutesAbbr')}
          </p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl p-4 border border-[#E7E3DC] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {t('completedToday')}
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="font-serif text-3xl font-light text-emerald-800 text-tabular mt-1">
            {completedCount}
          </div>
          <p className="text-[10px] text-stone-400 mt-1 font-light">
            {t('today')}
          </p>
        </div>

        {/* No-Shows */}
        <div className="bg-white rounded-2xl p-4 border border-[#E7E3DC] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {t('noShowsCount')}
            </span>
            <UserX className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="font-serif text-3xl font-light text-rose-700 text-tabular mt-1">
            {noShowCount}
          </div>
          <p className="text-[10px] text-stone-400 mt-1 font-light">
            {t('today')}
          </p>
        </div>

      </div>

      {/* Stylist Chair Velocity Section */}
      <div className="bg-white rounded-3xl p-5 border border-[#E7E3DC] shadow-sm">
        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F0F0F] mb-4 flex items-center justify-between">
          <span>{t('stylistStatusHeader')}</span>
          <span className="text-[10px] text-stone-500 font-medium">
            {barbers.filter(b => b.status !== 'ON_BREAK').length}/{barbers.length} Active
          </span>
        </h4>

        <div className="space-y-3">
          {barbers.map((barber) => {
            const isBreak = barber.status === 'ON_BREAK';
            const isBusy = barber.status === 'BUSY';

            // Find current token details if busy
            const currentToken = barber.currentServiceToken
              ? queue.find(t => t.id === barber.currentServiceToken)
              : null;

            return (
              <div
                key={barber.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isBreak
                    ? 'border-stone-200 bg-stone-100/50'
                    : isBusy
                    ? 'border-stone-200 bg-stone-50/70'
                    : 'border-[#E7E3DC] bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={barber.avatar}
                      alt={barber.name}
                      className="w-9 h-9 rounded-full object-cover border border-stone-200 grayscale contrast-125"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif text-sm font-normal text-[#0F0F0F]">
                          {language === 'gu' && barber.gujaratiName ? barber.gujaratiName : barber.name}
                        </span>
                        <span className="text-[10px] text-stone-400 font-light">
                          (Chair 0{barber.chair})
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 line-clamp-1 font-light">
                        {barber.specialty}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isBreak ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-200 text-stone-700">
                        <Coffee className="w-2.5 h-2.5" />
                        {t('onBreak')}
                      </span>
                    ) : isBusy ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-800 border border-stone-200">
                        <Scissors className="w-2.5 h-2.5 text-[#C5A880]" />
                        {currentToken ? currentToken.id : t('busy')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        {t('availableNow')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub details if busy */}
                {isBusy && currentToken && (
                  <div className="mt-2 pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-700">
                    <span className="font-medium truncate max-w-[140px]">
                      {currentToken.customerName}
                    </span>
                    <span className="font-mono text-[10px] text-stone-500">
                      {currentToken.status}
                    </span>
                  </div>
                )}

                {/* Available Chair Quick Call Action */}
                {!isBreak && !isBusy && waitingCount > 0 && onCallNext && (
                  <div className="mt-2.5 pt-2 border-t border-emerald-100 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t('chairOpen')}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCallNext(barber.id)}
                      className="px-3 py-1 rounded-full bg-[#0F0F0F] hover:bg-[#C5A880] text-white text-[10px] uppercase tracking-wider font-semibold shadow-sm transition-all flex items-center gap-1 active:scale-95"
                      title={`Call next eligible waiting guest to Chair 0${barber.chair} (${barber.name})`}
                    >
                      <Scissors className="w-2.5 h-2.5 text-[#C5A880]" />
                      <span>{t('callNextBtn')}</span>
                    </button>
                  </div>
                )}

                {/* Reception Break Control Action */}
                <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] font-light uppercase tracking-wider text-stone-400">
                    Floor Break:
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleBarberBreak && onToggleBarberBreak(barber.id)}
                    className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1 active:scale-95 ${
                      isBreak
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                    }`}
                    title={isBreak ? "Resume barber shift" : "Mark barber on break"}
                  >
                    <Coffee className="w-2.5 h-2.5" />
                    <span>{isBreak ? t('endBreakBtn') : t('setBreakBtn')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
