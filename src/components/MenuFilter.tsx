import React from 'react';
import { Search, X } from 'lucide-react';
import { MENU_CATEGORIES } from '../data/menu';
import { Language, TRANSLATIONS } from '../data/translations';

interface MenuFilterProps {
  currentLang: Language;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const MenuFilter: React.FC<MenuFilterProps> = ({
  currentLang,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="space-y-4 mb-12 max-w-4xl mx-auto">
      {/* Live Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#736B5E]">
          <Search className="w-4 h-4" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.menu.searchPlaceholder}
          aria-label={t.menu.searchPlaceholder}
          className="w-full pl-11 pr-11 py-3.5 text-sm bg-[#FFFFFF] border border-[#D5C9B7] rounded-xl text-[#18181A] placeholder-[#8C8375] focus:outline-hidden focus:ring-2 focus:ring-[#1F382E] focus:border-transparent transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search query"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8C8375] hover:text-[#18181A] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div
        role="tablist"
        aria-label="Menu Categories"
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-medium"
      >
        {MENU_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const categoryName = currentLang === 'th' ? cat.nameTh : cat.nameEn;

          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F382E] ${
                isActive
                  ? 'bg-[#1F382E] text-[#FAF7F2] font-semibold shadow-xs'
                  : 'bg-[#EAE3D6] text-[#4A453E] hover:bg-[#DDD3C2] hover:text-[#18181A]'
              }`}
            >
              {categoryName}
            </button>
          );
        })}
      </div>
    </div>
  );
};
