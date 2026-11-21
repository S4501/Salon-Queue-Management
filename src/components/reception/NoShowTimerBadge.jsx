import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Clock } from 'lucide-react';

export default function NoShowTimerBadge({ calledAt, onExpire }) {
  const { t } = useLanguage();
  const [remainingSecs, setRemainingSecs] = useState(600);

  useEffect(() => {
    if (!calledAt) return;

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - calledAt) / 1000);
      const rem = Math.max(0, 600 - elapsed);
      setRemainingSecs(rem);
      if (rem === 0 && onExpire) {
        onExpire();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [calledAt, onExpire]);

  const mins = Math.floor(remainingSecs / 60);
  const secs = remainingSecs % 60;
  const timerStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const isExpired = remainingSecs === 0;
  const isUrgent = remainingSecs < 120;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold tracking-tight ${
      isExpired
        ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
        : isUrgent
        ? 'bg-amber-100 text-amber-800 border border-amber-300'
        : 'bg-[#FFF1ED] text-[#EE7A68] border border-[#F3E8E2]'
    }`}>
      <Clock className="w-3.5 h-3.5" />
      <span>{isExpired ? t('graceExpired') : timerStr}</span>
    </div>
  );
}
