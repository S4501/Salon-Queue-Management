import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Coffee, AlertCircle } from 'lucide-react';

export default function ZeroBarberNotice() {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 shadow-sm mb-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <Coffee className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-rose-900">
            {t('allStylistsBreak')}
          </h4>
          <p className="text-xs text-rose-700 mt-0.5">
            {t('allStylistsBreakSub')}
          </p>
        </div>
      </div>
    </div>
  );
}
