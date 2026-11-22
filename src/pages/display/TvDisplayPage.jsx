import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { calculateWaitTime } from '../../utils/waitTimeCalculator';
import TvBarberCard from '../../components/display/TvBarberCard';
import TvUpcomingQueue from '../../components/display/TvUpcomingQueue';
import CallAnnouncementBanner from '../../components/display/CallAnnouncementBanner';
import TvAudioSettingsModal from '../../components/display/TvAudioSettingsModal';
import { Sparkles, Clock, Volume2, VolumeX, Mic, Play, Bell, Sliders } from 'lucide-react';
import {
  playChimePreset,
  speakCustomerAnnouncement
} from '../../utils/audioChime';

export default function TvDisplayPage() {
  const { language, t } = useLanguage();

  const {
    barbers,
    queue,
    services,
    lastCalledToken,
    lastCalledTimestamp
  } = useQueueStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCallAlert, setShowCallAlert] = useState(false);
  const [demoBannerToken, setDemoBannerToken] = useState(null);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Independent Chime Sound toggle (persisted)
  const [chimeEnabled, setChimeEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem('makeover_tv_chime_active');
      return stored !== 'false';
    } catch {
      return true;
    }
  });

  // Independent Voice Announcement toggle (persisted)
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem('makeover_tv_voice_active');
      return stored !== 'false';
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
      } catch {}
      if (next) {
        playChimePreset(selectedChimeId);
      }
      return next;
    });
  };

  const handleToggleVoice = () => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('makeover_tv_voice_active', String(next));
      } catch {}
      return next;
    });
  };

  const handleSelectChime = (chimeId) => {
    setSelectedChimeId(chimeId);
    try {
      localStorage.setItem('makeover_tv_selected_chime', chimeId);
    } catch {}
    playChimePreset(chimeId);
  };

  const handleSelectVoice = (voiceUri) => {
    setSelectedVoiceUri(voiceUri);
    try {
      localStorage.setItem('makeover_tv_selected_voice', voiceUri);
    } catch {}
  };

  // Demo Call Trigger
  const handlePlayVoiceDemo = () => {
    setIsDemoPlaying(true);
    const sampleToken = {
      id: 'T-104',
      customerName: 'Harshil Joshi',
      assignedBarberId: 'barber-2'
    };
    const sampleBarber = barbers.find((b) => b.id === 'barber-2') || barbers[0] || { chair: 2, name: 'Vikram Solanki' };

    setDemoBannerToken(sampleToken);

    speakCustomerAnnouncement({
      token: sampleToken,
      barber: sampleBarber,
      language,
      chimeId: selectedChimeId,
      voiceUri: selectedVoiceUri,
      playChime: chimeEnabled,
      playVoice: voiceEnabled,
      onComplete: () => {
        setIsDemoPlaying(false);
        setTimeout(() => setDemoBannerToken(null), 3000);
      }
    });
  };

  // Digital clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // When a real customer is called: show banner and announce according to active preferences
  useEffect(() => {
    if (lastCalledTimestamp && Date.now() - lastCalledTimestamp < 8000) {
      setShowCallAlert(true);
      if (lastCalledToken) {
        const assignedBarber = barbers.find((b) => b.id === lastCalledToken.assignedBarberId) || barbers[0];
        speakCustomerAnnouncement({
          token: lastCalledToken,
          barber: assignedBarber,
          language,
          chimeId: selectedChimeId,
          voiceUri: selectedVoiceUri,
          playChime: chimeEnabled,
          playVoice: voiceEnabled
        });
      }

      const timer = setTimeout(() => {
        setShowCallAlert(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [
    lastCalledTimestamp,
    chimeEnabled,
    voiceEnabled,
    selectedChimeId,
    selectedVoiceUri,
    lastCalledToken,
    barbers,
    language
  ]);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  // Waiting tokens
  const waitingTokens = queue.filter((t) => t.status === 'WAITING');

  const waitCalc = calculateWaitTime({
    token: waitingTokens[0] || null,
    queue,
    barbers,
    servicesMap: {}
  });

  const avgWaitMinutes = waitCalc.isPaused ? 0 : waitCalc.waitMinutes;

  const activeAlertToken = showCallAlert && lastCalledToken ? lastCalledToken : demoBannerToken;
  const activeAlertBarber = activeAlertToken
    ? barbers.find((b) => b.id === activeAlertToken.assignedBarberId)
    : null;

  return (
    <div className="h-screen w-screen bg-[#FAF9F6] p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none text-[#0F0F0F]">
      
      {/* High-Impact Slide-Down Call Announcement Banner (Works for Live Call & Voice Demo) */}
      {activeAlertToken && (
        <CallAnnouncementBanner
          token={activeAlertToken}
          barber={activeAlertBarber}
        />
      )}

      {/* 1080p Top Header Bar */}
      <header className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E7E3DC] shadow-sm flex items-center justify-between mb-4">
        {/* Salon Brand (MÈCHE Luxury Editorial Style) */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border border-stone-300 flex items-center justify-center text-[#0F0F0F] bg-[#FAF9F6] shadow-sm">
            <span className="font-serif italic text-xl font-light">M</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-light tracking-[0.2em] uppercase text-[#0F0F0F]">
                {t('wallDisplayTitle')}
              </h1>
              <span className="text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-[#C5A880] font-semibold">
                Lounge Display
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-light -mt-0.5">
              Live Floor Queue, Chimes & Indian Voice Announcer
            </p>
          </div>
        </div>

        {/* Right Section: Audio Settings, Demo Button & Digital Clock */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Audio Settings Modal Opener */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs uppercase tracking-wider font-semibold transition-all shadow-sm active:scale-95"
            title="Configure Chime Melodies & Indian Voice Accents"
          >
            <Sliders className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Audio Settings</span>
            <div className="flex items-center gap-1 pl-1 border-l border-stone-300">
              <span className={`w-2 h-2 rounded-full ${chimeEnabled ? 'bg-emerald-500' : 'bg-stone-300'}`} title="Chime Status" />
              <span className={`w-2 h-2 rounded-full ${voiceEnabled ? 'bg-[#C5A880]' : 'bg-stone-300'}`} title="Voice Status" />
            </div>
          </button>

          {/* 1-Click Demo Voice Call Button */}
          <button
            onClick={handlePlayVoiceDemo}
            disabled={isDemoPlaying || (!chimeEnabled && !voiceEnabled)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs uppercase tracking-wider font-semibold transition-all shadow-sm active:scale-95 ${
              isDemoPlaying
                ? 'bg-[#C5A880] text-black border-[#C5A880] animate-pulse cursor-wait'
                : !chimeEnabled && !voiceEnabled
                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                : 'bg-[#0F0F0F] text-white border-black hover:bg-stone-800'
            }`}
            title="Click to trigger a sample announcement call"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isDemoPlaying ? 'text-black' : 'text-[#C5A880]'}`} />
            <span>{isDemoPlaying ? t('testingVoice') : t('testVoiceDemoBtn')}</span>
          </button>

          {/* Digital Clock */}
          <div className="text-right pl-3 border-l border-stone-200">
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#0F0F0F] text-tabular">
              {formattedTime}
            </div>
            <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-widest">
              {formattedDate}
            </div>
          </div>

        </div>
      </header>

      {/* Main Split Screen: Left 60% Chairs, Right 40% Upcoming Queue */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        
        {/* Left 60% (7 Cols): 4 Barber Station Chairs */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F0F0F]">
              {t('nowServingHeader')}
            </h2>
            <span className="text-xs font-medium text-stone-500">
              4 Styling Stations
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5 flex-1">
            {barbers.map((barber) => {
              const currentToken = barber.currentServiceToken
                ? queue.find((t) => t.id === barber.currentServiceToken)
                : null;

              const isRecentlyCalled = lastCalledToken?.assignedBarberId === barber.id && showCallAlert;

              return (
                <TvBarberCard
                  key={barber.id}
                  barber={barber}
                  currentToken={currentToken}
                  services={services}
                  isRecentlyCalled={isRecentlyCalled}
                />
              );
            })}
          </div>
        </div>

        {/* Right 40% (5 Cols): Upcoming Queue */}
        <div className="lg:col-span-5 h-full">
          <TvUpcomingQueue
            waitingTokens={waitingTokens}
            queue={queue}
            barbers={barbers}
          />
        </div>

      </main>

      {/* Bottom Footer Info Strip */}
      <footer className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 font-light px-2">
        <div className="flex items-center gap-4">
          <span>📍 102 Heritage Plaza, Ahmedabad</span>
          <span>📞 +91 98765 43210</span>
        </div>
        <div>
          <span>Make Over Real-Time Queue Orchestration</span>
        </div>
      </footer>

      {/* Audio Settings Modal */}
      <TvAudioSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
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
