import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { calculateWaitTime } from '../../utils/waitTimeCalculator';
import LobbyOverviewSidebar from '../../components/reception/LobbyOverviewSidebar';
import LiveQueueTable from '../../components/reception/LiveQueueTable';
import WalkInModal from '../../components/reception/WalkInModal';
import { UserPlus, Sparkles, Scissors, Users, Sliders, LogOut } from 'lucide-react';

export default function ReceptionPage() {
  const { language, t } = useLanguage();

  // Route protection: requires preset admin authentication
  const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('makeover_admin_auth') === 'true';
  if (!isAuth) {
    return <Navigate to="/admin" replace />;
  }

  const {
    queue,
    barbers,
    services,
    joinQueue,
    callNextCustomer,
    startService,
    completeService,
    finishEarlyAndCallNext,
    markNoShow,
    reAddNoShow,
    cancelToken,
    toggleBarberBreak
  } = useQueueStore();

  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);

  // Statistics
  const completedCount = queue.filter(t => t.status === 'COMPLETED').length;
  const noShowCount = queue.filter(t => t.status === 'NO_SHOW').length;

  const waitingTokens = queue.filter(t => t.status === 'WAITING');
  const waitCalc = calculateWaitTime({
    token: waitingTokens[0] || null,
    queue,
    barbers,
    servicesMap: {}
  });

  const avgWaitMinutes = waitCalc.isPaused ? 0 : waitCalc.waitMinutes;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      
      {/* Top Header Strip (MÈCHE Luxury Editorial Concierge Desk) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E3DC] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C5A880] border border-[#C5A880]/30 bg-stone-50 px-3 py-1 rounded-full">
              Atelier Concierge Desk
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#0F0F0F] mt-2">
            {t('receptionTitle')}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5 font-light">
            Real-time walk-in reservations, chair assignments, and guest flow orchestration.
          </p>
        </div>

        {/* Action Buttons: Walk-in & Admin Panel Link */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/admin"
            className="px-5 py-3.5 rounded-full border border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-black hover:bg-stone-50 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Admin Console</span>
          </Link>

          <button
            onClick={() => setIsWalkInModalOpen(true)}
            className="px-6 py-3.5 rounded-full bg-[#0F0F0F] hover:bg-[#C5A880] text-white font-medium text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('walkInRegistrationBtn')}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split: Left 35% Sidebar, Right 65% Live Queue Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lobby Overview Sidebar */}
        <div className="lg:col-span-4">
          <LobbyOverviewSidebar
            queue={queue}
            barbers={barbers}
            avgWaitMinutes={avgWaitMinutes}
            completedCount={completedCount}
            noShowCount={noShowCount}
            onToggleBarberBreak={toggleBarberBreak}
            onCallNext={callNextCustomer}
          />
        </div>

        {/* Right Column: Live Queue Table */}
        <div className="lg:col-span-8">
          <LiveQueueTable
            queue={queue}
            barbers={barbers}
            services={services}
            onCallNext={callNextCustomer}
            onStartService={startService}
            onCompleteService={completeService}
            onFinishEarlyAndCallNext={finishEarlyAndCallNext}
            onMarkNoShow={markNoShow}
            onReAddNoShow={reAddNoShow}
            onCancelToken={cancelToken}
          />
        </div>

      </div>

      {/* Walk-in Registration Modal */}
      <WalkInModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        services={services}
        barbers={barbers}
        onIssueToken={joinQueue}
      />

    </div>
  );
}
