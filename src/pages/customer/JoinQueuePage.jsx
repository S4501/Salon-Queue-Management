import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { estimateNewWaitTime } from '../../utils/waitTimeCalculator';
import ServiceSelector from '../../components/customer/ServiceSelector';
import BarberRadioGroup from '../../components/customer/BarberRadioGroup';
import ZeroBarberNotice from '../../components/common/ZeroBarberNotice';
import { ArrowLeft, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export default function JoinQueuePage() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const {
    services,
    barbers,
    queue,
    joinQueue,
    isMasterQueueOpen
  } = useQueueStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState(['srv-1']); // default Haircut
  const [preferredBarberId, setPreferredBarberId] = useState('ANY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorState, setErrorState] = useState({ msg: '', existingTokenId: null });

  const activeBarbers = barbers.filter(b => b.status !== 'ON_BREAK');
  const allOnBreak = activeBarbers.length === 0;

  // Selected services calculation
  const selectedServices = services.filter(s => selectedServiceIds.includes(s.id));
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);

  // Dynamic preview wait estimate
  const waitEst = estimateNewWaitTime({
    serviceDuration: totalDuration,
    preferredBarberId,
    queue,
    barbers
  });

  const handleToggleService = (id) => {
    setSelectedServiceIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(s => s !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  };

  // Form validity checks
  const isNameValid = customerName.trim().length >= 2;
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const isPhoneValid = cleanPhone.length === 10;
  const isServicesValid = selectedServiceIds.length > 0 && selectedServiceIds.length <= 3;
  const isFormReady = isNameValid && isPhoneValid && isServicesValid && isMasterQueueOpen && !isSubmitting;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorState({ msg: '', existingTokenId: null });

    if (!isFormReady) return;

    setIsSubmitting(true);

    try {
      const newToken = joinQueue({
        customerName: customerName.trim(),
        phone: cleanPhone,
        serviceIds: selectedServiceIds,
        preferredBarberId,
        source: 'REMOTE'
      });

      // Save to localStorage for quick resume
      try {
        localStorage.setItem('glamoursync_last_token', newToken.id);
      } catch {
        // ignore
      }

      // Navigate to status tracker
      navigate(`/status/${newToken.id}`);
    } catch (err) {
      setIsSubmitting(false);
      if (err.message === 'DUPLICATE_PHONE') {
        setErrorState({
          msg: t('duplicatePhoneError', { token: err.existingTokenId }),
          existingTokenId: err.existingTokenId
        });
      } else if (err.message === 'BARBER_ON_BREAK') {
        setErrorState({
          msg: t('barberOnBreakError'),
          existingTokenId: null
        });
      } else if (err.message === 'QUEUE_PAUSED') {
        setErrorState({
          msg: t('queuePausedNotice'),
          existingTokenId: null
        });
      } else {
        setErrorState({
          msg: 'Unable to reserve spot in queue. Please try again.',
          existingTokenId: null
        });
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 sm:py-6">
      
      {/* Top Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-500 hover:text-[#0F0F0F] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('backToHome')}</span>
        </Link>
      </div>

      {allOnBreak && <ZeroBarberNotice />}

      {/* Main Form Card (Editorial Luxury Atelier) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E3DC] shadow-xl">
        
        <div className="mb-8">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C5A880] border border-[#C5A880]/30 bg-stone-50 px-3 py-1 rounded-full">
            Remote Waitlist Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#0F0F0F] mt-3">
            {t('joinQueueTitle')}
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-light leading-relaxed">
            {t('joinQueueSubtitle')}
          </p>
        </div>

        {/* Duplicate Phone / Error Banner */}
        {errorState.msg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <p className="font-bold">{errorState.msg}</p>
            {errorState.existingTokenId && (
              <Link
                to={`/status/${errorState.existingTokenId}`}
                className="inline-block mt-2 font-bold text-[#C5A880] underline"
              >
                {t('clickToTrack')}
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 1: Customer Info */}
          <div className="space-y-4">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F0F0F] block">
              {t('step1Details')}
            </label>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                {t('fullNameLabel')} *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t('fullNamePlaceholder')}
                className="w-full px-4 py-3.5 rounded-xl border border-stone-300 text-sm focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none transition-all bg-[#FAF9F6] text-[#0F0F0F]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                {t('phoneLabel')} *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-xs font-bold text-stone-500">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder={t('phonePlaceholder')}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-stone-300 text-sm focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none transition-all font-mono bg-[#FAF9F6] text-[#0F0F0F]"
                />
              </div>
              {phone && cleanPhone.length !== 10 && (
                <p className="text-[11px] text-rose-600 mt-1">
                  {t('phoneValidationMsg')}
                </p>
              )}
            </div>
          </div>

          {/* Step 2: Multi-Service Selector (Max 3) */}
          <ServiceSelector
            services={services}
            selectedIds={selectedServiceIds}
            onToggle={handleToggleService}
          />

          {/* Step 3: Preferred Barber Selection */}
          <BarberRadioGroup
            barbers={barbers}
            selectedBarberId={preferredBarberId}
            onSelect={setPreferredBarberId}
            queue={queue}
          />

          {/* Step 4: Estimated Wait Preview Box */}
          <div className="bg-[#F5F3EF] rounded-2xl p-4 border border-[#E7E3DC] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E7E3DC] text-[#C5A880] flex items-center justify-center shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 block">
                  {t('estWaitPreview')}
                </span>
                <span className="font-serif text-lg font-normal text-[#0F0F0F]">
                  {waitEst.isPaused ? 'Queue Paused' : `~${waitEst.waitMinutes} ${t('minutesAbbr')}`}
                </span>
              </div>
            </div>

            <div className="text-right text-[11px] text-stone-500">
              <span className="font-semibold block">{selectedServiceIds.length} services</span>
              <span>{totalDuration} mins</span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={!isFormReady}
            className={`w-full py-4 px-6 rounded-full font-semibold text-xs uppercase tracking-[0.22em] shadow-lg transition-all flex items-center justify-center gap-2 ${
              isFormReady
                ? 'bg-[#0F0F0F] hover:bg-[#C5A880] text-white active:scale-98'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isSubmitting ? (
              <span>{t('joiningBtn')}</span>
            ) : (
              <span>{t('confirmAndJoinBtn')}</span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
