import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Bell, MapPin, Sparkles } from 'lucide-react';

export default function CallAnnouncementBanner({ token, barber }) {
  const { language, t } = useLanguage();

  if (!token) return null;

  const barberName = barber
    ? (language === 'gu' && barber.gujaratiName ? barber.gujaratiName : barber.name)
    : 'Stylist';

  const chairNumber = barber ? barber.chair : '1';

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 animate-bounce">
      <div className="bg-[#0F0F0F] text-white rounded-3xl p-6 border-2 border-[#C5A880] shadow-2xl flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#C5A880] text-black flex items-center justify-center shrink-0 shadow-lg">
            <Bell className="w-7 h-7 fill-current animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-[#C5A880] block">
              {t('nowServingBanner')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-white mt-0.5">
              TOKEN {token.id} • {token.customerName}
            </h2>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-light">
            {t('proceedToChairAnnouncement')}
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-normal text-[#C5A880] flex items-center gap-2 justify-end mt-0.5">
            <MapPin className="w-5 h-5" />
            {t('chairText')} 0{chairNumber} ({barberName})
          </span>
        </div>

      </div>
    </div>
  );
}
