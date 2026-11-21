import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Users, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

export default function DailyAnalyticsCards({
  totalServed,
  avgWaitMinutes,
  noShowCount,
  noShowRate,
  estimatedRevenue
}) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Total Customers Served */}
      <div className="bg-white rounded-3xl p-6 border border-[#E7E3DC] shadow-sm">
        <div className="flex items-center justify-between text-stone-500 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            {t('statsTotalServed')}
          </span>
          <Users className="w-4 h-4 text-[#C5A880]" />
        </div>
        <div className="font-serif text-3xl sm:text-4xl font-light text-[#0F0F0F] text-tabular">
          {totalServed}
        </div>
        <p className="text-[11px] text-stone-400 mt-1 font-light">
          Clients attended today
        </p>
      </div>

      {/* Average Wait Time */}
      <div className="bg-white rounded-3xl p-6 border border-[#E7E3DC] shadow-sm">
        <div className="flex items-center justify-between text-stone-500 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            {t('statsAvgWait')}
          </span>
          <Clock className="w-4 h-4 text-[#C5A880]" />
        </div>
        <div className="font-serif text-3xl sm:text-4xl font-light text-[#0F0F0F] text-tabular">
          {avgWaitMinutes}m
        </div>
        <p className="text-[11px] text-stone-400 mt-1 font-light">
          Target under 25 mins
        </p>
      </div>

      {/* No-Show Rate */}
      <div className="bg-white rounded-3xl p-6 border border-[#E7E3DC] shadow-sm">
        <div className="flex items-center justify-between text-stone-500 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            {t('statsNoShowRate')}
          </span>
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        </div>
        <div className="font-serif text-3xl sm:text-4xl font-light text-[#0F0F0F] text-tabular">
          {noShowCount} <span className="text-sm font-sans text-stone-400">({noShowRate}%)</span>
        </div>
        <p className="text-[11px] text-stone-400 mt-1 font-light">
          Ejected after 10m grace
        </p>
      </div>

      {/* Estimated Revenue */}
      <div className="bg-white rounded-3xl p-6 border border-[#E7E3DC] shadow-sm">
        <div className="flex items-center justify-between text-stone-500 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            {t('statsEstRevenue')}
          </span>
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="font-serif text-3xl sm:text-4xl font-light text-[#0F0F0F] text-tabular">
          {t('currency')} {estimatedRevenue.toLocaleString()}
        </div>
        <p className="text-[11px] text-stone-400 mt-1 font-light">
          Gross floor earnings
        </p>
      </div>

    </div>
  );
}
