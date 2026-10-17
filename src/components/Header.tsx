import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, UtensilsCrossed, Phone, ArrowLeft, Shield } from 'lucide-react';
import { RESTAURANT_DATA, RestaurantData } from '../data/restaurant';
import { Language, TRANSLATIONS } from '../data/translations';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  currentLang: Language;
  onToggleLang: () => void;
  currentView: 'home' | 'menu';
  onNavigate: (view: 'home' | 'menu', sectionId?: string) => void;
  onTriggerOwnerAuth?: () => void;
  customLogo?: string | null;
  restaurantData?: RestaurantData;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onToggleLang,
  currentView,
  onNavigate,
  onTriggerOwnerAuth,
  customLogo,
  restaurantData,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [clickCountToast, setClickCountToast] = useState<number | null>(null);

  const t = TRANSLATIONS[currentLang];
  const restaurant = restaurantData || RESTAURANT_DATA;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  const handleLinkClick = (view: 'home' | 'menu', sectionId?: string) => {
    closeMenu();
    onNavigate(view, sectionId);
  };

  // Requirement 2: 5 clicks on the logo triggers owner authentication
  const handleBrandClick = () => {
    clickCountRef.current += 1;
    const clicks = clickCountRef.current;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
      setClickCountToast(null);
    }, 3000);

    if (clicks >= 5) {
      clickCountRef.current = 0;
      setClickCountToast(null);
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      if (onTriggerOwnerAuth) {
        onTriggerOwnerAuth();
      }
      return;
    }

    if (clicks >= 2) {
      setClickCountToast(clicks);
    }

    if (clicks === 1) {
      handleLinkClick('home');
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0F17]/95 backdrop-blur-md shadow-md border-b border-gray-800'
          : 'bg-[#0B0F17] border-b border-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-24 py-3 sm:py-4 gap-6 sm:gap-8">
          {/* Logo / Brand Lockup with 5-click owner mode trigger and custom logo display (100% larger) */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-3.5 sm:gap-4.5 text-left group whitespace-nowrap shrink-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] cursor-pointer"
              onClick={handleBrandClick}
              title="Tony's Kitchen (คลิก 5 ครั้งเพื่อเข้าโหมด Owner)"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#111827] text-white flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold shadow-lg border-2 border-[#F59E0B] transition-transform group-hover:scale-105 duration-200 overflow-hidden shrink-0">
                {customLogo ? (
                  <img
                    src={customLogo}
                    alt={restaurant.name.en}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <span className="text-[#FACC15]">TK</span>
                )}
              </div>
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-[#FACC15] transition-colors leading-tight">
                  {restaurant.name.en}
                </span>
                <span className="block text-xs sm:text-sm font-sans font-medium text-gray-400 tracking-wide mt-0.5">
                  {currentLang === 'th' ? restaurant.name.th : restaurant.concept.en}
                </span>
              </div>
            </button>

            {/* Subtle feedback toast during consecutive clicks */}
            {clickCountToast && (
              <div className="absolute -bottom-5 left-0 bg-[#111827] text-[#FACC15] text-[10px] font-bold px-2 py-0.5 rounded shadow-md border border-[#F59E0B] whitespace-nowrap z-50 animate-in fade-in">
                กดอีก {5 - clickCountToast} ครั้งเพื่อเข้าสู่โหมด Owner
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-gray-300">
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'home')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                currentView === 'home'
                  ? 'text-[#EA580C] font-semibold'
                  : 'hover:text-[#FACC15]'
              }`}
            >
              {currentLang === 'th' ? 'แนะนำร้าน' : t.nav.home}
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'about')}
              className="hover:text-[#FACC15] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              {t.nav.about}
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('menu')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer flex items-center gap-1.5 ${
                currentView === 'menu'
                  ? 'text-[#EA580C] font-semibold'
                  : 'hover:text-[#FACC15]'
              }`}
            >
              <span>{t.nav.menu}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-xs bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                {currentLang === 'th' ? 'เปิดดู' : 'View'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'order')}
              className="hover:text-[#FACC15] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              {t.nav.order}
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'contact')}
              className="hover:text-[#FACC15] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              {t.nav.contact}
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <LanguageSwitcher currentLang={currentLang} onToggle={onToggleLang} />

            <button
              type="button"
              onClick={() => handleLinkClick('home', 'order')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>{t.nav.orderButton}</span>
            </button>
          </div>

          {/* Mobile Actions: Language toggle + Hamburger */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <LanguageSwitcher currentLang={currentLang} onToggle={onToggleLang} />

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={mobileMenuOpen}
              className="p-2.5 text-gray-200 hover:text-[#FACC15] hover:bg-gray-800 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-800 bg-[#0B0F17] text-white shadow-2xl px-5 pt-4 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2 font-medium text-gray-200">
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'home')}
              className="py-3 px-3 rounded-lg text-left hover:bg-gray-900 hover:text-[#FACC15] transition-colors text-base"
            >
              {currentLang === 'th' ? 'แนะนำร้าน' : t.nav.home}
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'about')}
              className="py-3 px-3 rounded-lg text-left hover:bg-gray-900 hover:text-[#FACC15] transition-colors text-base"
            >
              {t.nav.about}
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('menu')}
              className="py-3 px-3 rounded-lg text-left hover:bg-gray-900 hover:text-[#FACC15] transition-colors text-base flex items-center justify-between"
            >
              <span>{t.nav.menu}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-[#111827] text-[#FACC15] border border-amber-500/40">
                {currentLang === 'th' ? 'เปิดดูเมนู' : 'Open Menu'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'order')}
              className="py-3 px-3 rounded-lg text-left hover:bg-gray-900 hover:text-[#FACC15] transition-colors text-base"
            >
              {t.nav.order}
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'contact')}
              className="py-3 px-3 rounded-lg text-left hover:bg-gray-900 hover:text-[#FACC15] transition-colors text-base"
            >
              {t.nav.contact}
            </button>

            <div className="pt-4 mt-2 border-t border-gray-800 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleLinkClick('home', 'order')}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-center text-sm font-bold tracking-wide uppercase text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shadow-xs"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#FACC15]" />
                <span>{t.nav.orderButton}</span>
              </button>

              <a
                href={`tel:${RESTAURANT_DATA.phoneRaw}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-center text-sm font-semibold text-gray-200 bg-[#111827] border border-gray-800 rounded-lg hover:bg-gray-800"
              >
                <Phone className="w-4 h-4 text-[#EA580C]" />
                <span>{RESTAURANT_DATA.phone}</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
