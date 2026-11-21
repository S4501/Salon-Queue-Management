import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Users,
  TrendingUp,
  Award,
  Scissors,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  PieChart
} from 'lucide-react';

export default function StylistPerformanceTable({
  barbers,
  queue,
  services,
  totalDailyRevenue
}) {
  const { language, t } = useLanguage();

  const serviceMap = services.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  // Calculate metrics per stylist
  const performanceData = barbers.map((barber) => {
    // Completed tokens assigned to this barber
    const attendedTokens = queue.filter(
      (t) =>
        t.status === 'COMPLETED' &&
        (t.assignedBarberId === barber.id || (!t.assignedBarberId && t.preferredBarberId === barber.id))
    );

    const clientsAttended = attendedTokens.length;
    const revenueContributed = attendedTokens.reduce((sum, t) => sum + (t.totalPrice || 0), 0);

    const revenueShare =
      totalDailyRevenue > 0
        ? Number(((revenueContributed / totalDailyRevenue) * 100).toFixed(1))
        : 0;

    const avgTicket =
      clientsAttended > 0 ? Math.round(revenueContributed / clientsAttended) : 0;

    // Current service
    const activeToken =
      barber.currentServiceToken && barber.status === 'BUSY'
        ? queue.find((t) => t.id === barber.currentServiceToken && ['IN_SERVICE', 'CALLED'].includes(t.status))
        : null;

    // Services breakdown count
    const servicesCount = {};
    attendedTokens.forEach((tok) => {
      tok.services.forEach((sid) => {
        const s = serviceMap[sid];
        const sName = s
          ? language === 'gu' && s.gujaratiName
            ? s.gujaratiName
            : s.name
          : sid;
        servicesCount[sName] = (servicesCount[sName] || 0) + 1;
      });
    });

    return {
      barber,
      clientsAttended,
      revenueContributed,
      revenueShare,
      avgTicket,
      activeToken,
      servicesCount,
      attendedTokens
    };
  });

  // Find top performer by revenue
  const topPerformer = [...performanceData].sort(
    (a, b) => b.revenueContributed - a.revenueContributed
  )[0];

  const totalClientsAttended = performanceData.reduce(
    (sum, p) => sum + p.clientsAttended,
    0
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E3DC] shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-sans font-medium block">
            Artist Attribution
          </span>
          <h3 className="font-serif text-2xl font-light text-[#0F0F0F]">
            {t('stylistPerformanceTitle')}
          </h3>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            {t('stylistPerformanceSub')}
          </p>
        </div>

        {/* Top Performer Badge */}
        {topPerformer && topPerformer.revenueContributed > 0 && (
          <div className="bg-[#FAF9F6] border border-[#C5A880]/50 rounded-2xl p-3 px-5 flex items-center gap-3.5 shrink-0 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-[#0F0F0F] text-[#C5A880] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C5A880] block">
                Top Contributor Today
              </span>
              <span className="font-serif text-sm font-normal text-[#0F0F0F]">
                {language === 'gu' && topPerformer.barber.gujaratiName
                  ? topPerformer.barber.gujaratiName
                  : topPerformer.barber.name} ({t('currency')}{topPerformer.revenueContributed.toLocaleString()})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Stylist Breakdown Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px] tracking-wider">
              <th className="py-3 px-3">Stylist / Chair</th>
              <th className="py-3 px-3 text-center">{t('clientsAttendedCol')}</th>
              <th className="py-3 px-3">{t('revenueContributedCol')}</th>
              <th className="py-3 px-3">{t('revenueShareCol')}</th>
              <th className="py-3 px-3 text-right">{t('avgTicketCol')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {performanceData.map((item) => {
              const b = item.barber;
              const barberDisplayName =
                language === 'gu' && b.gujaratiName ? b.gujaratiName : b.name;

              return (
                <tr key={b.id} className="hover:bg-stone-50/60 transition-colors">
                  
                  {/* Stylist info */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.avatar}
                        alt={b.name}
                        className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0 grayscale contrast-125"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base font-normal text-[#0F0F0F]">
                            {barberDisplayName}
                          </span>
                          <span className="text-[10px] font-light text-stone-400">
                            (Chair 0{b.chair})
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-light">
                          {b.specialty}
                        </p>
                        
                        {/* Current in-chair tag */}
                        {item.activeToken && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-medium text-stone-800 bg-stone-100 px-2 py-0.5 rounded-full mt-1 border border-stone-200">
                            <Clock className="w-2.5 h-2.5 text-[#C5A880]" />
                            {t('inChairNowBadge')}: {item.activeToken.id} ({item.activeToken.customerName})
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Clients Attended Count */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-serif text-xl font-light text-[#0F0F0F] text-tabular">
                        {item.clientsAttended}
                      </span>
                      <span className="text-[10px] text-stone-400 font-light">
                        {item.clientsAttended === 1 ? 'client' : 'clients'}
                      </span>
                    </div>
                  </td>

                  {/* Revenue Contributed */}
                  <td className="py-3.5 px-3">
                    <div>
                      <span className="font-serif text-lg font-normal text-emerald-800 text-tabular">
                        {t('currency')}{item.revenueContributed.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-stone-400 font-light">
                        Contributed gross
                      </p>
                    </div>
                  </td>

                  {/* Revenue Share Bar */}
                  <td className="py-3.5 px-3 min-w-[140px]">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-medium text-[#0F0F0F]">
                        <span>{item.revenueShare}%</span>
                        <span className="text-[10px] text-stone-400">of salon total</span>
                      </div>
                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#C5A880] to-[#0F0F0F] transition-all duration-500 rounded-full"
                          style={{ width: `${Math.min(100, item.revenueShare)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Avg Ticket Value */}
                  <td className="py-3.5 px-3 text-right">
                    <span className="font-serif text-base font-light text-[#0F0F0F] text-tabular">
                      {t('currency')}{item.avgTicket}
                    </span>
                    <span className="block text-[10px] text-stone-400 font-light">
                      per guest avg
                    </span>
                  </td>

                </tr>
              );
            })}
          </tbody>

          {/* Footer Totals Row */}
          <tfoot>
            <tr className="border-t-2 border-stone-300 bg-[#FAF9F6] font-semibold">
              <td className="py-4 px-3 uppercase tracking-wider text-xs text-[#0F0F0F]">
                {t('totalRow')}
              </td>
              <td className="py-4 px-3 text-center font-serif text-xl font-light text-[#0F0F0F] text-tabular">
                {totalClientsAttended}
              </td>
              <td className="py-4 px-3 font-serif text-xl font-light text-emerald-800 text-tabular">
                {t('currency')}{totalDailyRevenue.toLocaleString()}
              </td>
              <td className="py-4 px-3 text-xs text-stone-500 font-light">
                100% Floor Allocation
              </td>
              <td className="py-4 px-3 text-right font-serif text-base font-light text-[#0F0F0F] text-tabular">
                {totalClientsAttended > 0
                  ? `${t('currency')}${Math.round(totalDailyRevenue / totalClientsAttended)}`
                  : '--'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
}
