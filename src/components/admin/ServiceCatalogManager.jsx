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
  const [editingService, setEditingService] = useState(null);

  // Form states for Add
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

  const handleOpenEdit = (srv) => {
    setEditingService({
      id: srv.id,
      name: srv.name || '',
      gujaratiName: srv.gujaratiName || '',
      duration: srv.duration || 30,
      price: srv.price || 100,
      category: srv.category || 'Hair',
      active: srv.active !== false
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingService || !editingService.name) return;
    onUpdateService(editingService.id, {
      name: editingService.name.trim(),
      gujaratiName: (editingService.gujaratiName || '').trim(),
      duration: Number(editingService.duration),
      price: Number(editingService.price),
      category: editingService.category || 'Hair',
      active: editingService.active
    });
    setEditingService(null);
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
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(srv)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-black hover:bg-stone-100 transition-colors"
                        title={t('editBtn')}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteService(srv.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        title={t('deleteBtn')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0F0F]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E7E3DC] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-sans font-medium block">
                  Service Customization
                </span>
                <h4 className="font-serif text-xl font-light text-[#0F0F0F] mt-0.5">
                  Edit Service Offering
                </h4>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                  Service Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#C5A880] bg-[#FAF9F6] text-[#0F0F0F] transition-colors"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                  Service Name (Gujarati)
                </label>
                <input
                  type="text"
                  value={editingService.gujaratiName}
                  onChange={(e) => setEditingService({ ...editingService, gujaratiName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#C5A880] bg-[#FAF9F6] text-[#0F0F0F] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    required
                    value={editingService.duration}
                    onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#C5A880] bg-[#FAF9F6] text-[#0F0F0F]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#C5A880] bg-[#FAF9F6] text-[#0F0F0F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Category
                  </label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#C5A880] bg-[#FAF9F6] text-[#0F0F0F]"
                  >
                    <option value="Hair">Hair</option>
                    <option value="Beard">Beard</option>
                    <option value="Shaving">Shaving</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Massage">Massage</option>
                    <option value="Skincare">Skincare</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Service Status
                  </label>
                  <select
                    value={editingService.active ? 'active' : 'inactive'}
                    onChange={(e) => setEditingService({ ...editingService, active: e.target.value === 'active' })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#C5A880] bg-[#FAF9F6] text-[#0F0F0F]"
                  >
                    <option value="active">Active (Available)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
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
