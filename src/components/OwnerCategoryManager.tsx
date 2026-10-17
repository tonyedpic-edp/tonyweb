import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FolderPlus, Tag, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import {
  getEffectiveCategories,
  addCustomCategory,
  deleteCustomCategory,
  getEffectiveMenuItems,
} from '../data/ownerStore';
import { MenuCategory, MENU_CATEGORIES } from '../data/menu';

interface OwnerCategoryManagerProps {
  onNotify: (text: string, type?: 'success' | 'error') => void;
}

export const OwnerCategoryManager: React.FC<OwnerCategoryManagerProps> = ({ onNotify }) => {
  const [categories, setCategories] = useState<MenuCategory[]>(getEffectiveCategories());
  const [nameTh, setNameTh] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descTh, setDescTh] = useState('');
  const [descEn, setDescEn] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync when menu/categories updated
  useEffect(() => {
    const refresh = () => {
      setCategories(getEffectiveCategories());
    };
    window.addEventListener('tonys_menu_updated', refresh);
    return () => window.removeEventListener('tonys_menu_updated', refresh);
  }, []);

  const menuItems = getEffectiveMenuItems();

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameTh.trim()) {
      onNotify('กรุณาระบุชื่อหมวดหมู่ภาษาไทย', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create clean URL-friendly id
      const slugBase = (nameEn.trim() || nameTh.trim())
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      const uniqueId = slugBase ? `cat-${slugBase}-${Date.now().toString().slice(-4)}` : `cat-${Date.now()}`;

      const newCategory: MenuCategory = {
        id: uniqueId,
        nameTh: nameTh.trim(),
        nameEn: nameEn.trim() || nameTh.trim(),
        descriptionTh: descTh.trim() || `เมนูในหมวดหมู่ ${nameTh.trim()}`,
        descriptionEn: descEn.trim() || `Selection of dishes in ${nameEn.trim() || nameTh.trim()}`,
      };

      addCustomCategory(newCategory);
      setCategories(getEffectiveCategories());
      setNameTh('');
      setNameEn('');
      setDescTh('');
      setDescEn('');
      onNotify(`เพิ่มหมวดหมู่ "${newCategory.nameTh}" เรียบร้อยแล้ว!`);
    } catch {
      onNotify('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = (cat: MenuCategory) => {
    if (cat.id === 'all') {
      onNotify('ไม่สามารถลบหมวดหมู่ "ทุกหมวดหมู่" ได้', 'error');
      return;
    }

    const defaultIds = MENU_CATEGORIES.map((c) => c.id);
    const isDefault = defaultIds.includes(cat.id);

    const confirmMsg = isDefault
      ? `ต้องการลบหมวดหมู่ "${cat.nameTh}" ออกจากหน้าแสดงผลใช่หรือไม่?`
      : `คุณแน่ใจว่าต้องการลบหมวดหมู่ "${cat.nameTh}" ใช่หรือไม่?`;

    if (window.confirm(confirmMsg)) {
      deleteCustomCategory(cat.id);
      setCategories(getEffectiveCategories());
      onNotify(`ลบหมวดหมู่ "${cat.nameTh}" เรียบร้อยแล้ว`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Box */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4.5 sm:p-5 flex items-start gap-3.5">
        <FolderPlus className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-[#111827]">
            จัดการหมวดหมู่เมนูอาหาร (Manage Menu Categories)
          </h4>
          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed font-sans">
            คุณสามารถเพิ่มหมวดหมู่ใหม่ เช่น &quot;ของทานเล่น&quot;, &quot;เครื่องดื่ม&quot;, หรือ &quot;ชุดสุดคุ้ม&quot; หมวดหมู่ที่เพิ่มจะแสดงบนแท็บตัวกรองหน้าเมนูอาหารทันที
          </p>
        </div>
      </div>

      {/* Form: Add New Category */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <Plus className="w-4 h-4 text-[#EA580C]" />
          <h4 className="font-bold text-sm text-gray-900">
            เพิ่มหมวดหมู่ใหม่ (+ Add Category)
          </h4>
        </div>

        <form onSubmit={handleAddCategory} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                ชื่อหมวดหมู่ (ภาษาไทย) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nameTh}
                onChange={(e) => setNameTh(e.target.value)}
                placeholder="เช่น ของทานเล่น, เครื่องดื่ม, กับแกล้ม"
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                ชื่อหมวดหมู่ (ภาษาอังกฤษ)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Appetizers, Drinks & Desserts"
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                คำอธิบายหมวดหมู่ (ภาษาไทย)
              </label>
              <input
                type="text"
                value={descTh}
                onChange={(e) => setDescTh(e.target.value)}
                placeholder="คำอธิบายสั้นๆ เกี่ยวกับรายการอาหารในหมวดนี้"
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                คำอธิบายหมวดหมู่ (ภาษาอังกฤษ)
              </label>
              <input
                type="text"
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder="Short description for English speakers"
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-[#FACC15]" />
              <span>บันทึกและเพิ่มหมวดหมู่ใหม่</span>
            </button>
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#EA580C]" />
            <span>รายการหมวดหมู่ทั้งหมด ({categories.length} หมวด)</span>
          </h4>
          <span className="text-[11px] text-gray-500">
            แสดงเรียงตามลำดับที่จะปรากฏบนหน้าเว็บ
          </span>
        </div>

        <div className="space-y-2.5">
          {categories.map((cat, idx) => {
            const count =
              cat.id === 'all'
                ? menuItems.length
                : menuItems.filter((m) => m.categoryId === cat.id).length;
            const isProtectedAll = cat.id === 'all';

            return (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors shadow-2xs gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#111827]">
                        {cat.nameTh}
                      </span>
                      <span className="text-xs text-gray-400 font-sans">
                        / {cat.nameEn}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {count} เมนู
                      </span>
                      {isProtectedAll && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> หมวดหมู่หลัก
                        </span>
                      )}
                    </div>
                    {cat.descriptionTh && (
                      <p className="text-xs text-gray-500 truncate mt-0.5 font-sans">
                        {cat.descriptionTh}
                      </p>
                    )}
                  </div>
                </div>

                {!isProtectedAll && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
                    title={`ลบหมวดหมู่ ${cat.nameTh}`}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
