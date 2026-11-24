import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Plus, Coffee, Trash2, Edit2, X, Image as ImageIcon } from 'lucide-react';

export default function BarberRosterManager({
  barbers,
  onAddBarber,
  onUpdateBarber,
  onDeleteBarber
}) {
  const { language, t } = useLanguage();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);

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
      chair: Number(form.chair),
      customEdited: true
    });
    setIsAddOpen(false);
  };

  const handleOpenEdit = (b) => {
    setEditingBarber({
      id: b.id,
      name: b.name || '',
      gujaratiName: b.gujaratiName || '',
      chair: b.chair || 1,
      specialty: b.specialty || '',
      avatar: b.avatar || '/images/artists/chris-mcmillan.jpg'
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingBarber || !editingBarber.name) return;
    onUpdateBarber(editingBarber.id, {
      name: editingBarber.name.trim(),
      gujaratiName: (editingBarber.gujaratiName || '').trim(),
      chair: Number(editingBarber.chair),
      specialty: (editingBarber.specialty || '').trim(),
      avatar: (editingBarber.avatar || '').trim(),
      customEdited: true
    });
    setEditingBarber(null);
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

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:text-black hover:bg-stone-50 transition-all flex items-center gap-1.5 shadow-2xs"
                  title={t('editBtn')}
                >
                  <Edit2 className="w-3 h-3 text-[#C5A880]" />
                  <span>{t('editBtn')}</span>
                </button>

                <button
                  onClick={() => onUpdateBarber(b.id, { status: isBreak ? 'AVAILABLE' : 'ON_BREAK', customEdited: true })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isBreak
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  }`}
                >
                  {isBreak ? t('resumeShiftBtn') : t('toggleBreakBtn')}
                </button>

                {barbers.length > 1 && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove ${b.name} from the active roster?`)) {
                        onDeleteBarber(b.id);
                      }
                    }}
                    className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                    title={t('deleteBtn')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Barber Modal */}
      {editingBarber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0F0F]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E7E3DC] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-sans font-medium block">
                  Stylist Profile
                </span>
                <h4 className="font-serif text-xl font-light text-[#0F0F0F] mt-0.5">
                  Edit Stylist Details
                </h4>
              </div>
              <button
                onClick={() => setEditingBarber(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Live Avatar Preview */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#FAF9F6] border border-stone-200">
                <img
                  src={editingBarber.avatar || '/images/artists/chris-mcmillan.jpg'}
                  alt={editingBarber.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#C5A880] shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = '/images/artists/chris-mcmillan.jpg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#0F0F0F] text-xs truncate">
                    {editingBarber.name || 'Stylist Preview'}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate">
                    Station #{editingBarber.chair} • {editingBarber.specialty}
                  </p>
                  <span className="text-[9px] text-[#C5A880] uppercase tracking-wider font-semibold">
                    Live Photo Preview
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                  Stylist Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingBarber.name}
                  onChange={(e) => setEditingBarber({ ...editingBarber, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#C5A880] bg-[#FAF9F6] text-[#0F0F0F] transition-colors"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                  Stylist Name (Gujarati)
                </label>
                <input
                  type="text"
                  value={editingBarber.gujaratiName}
                  onChange={(e) => setEditingBarber({ ...editingBarber, gujaratiName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#C5A880] bg-[#FAF9F6] text-[#0F0F0F] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Station / Chair #
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={editingBarber.chair}
                    onChange={(e) => setEditingBarber({ ...editingBarber, chair: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#C5A880] bg-[#FAF9F6] text-[#0F0F0F]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Specialty / Role
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBarber.specialty}
                    onChange={(e) => setEditingBarber({ ...editingBarber, specialty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#C5A880] bg-[#FAF9F6] text-[#0F0F0F]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                  Photo URL or Image Path
                </label>
                <input
                  type="text"
                  value={editingBarber.avatar}
                  placeholder="/images/artists/chris-mcmillan.jpg or https://..."
                  onChange={(e) => setEditingBarber({ ...editingBarber, avatar: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#C5A880] bg-[#FAF9F6] text-[#0F0F0F] font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingBarber(null)}
                  className="px-5 py-2.5 rounded-full border border-stone-200 font-medium text-stone-600 hover:bg-stone-50 transition-colors uppercase tracking-wider text-[10px]"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#0F0F0F] hover:bg-[#C5A880] text-white font-semibold uppercase tracking-wider text-[10px] transition-colors shadow-sm"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
