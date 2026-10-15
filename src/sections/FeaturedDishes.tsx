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
    <section id="featured" className="py-18 sm:py-24 bg-[#F5EFE6] border-b border-[#E5DDD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#1F382E] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
            <span>{t.featured.kicker}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#18181A] mb-4 [text-wrap:balance]">
            {t.featured.title}
          </h2>

          <p className="text-base text-[#615A4F] leading-relaxed max-w-2xl mx-auto">
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
            className="inline-flex items-center gap-2.5 px-6 py-3 text-xs font-bold tracking-wider uppercase text-[#1F382E] hover:text-[#18181A] bg-white hover:bg-[#FAF7F2] border border-[#DDD3C5] rounded-lg shadow-2xs hover:shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{currentLang === 'th' ? 'ดูเมนูอาหารทั้งหมด' : 'Explore Full Menu'}</span>
            <ArrowRight className="w-4 h-4 text-[#C89B3C]" />
          </a>
        </div>
      </div>
    </section>
  );
};
