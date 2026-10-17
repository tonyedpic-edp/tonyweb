import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Utensils, FolderPlus, Camera, Plus, CheckCircle2, Store } from 'lucide-react';
import { MenuItem, MenuCategory } from '../data/menu';
import {
  getEffectiveMenuItems,
  getEffectiveCategories,
  updateMenuItemDishImage,
  optimizeImageFile,
} from '../data/ownerStore';
import { Language, TRANSLATIONS } from '../data/translations';
import { MenuFilter } from '../components/MenuFilter';
import { MenuCard } from '../components/MenuCard';

interface MenuSectionProps {
  currentLang: Language;
  onSelectItem: (item: MenuItem) => void;
  onOpenOwner?: (tab?: 'categories' | 'dishes') => void;
  isOwner?: boolean;
  onLogoutOwner?: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  currentLang,
  onSelectItem,
  onOpenOwner,
  isOwner = false,
  onLogoutOwner,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(getEffectiveMenuItems());
  const [categories, setCategories] = useState<MenuCategory[]>(getEffectiveCategories());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hidden direct file input for instant 1-click card photo replacement
  const directCardFileInputRef = useRef<HTMLInputElement>(null);
  const [pendingDishId, setPendingDishId] = useState<string | null>(null);

  const t = TRANSLATIONS[currentLang];

  // Subscribe to live menu and category updates
  useEffect(() => {
    const handleUpdate = () => {
      setMenuItems(getEffectiveMenuItems());
      setCategories(getEffectiveCategories());
    };
    window.addEventListener('tonys_menu_updated', handleUpdate);
    return () => window.removeEventListener('tonys_menu_updated', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Direct 1-Click Card Image Upload Handler
  const handleCardEditImage = (item: MenuItem) => {
    setPendingDishId(item.id);
    if (directCardFileInputRef.current) {
      directCardFileInputRef.current.value = '';
      directCardFileInputRef.current.click();
    }
  };

  const handleDirectFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingDishId) return;

    if (!file.type.startsWith('image/')) {
      showToast('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)');
      return;
    }

    try {
      const base64 = await optimizeImageFile(file, 1200, 1200, 0.85);
      if (base64) {
        updateMenuItemDishImage(pendingDishId, base64);
        setMenuItems(getEffectiveMenuItems());
        const item = menuItems.find((d) => d.id === pendingDishId);
        showToast(`เปลี่ยนรูปเมนู "${item ? item.nameTh : 'อาหาร'}" สำเร็จเรียบร้อย!`);
      }
    } catch {
      showToast('เกิดข้อผิดพลาดในการโหลดรูปภาพ');
    } finally {
      setPendingDishId(null);
    }
  };

  // Filter items by category and text search
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return menuItems.filter((item) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || item.categoryId === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      // Dual-language text search across dish names and descriptions
      const nameEnMatch = item.nameEn.toLowerCase().includes(q);
      const nameThMatch = item.nameTh.toLowerCase().includes(q);
      const descEnMatch = item.descriptionEn ? item.descriptionEn.toLowerCase().includes(q) : false;
      const descThMatch = item.descriptionTh ? item.descriptionTh.toLowerCase().includes(q) : false;

      return nameEnMatch || nameThMatch || descEnMatch || descThMatch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  return (
    <section id="menu" className="py-18 sm:py-24 bg-[#0B0F17] border-b border-gray-800/80">
      {/* Hidden file input for 1-click card photo update */}
      <input
        type="file"
        ref={directCardFileInputRef}
        onChange={handleDirectFilePicked}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#111827] text-white px-4.5 py-3 rounded-2xl shadow-xl border border-[#F59E0B] flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-[#FACC15] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#EA580C] mb-3">
            <Utensils className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{t.menu.kicker}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 [text-wrap:balance]">
            {t.menu.title}
          </h2>

          <p className="text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t.menu.subtitle}
          </p>
        </div>

        {/* Owner Management Banner & Quick Controls (Visible ONLY to Owner when logged in) */}
        {isOwner && (
          <div className="max-w-4xl mx-auto mb-8 p-4 sm:p-5 rounded-2xl bg-[#111827] border border-amber-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-black text-[#FACC15] flex items-center justify-center shrink-0 shadow-xs border border-amber-400/50">
                <Store className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-xs sm:text-sm text-white">
                    {currentLang === 'th' ? 'โหมดแก้ไขสำหรับเจ้าของร้าน (Owner Mode)' : 'Owner Edit Tools'}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black text-[#FACC15] border border-amber-400/30">
                    {categories.length - 1} หมวดหมู่ • {menuItems.length} เมนู
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 mt-0.5 font-sans">
                  {currentLang === 'th'
                    ? 'ปุ่มแก้ไขรูปภาพและเครื่องมือจัดการจะแสดงเฉพาะคุณ (ลูกค้าทั่วไปจะไม่เห็นปุ่มแก้ไขใดๆ)'
                    : 'Edit tools are visible only to you. Customers will not see any edit buttons.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => onOpenOwner?.('categories')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black hover:bg-gray-900 text-white text-xs font-bold border border-gray-700 shadow-2xs hover:border-[#EA580C] transition-all cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>{currentLang === 'th' ? '+ เพิ่มหมวดหมู่' : '+ Add Category'}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenOwner?.('dishes')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>{currentLang === 'th' ? 'ใส่-เปลี่ยนรูป / จัดการเมนู' : 'Photos & Dishes'}</span>
              </button>

              {onLogoutOwner && (
                <button
                  type="button"
                  onClick={onLogoutOwner}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  title="ออกจากโหมดแก้ไข"
                >
                  {currentLang === 'th' ? 'ออกจากโหมดแก้ไข' : 'Exit Owner Mode'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Search & Dynamic Category Filter Controls */}
        <MenuFilter
          currentLang={currentLang}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={categories}
        />

        {/* Menu Cards Grid with Direct Photo Edit Support */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                currentLang={currentLang}
                onSelect={onSelectItem}
                onEditImage={isOwner ? handleCardEditImage : undefined}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-[#111827] rounded-2xl border border-gray-800 shadow-xl">
            <Utensils className="w-10 h-10 text-gray-500 mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl font-bold text-white mb-1">
              {t.menu.noResultsTitle}
            </h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              {t.menu.noResultsDesc}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg transition-colors cursor-pointer"
            >
              {t.menu.resetSearch}
            </button>
          </div>
        )}

        {/* Verified Pricing Note */}
        <div className="mt-12 text-center text-xs text-gray-400">
          <p>{t.menu.verifiedPriceNote}</p>
        </div>
      </div>
    </section>
  );
};

