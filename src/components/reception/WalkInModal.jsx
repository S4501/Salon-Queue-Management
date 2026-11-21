import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, Sparkles, User, Phone, Check, Coffee, Zap } from 'lucide-react';

export default function WalkInModal({
  isOpen,
  onClose,
  services,
  barbers,
  onIssueToken
}) {
  const { language, t } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState(['srv-1']);
  const [preferredBarberId, setPreferredBarberId] = useState('ANY');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-reset barber selection to 'ANY' if currently selected barber is on break
  useEffect(() => {
    if (preferredBarberId !== 'ANY') {
      const b = barbers.find(item => item.id === preferredBarberId);
      if (b && b.status === 'ON_BREAK') {
        setPreferredBarberId('ANY');
      }
    }
  }, [barbers, preferredBarberId]);

  if (!isOpen) return null;

  const handleQuickGuestName = () => {
    const randomGuestNum = Math.floor(100 + Math.random() * 900);
    setCustomerName(`Walk-in Guest ${randomGuestNum}`);
  };

  const handleToggleService = (id) => {
    setSelectedServiceIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const finalName = customerName.trim() || 'Walk-in Guest';

    if (selectedServiceIds.length === 0) {
      setErrorMsg('Please select at least 1 service.');
      return;
    }

    if (preferredBarberId !== 'ANY') {
      const selectedBarber = barbers.find(b => b.id === preferredBarberId);
      if (selectedBarber && selectedBarber.status === 'ON_BREAK') {
        setErrorMsg(t('barberOnBreakError'));
        return;
      }
    }

    try {
      onIssueToken({
        customerName: finalName,
        phone: phone.trim() || '9825000000',
        serviceIds: selectedServiceIds,
        preferredBarberId,
        source: 'WALK_IN'
      });
      onClose();
    } catch (err) {
      if (err.message === 'DUPLICATE_PHONE') {
        setErrorMsg(`An active token (${err.existingTokenId}) already exists for this phone number.`);
      } else if (err.message === 'BARBER_ON_BREAK') {
        setErrorMsg(t('barberOnBreakError'));
      } else {
        setErrorMsg('Failed to issue token. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FAF9F6] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl relative max-h-[90vh] overflow-y-auto text-[#0F0F0F]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880] border border-[#C5A880]/30 bg-white px-3 py-1 rounded-full">
            Front Desk Fast Intake
          </span>
          <h3 className="font-serif text-2xl font-light text-[#0F0F0F] mt-2">
            {t('walkInModalTitle')}
          </h3>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Customer Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-stone-700">
                {t('fullNameLabel')}
              </label>
              <button
                type="button"
                onClick={handleQuickGuestName}
                className="text-[11px] font-semibold text-[#C5A880] hover:underline uppercase tracking-wider"
              >
                + {t('walkInQuickGuest')}
              </button>
            </div>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t('fullNamePlaceholder')}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none bg-white font-sans text-[#0F0F0F]"
            />
          </div>

          {/* Phone (Optional for Walk-In) */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">
              {t('optionalPhone')}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 98250 12345"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none bg-white font-mono text-[#0F0F0F]"
            />
          </div>

          {/* Quick Select Services */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-2">
              {t('quickSelectServices')} ({selectedServiceIds.length}/3)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {services.filter(s => s.active !== false).map((srv) => {
                const isSelected = selectedServiceIds.includes(srv.id);
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => handleToggleService(srv.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'border-[#0F0F0F] bg-white font-semibold text-[#0F0F0F] shadow-sm ring-1 ring-[#0F0F0F]'
                        : 'border-stone-200 bg-white/70 text-stone-600 hover:bg-white'
                    }`}
                  >
                    <span className="truncate">
                      {language === 'gu' && srv.gujaratiName ? srv.gujaratiName : srv.name}
                    </span>
                    <span className="text-[11px] text-[#C5A880] shrink-0 font-medium ml-1">
                      {srv.duration}m
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Barber Selection */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-stone-700">
                {t('step3Barber')}
              </label>
              <span className="text-[11px] text-stone-500 font-light">
                {barbers.filter(b => b.status !== 'ON_BREAK').length} of {barbers.length} on duty
              </span>
            </div>

            {/* Dropdown with disabled on-break options */}
            <select
              value={preferredBarberId}
              onChange={(e) => setPreferredBarberId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs font-medium text-[#0F0F0F] bg-white outline-none focus:border-[#C5A880]"
            >
              <option value="ANY">{t('anyBarberOption')} (⚡ Fastest Available)</option>
              {barbers.map(b => {
                const isBreak = b.status === 'ON_BREAK';
                return (
                  <option
                    key={b.id}
                    value={b.id}
                    disabled={isBreak}
                    className={isBreak ? 'text-stone-400 bg-stone-50' : ''}
                  >
                    {language === 'gu' && b.gujaratiName ? b.gujaratiName : b.name} ({t('chairLabel')} 0{b.chair})
                    {isBreak ? ` - [🚫 ${t('onBreak')} / Unavailable]` : ' - Available'}
                  </option>
                );
              })}
            </select>

            {/* Visual Quick Barber Chips */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPreferredBarberId('ANY')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                  preferredBarberId === 'ANY'
                    ? 'border-[#0F0F0F] bg-white font-semibold text-[#0F0F0F] ring-1 ring-[#0F0F0F]'
                    : 'border-stone-200 bg-white/70 text-stone-600 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0F0F0F] text-[#C5A880] flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="truncate">{t('fastestTag')} (Any)</span>
                </div>
              </button>

              {barbers.map(b => {
                const isBreak = b.status === 'ON_BREAK';
                const isSelected = preferredBarberId === b.id;

                return (
                  <button
                    key={b.id}
                    type="button"
                    disabled={isBreak}
                    onClick={() => setPreferredBarberId(b.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'border-[#0F0F0F] bg-white font-semibold text-[#0F0F0F] ring-1 ring-[#0F0F0F]'
                        : isBreak
                        ? 'border-stone-200 bg-stone-100 opacity-40 cursor-not-allowed text-stone-400'
                        : 'border-stone-200 bg-white/70 text-stone-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={b.avatar}
                        alt={b.name}
                        className="w-6 h-6 rounded-full object-cover border border-stone-200 shrink-0 grayscale contrast-125"
                      />
                      <span className="truncate">
                        {language === 'gu' && b.gujaratiName ? b.gujaratiName : b.name}
                      </span>
                    </div>

                    {isBreak && (
                      <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5 shrink-0 ml-1">
                        <Coffee className="w-3 h-3" />
                        <span>Break</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-full bg-[#0F0F0F] hover:bg-[#C5A880] text-white font-medium text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all mt-6"
          >
            {t('issueTokenBtn')}
          </button>

        </form>
      </div>
    </div>
  );
}
