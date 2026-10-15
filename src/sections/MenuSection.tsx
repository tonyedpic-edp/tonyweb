import React, { useState, useMemo } from 'react';
import { Utensils } from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '../data/menu';
import { Language, TRANSLATIONS } from '../data/translations';
import { MenuFilter } from '../components/MenuFilter';
import { MenuCard } from '../components/MenuCard';

interface MenuSectionProps {
  currentLang: Language;
  onSelectItem: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ currentLang, onSelectItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const t = TRANSLATIONS[currentLang];

  // Filter items by category and text search
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return MENU_ITEMS.filter((item) => {
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
  }, [selectedCategory, searchQuery]);

  return (
    <section id="menu" className="py-18 sm:py-24 bg-[#FAF7F2] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#1F382E] mb-3">
            <Utensils className="w-3.5 h-3.5 text-[#C89B3C]" />
            <span>{t.menu.kicker}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#18181A] mb-4 [text-wrap:balance]">
            {t.menu.title}
          </h2>

          <p className="text-base text-[#615A4F] leading-relaxed max-w-2xl mx-auto">
            {t.menu.subtitle}
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <MenuFilter
          currentLang={currentLang}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Menu Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                currentLang={currentLang}
                onSelect={onSelectItem}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-[#FFFFFF] rounded-2xl border border-[#E5DDD0] shadow-2xs">
            <Utensils className="w-10 h-10 text-[#A39B8F] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl font-bold text-[#18181A] mb-1">
              {t.menu.noResultsTitle}
            </h3>
            <p className="text-xs text-[#6B6458] mb-6 leading-relaxed">
              {t.menu.noResultsDesc}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-[#FAF7F2] bg-[#1F382E] hover:bg-[#162720] rounded-lg transition-colors cursor-pointer"
            >
              {t.menu.resetSearch}
            </button>
          </div>
        )}

        {/* Verified Pricing Note */}
        <div className="mt-12 text-center text-xs text-[#8C8375]">
          <p>{t.menu.verifiedPriceNote}</p>
        </div>
      </div>
    </section>
  );
};
