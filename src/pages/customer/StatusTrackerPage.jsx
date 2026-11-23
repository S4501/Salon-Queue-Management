import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { calculateWaitTime } from '../../utils/waitTimeCalculator';
import ApproachModal from '../../components/customer/ApproachModal';
import ZeroBarberNotice from '../../components/common/ZeroBarberNotice';
import {
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Share2,
  ArrowLeft,
  Scissors,
  Check
} from 'lucide-react';
import { playSoftPing } from '../../utils/audioChime';

export default function StatusTrackerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const {
    queue,
    barbers,
    services,
    cancelToken
  } = useQueueStore();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [hasAcknowledgedTurn, setHasAcknowledgedTurn] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const token = queue.find(tok => tok.id.toLowerCase() === (id || '').toLowerCase());

  // Services lookup
  const serviceMap = services.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  // Barbers lookup
  const barberMap = barbers.reduce((acc, b) => {
    acc[b.id] = b;
    return acc;
  }, {});

  // Compute position in queue
  const waitingTokens = queue.filter(t => t.status === 'WAITING');
  const myQueueIndex = waitingTokens.findIndex(t => t.id === token?.id);
  const position = myQueueIndex >= 0 ? myQueueIndex + 1 : 0;
  const peopleAhead = Math.max(0, position - 1);

  // Dynamic wait time calculation
  const waitCalc = token
    ? calculateWaitTime({ token, queue, barbers, servicesMap: serviceMap })
    : { waitMinutes: 0, isPaused: false };

  // Assigned or requested stylist
  const assignedBarber = token?.assignedBarberId ? barberMap[token.assignedBarberId] : null;
  const preferredBarber = token?.preferredBarberId !== 'ANY' ? barberMap[token?.preferredBarberId] : null;

  // Sound chime when position drops to 1
  useEffect(() => {
    if (position === 1 && token?.status === 'WAITING') {
      playSoftPing();
    }
  }, [position, token?.status]);

  // Auto-redirect if this token was re-added as a new sequential token
  useEffect(() => {
    if (token?.status === 'RE_ADDED' && token?.reAddedTokenId) {
      navigate(`/status/${token.reAddedTokenId}`, { replace: true });
    }
  }, [token?.status, token?.reAddedTokenId, navigate]);

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#12183A]">
          Token Not Found
        </h2>
        <p className="text-xs text-[#595F72]">
          We could not find a queue token matching "{id}".
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#12183A] text-white text-xs font-bold"
        >
          {t('backToHome')}
        </Link>
      </div>
    );
  }

  // Gracefully handle tokens that have been re-added under a new ID
  if (token.status === 'RE_ADDED' && token.reAddedTokenId) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF1ED] text-[#C5A880] flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-[#12183A]">
          Queue Spot Reinstated
        </h2>
        <p className="text-xs text-[#595F72]">
          Your token has been re-added to the live queue as <strong className="text-[#12183A]">#{token.reAddedTokenId}</strong>. Redirecting to your live tracker...
        </p>
        <Link
          to={`/status/${token.reAddedTokenId}`}
          className="inline-block px-5 py-2.5 rounded-xl bg-[#0F0F0F] text-white text-xs font-bold"
        >
          View Updated Token #{token.reAddedTokenId} →
        </Link>
      </div>
    );
  }

  const isCalled = token.status === 'CALLED';
  const isInService = token.status === 'IN_SERVICE';
  const isCompleted = token.status === 'COMPLETED';
  const isCancelled = token.status === 'CANCELLED';
  const isNoShow = token.status === 'NO_SHOW';
  const isApproaching = position === 1 && token.status === 'WAITING';

  // Copy shareable link
  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleConfirmCancel = () => {
    cancelToken(token.id);
    setIsCancelModalOpen(false);
    navigate('/');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 sm:py-6 space-y-4">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-500 hover:text-[#0F0F0F] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('backToHome')}</span>
        </Link>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E7E3DC] text-xs font-semibold text-[#0F0F0F] shadow-sm hover:border-[#C5A880] transition-colors"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#C5A880]" />}
          <span className="uppercase tracking-wider text-[10px]">{copiedLink ? 'Copied' : 'Share Ticket'}</span>
        </button>
      </div>

      {/* Turn Announcement Modal (slides in when CALLED) */}
      {isCalled && !hasAcknowledgedTurn && (
        <ApproachModal
          token={token}
          barber={assignedBarber || preferredBarber || barbers[0]}
          onAcknowledge={() => setHasAcknowledgedTurn(true)}
        />
      )}

      {/* Main Status Container */}
      <div className={`rounded-3xl p-6 sm:p-8 border transition-all ${
        isApproaching
          ? 'bg-[#FFF1ED] border-[#EE7A68] shadow-coral-glow'
          : isCalled
          ? 'bg-[#FFF1ED] border-[#EE7A68] shadow-coral-glow'
          : isCompleted
          ? 'bg-white border-emerald-300 shadow-sm'
          : isCancelled || isNoShow
          ? 'bg-white border-rose-200 opacity-90'
          : 'bg-white border-[#F3E8E2] shadow-card-soft'
      }`}>

        {/* Token Header Strip */}
        <div className="flex items-center justify-between border-b border-[#F3E8E2] pb-4 mb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#595F72]">
              {t('tokenIdLabel')}
            </span>
            <div className="text-3xl font-black font-mono text-[#12183A]">
              {token.id}
            </div>
            <p className="text-xs text-[#595F72] mt-0.5 font-medium">
              {token.customerName}
            </p>
          </div>

          <div className="text-right">
            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
              isCalled
                ? 'bg-[#EE7A68] text-white animate-pulse'
                : isInService
                ? 'bg-amber-500 text-white animate-pulse'
                : isCompleted
                ? 'bg-emerald-600 text-white'
                : isCancelled || isNoShow
                ? 'bg-rose-100 text-rose-800'
                : 'bg-[#12183A] text-white'
            }`}>
              {isCalled
                ? t('statusCalled')
                : isInService
                ? t('statusInService')
                : isCompleted
                ? t('statusCompleted')
                : isCancelled
                ? t('statusCancelled')
                : isNoShow
                ? t('statusNoShow')
                : t('statusInQueue')}
            </span>
          </div>
        </div>

        {/* Active In-Queue Position Showcase */}
        {token.status === 'WAITING' && (
          <div className="text-center py-4 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#595F72]">
              {t('yourQueuePosition')}
            </span>

            <div className="w-24 h-24 rounded-full bg-[#12183A] text-[#FFF1ED] flex items-center justify-center mx-auto text-4xl font-extrabold border-4 border-[#EE7A68] shadow-sm">
              #{position}
            </div>

            <p className="text-sm font-bold text-[#12183A]">
              {peopleAhead} {peopleAhead === 1 ? t('personAhead') : t('peopleAhead')}
            </p>

            {/* Approaching warning if position is 1 */}
            {isApproaching && (
              <div className="bg-[#FFF1ED] border border-[#EE7A68] rounded-2xl p-3 text-xs font-bold text-[#EE7A68] animate-bounce">
                ✨ {t('youAreNext')}
              </div>
            )}

            {/* Estimated Wait Countdown */}
            <div className="bg-[#FDF4F1] rounded-2xl p-4 border border-[#F3E8E2] flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#EE7A68]" />
                <span className="text-xs font-bold text-[#595F72]">
                  {t('estWaitHeading')}
                </span>
              </div>
              <div className="text-lg font-extrabold text-[#12183A]">
                {waitCalc.isPaused ? 'Queue Paused' : `~${waitCalc.waitMinutes} ${t('minutesAbbr')}`}
              </div>
            </div>
          </div>
        )}

        {/* CALLED / IN_SERVICE Details */}
        {(isCalled || isInService) && (
          <div className="py-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EE7A68] text-white flex items-center justify-center mx-auto">
              <Scissors className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-[#12183A]">
              {isCalled ? t('turnModalTitle') : t('statusInService')}
            </h3>

            <p className="text-xs text-[#595F72]">
              Stylist: <strong className="text-[#12183A]">
                {assignedBarber
                  ? (language === 'gu' && assignedBarber.gujaratiName ? assignedBarber.gujaratiName : assignedBarber.name)
                  : 'Assigned Stylist'}
              </strong> (Chair #{assignedBarber ? assignedBarber.chair : '1'})
            </p>
          </div>
        )}

        {/* COMPLETED Receipt Card */}
        {isCompleted && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-extrabold text-emerald-900">
              {t('serviceFinishedTitle')}
            </h3>

            <p className="text-xs text-[#595F72]">
              {t('serviceFinishedDesc')}
            </p>

            <div className="bg-[#FDF4F1] rounded-2xl p-4 border border-[#F3E8E2] flex items-center justify-between text-xs">
              <span className="font-bold text-[#595F72]">{t('totalBill')}</span>
              <span className="text-lg font-black text-[#12183A]">
                {t('currency')} {token.totalPrice}
              </span>
            </div>
          </div>
        )}

        {/* Selected Services & Barber Meta */}
        <div className="mt-6 pt-4 border-t border-[#F3E8E2] space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#595F72]">
            <span>{t('assignedStylistLabel')}</span>
            <strong className="text-[#12183A]">
              {assignedBarber
                ? (language === 'gu' && assignedBarber.gujaratiName ? assignedBarber.gujaratiName : assignedBarber.name)
                : preferredBarber
                ? (language === 'gu' && preferredBarber.gujaratiName ? preferredBarber.gujaratiName : preferredBarber.name)
                : t('anyBarberOption')}
            </strong>
          </div>

          <div className="flex items-start justify-between text-[#595F72]">
            <span>{t('servicesSelectedLabel')}</span>
            <span className="font-semibold text-right text-[#12183A] max-w-[220px]">
              {token.services.map(sid => {
                const s = serviceMap[sid];
                return s ? (language === 'gu' && s.gujaratiName ? s.gujaratiName : s.name) : sid;
              }).join(' + ')}
            </span>
          </div>
        </div>

        {/* Self-service cancellation button for waiting tokens */}
        {token.status === 'WAITING' && (
          <div className="mt-6 pt-4 border-t border-[#F3E8E2]">
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="w-full py-2.5 text-center text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
            >
              {t('cancelSpotBtn')}
            </button>
          </div>
        )}

      </div>

      {/* Cancellation Double-Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#12183A]/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#F3E8E2] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-[#12183A]">
              {t('cancelModalTitle')}
            </h3>

            <p className="text-xs text-[#595F72]">
              {t('cancelModalWarning', { token: token.id, pos: position })}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#F3E8E2] text-xs font-semibold text-[#12183A]"
              >
                {t('keepMySpotBtn')}
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                {t('confirmCancelBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
