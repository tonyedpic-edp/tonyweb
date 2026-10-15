import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '../data/menu';
import { Language, TRANSLATIONS } from '../data/translations';
import { MenuCard } from '../components/MenuCard';

interface FeaturedDishesProps {
  currentLang: Language;
  onSelectItem: (item: MenuItem) => void;
}

export const FeaturedDishes: React.FC<FeaturedDishesProps> = ({ currentLang, onSelectItem }) => {
  const t = TRANSLATIONS[currentLang];
  const featuredItems = MENU_ITEMS.filter((item) => item.isFeatured);

  return (
    <section id="featured" className="py-18 sm:py-24 bg-[#F9FAFB] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#EA580C] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{t.featured.kicker}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111827] mb-4 [text-wrap:balance]">
            {t.featured.title}
          </h2>

          <p className="text-base text-[#4B5563] leading-relaxed max-w-2xl mx-auto">
            {t.featured.subtitle}
          </p>
        </div>

        {/* Featured Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredItems.map((dish) => (
            <MenuCard
              key={dish.id}
              item={dish}
              currentLang={currentLang}
              onSelect={onSelectItem}
            />
          ))}
        </div>

        {/* Action Link to Full Menu */}
        <div className="mt-14 text-center">
          <a
            href="#menu"
            className="inline-flex items-center gap-2.5 px-6 py-3 text-xs font-bold tracking-wider uppercase text-white bg-[#111827] hover:bg-black rounded-lg shadow-2xs hover:shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{currentLang === 'th' ? 'ดูเมนูอาหารทั้งหมด' : 'Explore Full Menu'}</span>
            <ArrowRight className="w-4 h-4 text-[#FACC15]" />
          </a>
        </div>
      </div>
    </section>
  );
};
