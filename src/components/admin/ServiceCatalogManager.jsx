import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

export default function ServiceCatalogManager({
  services,
  onAddService,
  onUpdateService,
  onDeleteService
}) {
  const { language, t } = useLanguage();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    gujaratiName: '',
    duration: 30,
    price: 300,
    category: 'Hair'
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      gujaratiName: '',
      duration: 30,
      price: 300,
      category: 'Hair'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    onAddService({
      ...formData,
      duration: Number(formData.duration),
      price: Number(formData.price),
      active: true
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E3DC] shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-sans font-medium block">
            Menu Offerings
          </span>
          <h3 className="font-serif text-2xl font-light text-[#0F0F0F]">
            {t('serviceCatalogTitle')}
          </h3>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            {services.length} services configured in salon menu
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-full bg-[#0F0F0F] hover:bg-[#C5A880] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('addNewServiceBtn')}</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#F3E8E2] text-[#595F72] uppercase font-bold text-[10px] tracking-wider">
              <th className="py-3 px-2">{t('serviceNameCol')}</th>
              <th className="py-3 px-2">{t('durationCol')}</th>
              <th className="py-3 px-2">{t('priceCol')}</th>
              <th className="py-3 px-2">{t('statusCol')}</th>
              <th className="py-3 px-2 text-right">{t('actionsCol')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3E8E2]">
            {services.map((srv) => {
              const isEditing = editingServiceId === srv.id;

              return (
                <tr key={srv.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-2 font-bold text-[#12183A]">
                    {language === 'gu' && srv.gujaratiName ? srv.gujaratiName : srv.name}
                    <span className="block text-[10px] text-[#595F72] font-normal">
                      {srv.name} {srv.gujaratiName ? `• ${srv.gujaratiName}` : ''}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {srv.duration} {t('minutesAbbr')}
                  </td>
                  <td className="py-3 px-2 font-bold text-[#EE7A68]">
                    {t('currency')} {srv.price}
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => onUpdateService(srv.id, { active: !srv.active })}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${srv.active !== false
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                      {srv.active !== false ? t('activeStatus') : t('inactiveStatus')}
                    </button>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => onDeleteService(srv.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                      title={t('deleteBtn')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#12183A]/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#F3E8E2] shadow-2xl">
            <h4 className="text-base font-bold text-[#12183A] mb-4">
              {t('addNewServiceBtn')}
            </h4>
            <form onSubmit={handleSaveNew} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Service Name (English)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F3E8E2] outline-none focus:border-[#EE7A68]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Service Name (Gujarati)</label>
                <input
                  type="text"
                  value={formData.gujaratiName}
                  onChange={(e) => setFormData({ ...formData, gujaratiName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F3E8E2] outline-none focus:border-[#EE7A68]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F3E8E2] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="50"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F3E8E2] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
