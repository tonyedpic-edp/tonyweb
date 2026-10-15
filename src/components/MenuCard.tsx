import React from 'react';
import { Flame, Utensils, ArrowUpRight } from 'lucide-react';
import { MenuItem } from '../data/menu';
import { Language, TRANSLATIONS } from '../data/translations';

interface MenuCardProps {
  item: MenuItem;
  currentLang: Language;
  onSelect: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, currentLang, onSelect }) => {
  const t = TRANSLATIONS[currentLang];

  const primaryName = currentLang === 'th' ? item.nameTh : item.nameEn;
  const secondaryName = currentLang === 'th' ? item.nameEn : item.nameTh;
  const description = currentLang === 'th' ? item.descriptionTh : item.descriptionEn;

  return (
    <div
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${primaryName} - ${item.price ? `${item.price} ${t.featured.currency}` : t.menu.contactForPrice}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-2xs hover:shadow-lg hover:border-[#EA580C]/40 hover:-translate-y-1 transition-all cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
    >
      {/* Dish Photography / Fallback Container */}
      <div className="relative aspect-4/3 w-full bg-gray-100 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={primaryName}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-600 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-500 text-center">
            <Utensils className="w-8 h-8 mb-2 opacity-40 text-[#EA580C]" />
            <span className="font-serif text-base font-semibold text-[#111827]">
              {primaryName}
            </span>
          </div>
        )}

        {/* Natural gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none opacity-85 group-hover:opacity-95 transition-opacity" />

        {/* Top Badges: Featured Tag & Spice Level */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          {item.isFeatured ? (
            <span className="bg-[#111827] text-white px-2.5 py-1 rounded-md font-semibold text-[10px] tracking-wider uppercase shadow-xs border border-[#F59E0B]">
              {currentLang === 'th' ? 'แนะนำ' : 'Featured'}
            </span>
          ) : (
            <div />
          )}

          {item.spiciness > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-white drop-shadow-sm bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-xs border border-white/10">
              <Flame className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>
                {item.spiciness === 1
                  ? t.menu.mild
                  : item.spiciness === 2
                  ? t.menu.medium
                  : t.menu.hot}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Price on Image */}
        <div className="absolute bottom-3 right-3">
          {item.priceVerified && item.price !== undefined ? (
            <span className="bg-[#111827]/95 text-[#FACC15] font-serif text-lg font-bold px-3 py-1 rounded-lg shadow-sm border border-white/10 tabular-nums">
              {item.price}{' '}
              <span className="text-xs font-sans font-normal text-gray-300">
                {t.featured.currency}
              </span>
            </span>
          ) : (
            <span className="bg-[#111827]/85 text-gray-300 text-[11px] px-2.5 py-1 rounded-lg backdrop-blur-xs">
              {t.menu.contactForPrice}
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Main Dish Name */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111827] group-hover:text-[#EA580C] transition-colors leading-snug mb-1">
            {primaryName}
          </h3>

          {/* Secondary Name */}
          {secondaryName && (
            <span className="block text-xs text-gray-500 mb-2.5 font-sans">
              {secondaryName}
            </span>
          )}

          {/* Description */}
          {description && (
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed line-clamp-2 mb-4">
              {description}
            </p>
          )}
        </div>

        {/* Card Footer Action */}
        <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-[#EA580C] group-hover:text-[#C2410C] inline-flex items-center gap-1.5 transition-colors">
            <span>{t.menu.viewDetails}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#F59E0B]" />
          </span>

          <span className="text-gray-400 text-[11px]">
            {currentLang === 'th' ? 'คลิกดูรายละเอียด' : 'Click to view'}
          </span>
        </div>
      </div>
    </div>
  );
};
