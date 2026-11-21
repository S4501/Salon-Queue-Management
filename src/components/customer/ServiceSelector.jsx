import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, Check } from 'lucide-react';

export default function ServiceSelector({ services, selectedIds, onToggle }) {
  const { language, t } = useLanguage();
  const maxReached = selectedIds.length >= 3;

  const totalDuration = services
    .filter(s => selectedIds.includes(s.id))
    .reduce((sum, s) => sum + s.duration, 0);

  const totalPrice = services
    .filter(s => selectedIds.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F0F0F]">
          {t('step2Services')}
        </label>
        <span className={`text-[11px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full ${maxReached ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'}`}>
          {t('selectedCount')}: {selectedIds.length}/3
        </span>
      </div>

      {maxReached && (
        <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
          <span>⚠️</span>
          <span>{t('maxServicesSelectedMsg')}</span>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.filter(s => s.active !== false).map((service) => {
          const isSelected = selectedIds.includes(service.id);
          const isDisabled = !isSelected && maxReached;

          return (
            <button
              key={service.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onToggle(service.id)}
              className={`text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between group ${
                isSelected
                  ? 'border-[#0F0F0F] bg-stone-50 shadow-sm ring-1 ring-[#0F0F0F]'
                  : isDisabled
                  ? 'border-stone-100 bg-stone-50 opacity-40 cursor-not-allowed'
                  : 'border-stone-200 bg-white hover:border-[#C5A880] hover:bg-stone-50/50'
              }`}
            >
              <div className="pr-2">
                <p className="text-xs font-medium text-[#0F0F0F] group-hover:text-[#C5A880] transition-colors">
                  {language === 'gu' && service.gujaratiName ? service.gujaratiName : service.name}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#C5A880]" />
                    {service.duration} {t('minutesAbbr')}
                  </span>
                  <span>•</span>
                  <span className="font-serif text-sm font-normal text-[#0F0F0F]">
                    {t('currency')}{service.price}
                  </span>
                </div>
              </div>

              {/* Checkbox indicator */}
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                isSelected
                  ? 'bg-[#0F0F0F] border-[#0F0F0F] text-white'
                  : 'border-stone-300 bg-white'
              }`}>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Summary Strip */}
      {selectedIds.length > 0 && (
        <div className="bg-[#0F0F0F] text-white rounded-2xl p-4 flex items-center justify-between text-xs shadow-md mt-3">
          <div>
            <span className="text-stone-400 block text-[10px] uppercase tracking-wider font-semibold">
              {t('totalDuration')}
            </span>
            <span className="font-medium text-sm text-[#C5A880] flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              {totalDuration} {t('minutesAbbr')}
            </span>
          </div>

          <div className="text-right">
            <span className="text-stone-400 block text-[10px] uppercase tracking-wider font-semibold">
              {t('estimatedCost')}
            </span>
            <span className="font-serif text-xl font-light text-white block mt-0.5">
              {t('currency')}{totalPrice}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
