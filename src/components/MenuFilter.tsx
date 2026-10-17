import React from 'react';
import { Search, X } from 'lucide-react';
import { MENU_CATEGORIES, MenuCategory } from '../data/menu';
import { Language, TRANSLATIONS } from '../data/translations';

interface MenuFilterProps {
  currentLang: Language;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories?: MenuCategory[];
}

export const MenuFilter: React.FC<MenuFilterProps> = ({
  currentLang,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  categories = MENU_CATEGORIES,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="space-y-4 mb-12 max-w-4xl mx-auto">
      {/* Live Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Search className="w-4 h-4" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.menu.searchPlaceholder}
          aria-label={t.menu.searchPlaceholder}
          className="w-full pl-11 pr-11 py-3.5 text-sm bg-[#111827] border border-gray-800 rounded-xl text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all shadow-xl"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search query"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white cursor-pointer"
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
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const categoryName = currentLang === 'th' ? cat.nameTh : cat.nameEn;

          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] ${
                isActive
                  ? 'bg-[#EA580C] text-white font-bold shadow-md border border-[#FACC15]/40'
                  : 'bg-[#111827] text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800'
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
