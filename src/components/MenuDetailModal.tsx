import React, { useEffect } from 'react';
import { X, Flame, ExternalLink, Check, Phone } from 'lucide-react';
import { MenuItem } from '../data/menu';
import { Language, TRANSLATIONS } from '../data/translations';
import { RESTAURANT_DATA } from '../data/restaurant';

interface MenuDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  currentLang: Language;
}

export const MenuDetailModal: React.FC<MenuDetailModalProps> = ({ item, onClose, currentLang }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const t = TRANSLATIONS[currentLang];
  const primaryName = currentLang === 'th' ? item.nameTh : item.nameEn;
  const secondaryName = currentLang === 'th' ? item.nameEn : item.nameTh;
  const description = currentLang === 'th' ? item.descriptionTh : item.descriptionEn;
  const customizations = currentLang === 'th' ? item.customizationsTh : item.customizationsEn;

  const getSpiceText = (level: number) => {
    switch (level) {
      case 0:
        return t.menu.nonSpicy;
      case 1:
        return t.menu.mild;
      case 2:
        return t.menu.medium;
      case 3:
        return t.menu.hot;
      default:
        return '';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#111827] text-white rounded-3xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t.modal.closeModal}
          className="absolute top-4 right-4 z-10 p-2.5 bg-black/75 hover:bg-black text-white rounded-full shadow-md backdrop-blur-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#EA580C]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto">
          {/* Header Image */}
          <div className="relative aspect-16/9 w-full bg-gray-900">
            {item.image ? (
              <img
                src={item.image}
                alt={primaryName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-8 text-center">
                <span className="font-serif text-2xl text-white font-bold">
                  {primaryName}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

            {/* Bottom Title & Price Overlay */}
            <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between text-white">
              <div>
                <h3 id="dish-detail-title" className="font-serif text-2xl sm:text-3xl font-bold leading-tight drop-shadow-sm text-white">
                  {primaryName}
                </h3>
                {secondaryName && (
                  <span className="text-xs text-gray-300 mt-0.5 block font-sans">
                    {secondaryName}
                  </span>
                )}
              </div>

              <div className="text-right shrink-0">
                {item.priceVerified && item.price !== undefined ? (
                  <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#FACC15] tabular-nums">
                    {item.price}{' '}
                    <span className="text-sm font-sans font-normal text-gray-200">
                      {t.featured.currency}
                    </span>
                  </span>
                ) : (
                  <span className="block text-xs text-gray-300">
                    {t.menu.contactForPrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6 text-left">
            {/* Description */}
            {description && (
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans">
                {description}
              </p>
            )}

            {/* Spice and Dietary Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 py-3.5 border-y border-gray-800">
              <div className="flex items-center gap-1.5 font-medium">
                <Flame className={`w-4 h-4 ${item.spiciness > 0 ? 'text-[#EA580C]' : 'text-gray-500'}`} />
                <span>{t.modal.spiceLevelTitle}:</span>
                <span className="font-semibold text-white">{getSpiceText(item.spiciness)}</span>
              </div>

              {item.isFeatured && (
                <>
                  <span aria-hidden="true" className="text-gray-600">·</span>
                  <span className="font-semibold text-[#FACC15]">
                    {currentLang === 'th' ? 'เมนูแนะนำประจำร้าน' : 'House Featured Dish'}
                  </span>
                </>
              )}
            </div>

            {/* Customization Options */}
            {customizations && customizations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  {t.modal.customizationTitle}
                </h4>
                <ul className="space-y-1.5">
                  {customizations.map((custom, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                      <Check className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                      <span>{custom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Real Ordering Channels */}
            <div className="pt-2 space-y-3">
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                {currentLang === 'th' ? 'เลือกช่องทางสั่งอาหารจานนี้' : 'Order this dish through'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={RESTAURANT_DATA.links.app}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#EA580C] text-white hover:bg-[#C2410C] transition-colors text-xs font-bold shadow-md"
                >
                  <span>{t.modal.orderViaApp}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#FACC15]" />
                </a>

                <a
                  href={RESTAURANT_DATA.links.grabFood}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#00B14F] text-white hover:bg-[#009A44] transition-colors text-xs font-bold shadow-md"
                >
                  <span>{t.modal.orderViaGrab}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <a
                  href={RESTAURANT_DATA.links.line}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-[#06C755] text-white hover:bg-[#05b04b] transition-colors text-xs font-semibold shadow-xs"
                >
                  <span>{t.modal.orderViaLine}</span>
                </a>

                <a
                  href={`tel:${RESTAURANT_DATA.phoneRaw}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 transition-colors text-xs font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>{RESTAURANT_DATA.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
