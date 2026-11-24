import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Plus, Coffee, Trash2 } from 'lucide-react';

export default function BarberRosterManager({
  barbers,
  onAddBarber,
  onUpdateBarber,
  onDeleteBarber
}) {
  const { language, t } = useLanguage();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    gujaratiName: '',
    chair: barbers.length + 1,
    specialty: 'Styling & Grooming',
    avatar: '/images/artists/chris-mcmillan.jpg'
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name) return;
    onAddBarber({
      ...form,
      chair: Number(form.chair)
    });
    setIsAddOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E3DC] shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-sans font-medium block">
            Artist Collective
          </span>
          <h3 className="font-serif text-2xl font-light text-[#0F0F0F]">
            {t('barberRosterTitle')}
          </h3>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            {barbers.length} stylists active on floor
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-5 py-2.5 rounded-full bg-[#0F0F0F] hover:bg-[#C5A880] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('addNewBarberBtn')}</span>
        </button>
      </div>

      {/* Barber Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {barbers.map((b) => {
          const isBreak = b.status === 'ON_BREAK';

          return (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                isBreak ? 'border-rose-100 bg-rose-50/40' : 'border-[#F3E8E2] bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={b.avatar}
                  alt={b.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#F3E8E2]"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#12183A]">
                    {language === 'gu' && b.gujaratiName ? b.gujaratiName : b.name}
                  </h4>
                  <p className="text-xs text-[#595F72]">
                    Chair #{b.chair} • {b.specialty}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isBreak ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isBreak ? t('onBreak') : t('barberStatusAvailable')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateBarber(b.id, { status: isBreak ? 'AVAILABLE' : 'ON_BREAK' })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isBreak
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  }`}
                >
                  {isBreak ? t('resumeShiftBtn') : t('toggleBreakBtn')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Barber Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#12183A]/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#F3E8E2] shadow-2xl">
            <h4 className="text-base font-bold text-[#12183A] mb-4">
              {t('addNewBarberBtn')}
            </h4>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Stylist Name (English)</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F3E8E2] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Stylist Name (Gujarati)</label>
                <input
                  type="text"
                  value={form.gujaratiName}
                  onChange={(e) => setForm({ ...form, gujaratiName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F3E8E2] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Chair Number</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={form.chair}
                  onChange={(e) => setForm({ ...form, chair: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F3E8E2] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Specialty</label>
                <input
                  type="text"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F3E8E2] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#F3E8E2] font-semibold text-[#12183A]"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#EE7A68] text-white font-bold"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
