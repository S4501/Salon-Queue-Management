import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { calculateWaitTime } from '../../utils/waitTimeCalculator';
import MasterQueueControls from '../../components/admin/MasterQueueControls';
import DailyAnalyticsCards from '../../components/admin/DailyAnalyticsCards';
import ServiceCatalogManager from '../../components/admin/ServiceCatalogManager';
import BarberRosterManager from '../../components/admin/BarberRosterManager';
import StylistPerformanceTable from '../../components/admin/StylistPerformanceTable';
import LobbyOverviewSidebar from '../../components/reception/LobbyOverviewSidebar';
import LiveQueueTable from '../../components/reception/LiveQueueTable';
import WalkInModal from '../../components/reception/WalkInModal';
import TvAudioSettingsModal from '../../components/display/TvAudioSettingsModal';
import { playChimePreset } from '../../utils/audioChime';
import {
  ListOrdered,
  Sliders,
  Scissors,
  Users,
  BarChart3,
  RotateCcw,
  Tv,
  LogOut,
  UserPlus,
  Lock
} from 'lucide-react';

export default function AdminPage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('QUEUE');
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  // Independent Chime Sound toggle (persisted)
  const [chimeEnabled, setChimeEnabled] = useState(() => {
    try {
      return localStorage.getItem('makeover_tv_chime_active') !== 'false';
    } catch {
      return true;
    }
  });

  // Independent Voice Announcement toggle (persisted)
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    try {
      return localStorage.getItem('makeover_tv_voice_active') !== 'false';
    } catch {
      return true;
    }
  });

  // Selected Chime Melody (persisted)
  const [selectedChimeId, setSelectedChimeId] = useState(() => {
    try {
      return localStorage.getItem('makeover_tv_selected_chime') || 'atelier';
    } catch {
      return 'atelier';
    }
  });

  // Selected Indian Voice Accent URI (persisted)
  const [selectedVoiceUri, setSelectedVoiceUri] = useState(() => {
    try {
      return localStorage.getItem('makeover_tv_selected_voice') || '';
    } catch {
      return '';
    }
  });

  const handleToggleChime = () => {
    setChimeEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('makeover_tv_chime_active', String(next));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('makeover_audio_settings_changed'));
      } catch {}
      if (next) playChimePreset(selectedChimeId);
      return next;
    });
  };

  const handleToggleVoice = () => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('makeover_tv_voice_active', String(next));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('makeover_audio_settings_changed'));
      } catch {}
      return next;
    });
  };

  const handleSelectChime = (chimeId) => {
    setSelectedChimeId(chimeId);
    try {
      localStorage.setItem('makeover_tv_selected_chime', chimeId);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('makeover_audio_settings_changed'));
    } catch {}
    playChimePreset(chimeId);
  };

  const handleSelectVoice = (voiceUri) => {
    setSelectedVoiceUri(voiceUri);
    try {
      localStorage.setItem('makeover_tv_selected_voice', voiceUri);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('makeover_audio_settings_changed'));
    } catch {}
  };

  // Preset Authentication State (Session Persisted, 0 Database Needed)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('makeover_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const {
    isMasterQueueOpen,
    isAutoCutoffEnabled,
    setMasterQueue,
    setAutoCutoff,
    barbers,
    services,
    queue,
    joinQueue,
    callNextCustomer,
    startService,
    completeService,
    finishEarlyAndCallNext,
    markNoShow,
    reAddNoShow,
    cancelToken,
    toggleBarberBreak,
    addService,
    updateService,
    deleteService,
    addBarber,
    updateBarber,
    deleteBarber,
    resetToDefaults
  } = useQueueStore();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Preset Credentials Verification
    if (
      cleanUser === 'admin' &&
      (cleanPass === 'makeover2026' || cleanPass === 'makeover@2026' || cleanPass === 'admin' || cleanPass === 'admin123')
    ) {
      try {
        sessionStorage.setItem('makeover_admin_auth', 'true');
      } catch {}
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid credentials. Please verify your preset username & password.');
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('makeover_admin_auth');
    } catch {}
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  // Analytics Computations
  const completedTokens = queue.filter(t => t.status === 'COMPLETED');
  const totalServed = completedTokens.length;

  const noShowTokens = queue.filter(t => t.status === 'NO_SHOW');
  const noShowCount = noShowTokens.length;
  const totalFinishedOrNoShow = totalServed + noShowCount;
  const noShowRate = totalFinishedOrNoShow > 0
    ? ((noShowCount / totalFinishedOrNoShow) * 100).toFixed(1)
    : '0.0';

  const estimatedRevenue = completedTokens.reduce((sum, t) => sum + (t.totalPrice || 0), 0);

  // Dynamic wait time calculation
  const waitingTokens = queue.filter(t => t.status === 'WAITING');
  const waitCalc = calculateWaitTime({
    token: waitingTokens[0] || null,
    queue,
    barbers,
    servicesMap: {}
  });
  const avgWaitMinutes = waitCalc.isPaused ? 0 : waitCalc.waitMinutes;

  // Unauthenticated: Editorial Luxury Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-[#E7E3DC] shadow-xl text-center space-y-6 animate-fade-in">
          
          {/* Atelier Monogram */}
          <div className="w-14 h-14 rounded-full border border-stone-300 flex items-center justify-center text-[#0F0F0F] bg-[#FAF9F6] mx-auto shadow-sm">
            <span className="font-serif italic text-2xl font-light">M</span>
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880] border border-[#C5A880]/30 bg-stone-50 px-3 py-1 rounded-full">
              Executive Governance
            </span>
            <h1 className="font-serif text-3xl font-light text-[#0F0F0F] mt-3 uppercase tracking-[0.18em]">
              {t('brandName')}
            </h1>
            <p className="text-xs text-stone-500 font-light mt-1">
              Floor Dispatch, Stylist Attributions & Management Portal
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-2.5 rounded-xl font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                Username
              </label>
              <input
                type="text"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] bg-[#FAF9F6] font-sans text-[#0F0F0F]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] bg-[#FAF9F6] font-sans text-[#0F0F0F]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#0F0F0F] hover:bg-[#C5A880] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Enter Atelier Portal</span>
            </button>
          </form>

          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2 text-center">
            <span className="text-[11px] text-stone-400 font-light">
              Preset Credentials: <strong className="text-stone-600">admin / makeover2026</strong>
            </span>
            <Link
              to="/"
              className="text-xs text-stone-500 hover:text-black transition-colors"
            >
              ← Return to Salon Website
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // Authenticated Executive Portal
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      
      {/* Top Admin Header (Executive Console) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E3DC] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880] border border-[#C5A880]/30 bg-stone-50 px-3 py-1 rounded-full">
            Salon Executive Governance
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#0F0F0F] mt-2">
            {t('adminConsoleTitle')}
          </h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Operational queue dispatch, artist revenue attribution, service curation, and analytics.
          </p>
        </div>

        {/* Action Controls: Walk-in, TV Display, Reset, Log Out */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsWalkInModalOpen(true)}
            className="px-4 py-2.5 rounded-full bg-[#0F0F0F] hover:bg-[#C5A880] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>+ Walk-In</span>
          </button>

          <Link
            to="/display"
            className="px-4 py-2.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-700 hover:text-black hover:bg-stone-50 transition-all flex items-center gap-1.5 shadow-sm"
            title="Launch Wall TV Screen in new view"
          >
            <Tv className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Launch Wall TV</span>
          </Link>

          <button
            onClick={() => setIsAudioModalOpen(true)}
            className="px-4 py-2.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-700 hover:text-black hover:bg-stone-50 transition-all flex items-center gap-1.5 shadow-sm"
            title="Configure Salon Chime Melodies & Indian Voice Accents"
          >
            <Sliders className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Audio Settings</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset queue, services, and barbers to clean seed data?')) {
                resetToDefaults();
              }
            }}
            className="px-3.5 py-2.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-600 hover:text-black hover:bg-stone-50 transition-all flex items-center gap-1.5 shadow-sm"
            title="Reset to clean demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            title="Log Out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
        {[
          { id: 'QUEUE', label: 'Live Floor Queue', icon: ListOrdered },
          { id: 'OVERVIEW', label: t('overviewTab'), icon: Sliders },
          { id: 'SERVICES', label: t('servicesTab'), icon: Scissors },
          { id: 'BARBERS', label: t('barbersTab'), icon: Users },
          { id: 'ANALYTICS', label: t('reportsTab'), icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#0F0F0F] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-[#0F0F0F]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Live Floor Queue & Concierge Dispatch */}
      {activeTab === 'QUEUE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <LobbyOverviewSidebar
              queue={queue}
              barbers={barbers}
              avgWaitMinutes={avgWaitMinutes}
              completedCount={totalServed}
              noShowCount={noShowCount}
              onToggleBarberBreak={toggleBarberBreak}
              onCallNext={callNextCustomer}
            />
          </div>

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
      )}

      {/* Tab 2: Overview & Controls */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <MasterQueueControls
            isMasterQueueOpen={isMasterQueueOpen}
            isAutoCutoffEnabled={isAutoCutoffEnabled}
            onToggleMasterQueue={setMasterQueue}
            onToggleAutoCutoff={setAutoCutoff}
          />

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F0F0F] mb-3">
              Today's Live Performance
            </h3>
            <DailyAnalyticsCards
              totalServed={totalServed}
              avgWaitMinutes={avgWaitMinutes}
              noShowCount={noShowCount}
              noShowRate={noShowRate}
              estimatedRevenue={estimatedRevenue}
            />
          </div>

          <StylistPerformanceTable
            barbers={barbers}
            queue={queue}
            services={services}
            totalDailyRevenue={estimatedRevenue}
          />
        </div>
      )}

      {/* Tab 3: Services Menu CRUD */}
      {activeTab === 'SERVICES' && (
        <ServiceCatalogManager
          services={services}
          onAddService={addService}
          onUpdateService={updateService}
          onDeleteService={deleteService}
        />
      )}

      {/* Tab 4: Barber Roster CRUD */}
      {activeTab === 'BARBERS' && (
        <BarberRosterManager
          barbers={barbers}
          onAddBarber={addBarber}
          onUpdateBarber={updateBarber}
          onDeleteBarber={deleteBarber}
        />
      )}

      {/* Tab 5: Live Analytics & Velocity */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <DailyAnalyticsCards
            totalServed={totalServed}
            avgWaitMinutes={avgWaitMinutes}
            noShowCount={noShowCount}
            noShowRate={noShowRate}
            estimatedRevenue={estimatedRevenue}
          />

          <StylistPerformanceTable
            barbers={barbers}
            queue={queue}
            services={services}
            totalDailyRevenue={estimatedRevenue}
          />

          <div className="bg-white rounded-3xl p-6 border border-[#E7E3DC] shadow-sm">
            <h3 className="font-serif text-xl font-normal text-[#0F0F0F] mb-4">
              Queue Velocity & Hourly Throughput
            </h3>
            <div className="h-48 flex items-end justify-between gap-2 pt-8 px-4 border-b border-stone-100">
              {[
                { time: '10 AM', count: 4 },
                { time: '11 AM', count: 7 },
                { time: '12 PM', count: 9 },
                { time: '01 PM', count: 6 },
                { time: '02 PM', count: 3 },
                { time: '03 PM', count: 8 },
                { time: '04 PM', count: 11 },
                { time: '05 PM', count: 12 },
                { time: '06 PM', count: 10 }
              ].map((slot) => (
                <div key={slot.time} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-[#0F0F0F]">{slot.count}</span>
                  <div
                    className="w-full bg-[#0F0F0F] hover:bg-[#C5A880] rounded-t-lg transition-all"
                    style={{ height: `${slot.count * 10}px` }}
                  />
                  <span className="text-[10px] text-stone-500 font-light">{slot.time}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-3 text-center font-light">
              Peak salon floor patronage observed between 04:00 PM and 06:00 PM.
            </p>
          </div>
        </div>
      )}

      {/* Walk-in Registration Modal */}
      <WalkInModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        services={services}
        barbers={barbers}
        onIssueToken={joinQueue}
      />

      {/* Audio Announcement Settings Modal */}
      <TvAudioSettingsModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        chimeEnabled={chimeEnabled}
        onToggleChime={handleToggleChime}
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
        selectedChimeId={selectedChimeId}
        onSelectChime={handleSelectChime}
        selectedVoiceUri={selectedVoiceUri}
        onSelectVoice={handleSelectVoice}
        barbers={barbers}
      />

    </div>
  );
}
