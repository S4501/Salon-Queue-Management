import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Bell,
  Play,
  Check,
  X,
  Sparkles,
  Sliders
} from 'lucide-react';
import {
  CHIME_PRESETS,
  playChimePreset,
  getIndianVoices,
  speakCustomerAnnouncement
} from '../../utils/audioChime';

export default function TvAudioSettingsModal({
  isOpen,
  onClose,
  chimeEnabled,
  onToggleChime,
  voiceEnabled,
  onToggleVoice,
  selectedChimeId,
  onSelectChime,
  selectedVoiceUri,
  onSelectVoice,
  barbers = []
}) {
  const { language, t } = useLanguage();
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isTestPlaying, setIsTestPlaying] = useState(false);
  const [activePreviewChime, setActivePreviewChime] = useState(null);

  // Load and refresh available speech voices
  useEffect(() => {
    const updateVoices = () => {
      const voices = getIndianVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  // Preview an individual chime
  const handlePreviewChime = (chimeId, e) => {
    e.stopPropagation();
    setActivePreviewChime(chimeId);
    playChimePreset(chimeId);
    setTimeout(() => setActivePreviewChime(null), 1200);
  };

  // Test full announcement with user's chosen chime and Indian voice
  const handleTestFullAnnouncement = () => {
    setIsTestPlaying(true);
    const sampleToken = {
      id: 'T-104',
      customerName: 'Harshil Joshi',
      assignedBarberId: 'barber-2'
    };
    const sampleBarber = barbers.find(b => b.id === 'barber-2') || barbers[0] || { chair: 2, name: 'Vikram Solanki' };

    speakCustomerAnnouncement({
      token: sampleToken,
      barber: sampleBarber,
      language,
      chimeId: selectedChimeId,
      voiceUri: selectedVoiceUri,
      playChime: chimeEnabled,
      playVoice: voiceEnabled,
      onComplete: () => {
        setIsTestPlaying(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FAF9F6] rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-stone-200 shadow-2xl relative text-[#0F0F0F] max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880] border border-[#C5A880]/30 bg-white px-3 py-1 rounded-full">
            Acoustics & Voice Settings
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#0F0F0F] mt-2">
            {t('audioSettingsModalTitle')}
          </h2>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            {t('audioSettingsSub')}
          </p>
        </div>

        <div className="space-y-6">
          
          {/* =========================================================================
              SECTION 1: CHIME ALERT SETTINGS
          ========================================================================== */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
            {/* Chime Master Toggle */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${chimeEnabled ? 'bg-[#0F0F0F] text-[#C5A880]' : 'bg-stone-100 text-stone-400'}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0F0F0F]">
                    {t('enableChimeToggle')}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-light">
                    {t('enableChimeDesc')}
                  </p>
                </div>
              </div>

              {/* iOS / Toggle Switch */}
              <button
                type="button"
                onClick={onToggleChime}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  chimeEnabled ? 'bg-[#0F0F0F]' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    chimeEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Chime Presets List */}
            {chimeEnabled && (
              <div className="space-y-2 pt-1">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 block">
                  {t('selectChimeHeader')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CHIME_PRESETS.map((preset) => {
                    const isSelected = selectedChimeId === preset.id;
                    const isPreviewing = activePreviewChime === preset.id;
                    const displayName = t(preset.nameKey) || preset.defaultName;
                    const displayDesc = t(preset.descKey) || preset.defaultDesc;

                    return (
                      <div
                        key={preset.id}
                        onClick={() => onSelectChime(preset.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-[#0F0F0F] bg-stone-50 shadow-sm ring-1 ring-[#0F0F0F]'
                            : 'border-stone-200 bg-white hover:border-[#C5A880]'
                        }`}
                      >
                        <div className="pr-2">
                          <p className="text-xs font-semibold text-[#0F0F0F]">
                            {displayName}
                          </p>
                          <p className="text-[10px] text-stone-500 font-light line-clamp-1 mt-0.5">
                            {displayDesc}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Mini Preview Play Button */}
                          <button
                            type="button"
                            onClick={(e) => handlePreviewChime(preset.id, e)}
                            className={`p-1.5 rounded-full border transition-colors ${
                              isPreviewing
                                ? 'bg-[#C5A880] text-black border-[#C5A880]'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                            }`}
                            title="Preview Chime Sound"
                          >
                            <Play className="w-3 h-3 fill-current" />
                          </button>

                          {/* Selection indicator */}
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-[#0F0F0F] border-[#0F0F0F] text-white' : 'border-stone-300'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              SECTION 2: SPOKEN NAME ANNOUNCEMENT (INDIAN VOICE)
          ========================================================================== */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
            {/* Voice Master Toggle */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${voiceEnabled ? 'bg-[#0F0F0F] text-[#C5A880]' : 'bg-stone-100 text-stone-400'}`}>
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0F0F0F]">
                    {t('enableVoiceToggle')}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-light">
                    {t('enableVoiceDesc')}
                  </p>
                </div>
              </div>

              {/* iOS / Toggle Switch */}
              <button
                type="button"
                onClick={onToggleVoice}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  voiceEnabled ? 'bg-[#0F0F0F]' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    voiceEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Indian Voice Selector Dropdown */}
            {voiceEnabled && (
              <div className="space-y-2 pt-1">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 block">
                  {t('selectVoiceHeader')}
                </label>

                {availableVoices.length > 0 ? (
                  <select
                    value={selectedVoiceUri || ''}
                    onChange={(e) => onSelectVoice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-medium text-[#0F0F0F] bg-[#FAF9F6] outline-none focus:border-[#C5A880]"
                  >
                    <option value="">Default Indian Accent Voice (Automatic)</option>
                    {availableVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200 font-light">
                    Default natural browser speech engine initialized for Indian English pronunciation.
                  </p>
                )}

                <p className="text-[10px] text-stone-400 font-light pt-0.5">
                  Calibrated to 0.89x room cadence for warm, dignified salon floor acoustics.
                </p>
              </div>
            )}
          </div>

          {/* =========================================================================
              SECTION 3: TEST FULL ANNOUNCEMENT & FINISH
          ========================================================================== */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              disabled={isTestPlaying || (!chimeEnabled && !voiceEnabled)}
              onClick={handleTestFullAnnouncement}
              className={`flex-1 w-full py-3.5 px-6 rounded-full text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
                isTestPlaying
                  ? 'bg-[#C5A880] text-black animate-pulse'
                  : !chimeEnabled && !voiceEnabled
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-[#0F0F0F] hover:bg-[#C5A880] text-white active:scale-95'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isTestPlaying ? t('testingVoice') : t('testFullCallBtn')}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3.5 px-8 rounded-full border border-stone-300 text-xs uppercase tracking-wider font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
            >
              {t('confirm')}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
