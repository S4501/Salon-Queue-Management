import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldAlert, Clock, Power, ShieldCheck } from 'lucide-react';

export default function MasterQueueControls({
  isMasterQueueOpen,
  isAutoCutoffEnabled,
  onToggleMasterQueue,
  onToggleAutoCutoff
}) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* Master Queue Switch Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E7E3DC] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F0F0F]">
              {t('masterQueueControl')}
            </h3>
            <span className={`w-2.5 h-2.5 rounded-full ${isMasterQueueOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          </div>
          <p className="text-xs text-stone-500 font-light">
            {t('masterQueueDesc')}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
          <span className={`text-xs font-medium ${isMasterQueueOpen ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isMasterQueueOpen ? t('queueAccepting') : t('queuePaused')}
          </span>

          <button
            onClick={() => onToggleMasterQueue(!isMasterQueueOpen)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              isMasterQueueOpen
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-[#0F0F0F] text-white hover:bg-[#C5A880]'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isMasterQueueOpen ? 'Pause Queue' : 'Resume Queue'}</span>
          </button>
        </div>
      </div>

      {/* 30-Minute Auto-Cutoff Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E7E3DC] shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F0F0F]">
              {t('autoCutoffTitle')}
            </h3>
            <Clock className="w-4 h-4 text-[#C5A880]" />
          </div>
          <p className="text-xs text-stone-500 font-light">
            {t('autoCutoffDesc')}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs font-medium text-stone-700">
            {isAutoCutoffEnabled ? 'Auto-Close Active (08:30 PM)' : 'Auto-Close Disabled'}
          </span>

          <button
            onClick={() => onToggleAutoCutoff(!isAutoCutoffEnabled)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shadow-sm active:scale-95 ${
              isAutoCutoffEnabled
                ? 'bg-[#0F0F0F] text-white hover:bg-stone-800'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            {isAutoCutoffEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

    </div>
  );
}
