import React, { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed, Phone, ArrowLeft } from 'lucide-react';
import { RESTAURANT_DATA } from '../data/restaurant';
import { Language, TRANSLATIONS } from '../data/translations';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  currentLang: Language;
  onToggleLang: () => void;
  currentView: 'home' | 'menu';
  onNavigate: (view: 'home' | 'menu', sectionId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onToggleLang,
  currentView,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];

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

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-200'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Logo / Brand Lockup (Black & Yellow seal) */}
          <button
            type="button"
            className="flex items-center gap-3 text-left group whitespace-nowrap shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] cursor-pointer"
            onClick={() => handleLinkClick('home')}
          >
            <div className="w-10 h-10 rounded-full bg-[#111827] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs border-2 border-[#F59E0B] transition-transform group-hover:scale-105 duration-200">
              TK
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#111827] group-hover:text-[#EA580C] transition-colors leading-tight">
                Tony's Kitchen
              </span>
              <span className="block text-[11px] font-sans font-medium text-[#6B7280] tracking-wide">
                {currentLang === 'th' ? 'ครัวโทนี่ · อาหารไทยแท้' : 'Authentic Thai Food'}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#374151]">
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'home')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                currentView === 'home'
                  ? 'text-[#EA580C] font-semibold'
                  : 'hover:text-[#EA580C]'
              }`}
            >
              {currentLang === 'th' ? 'แนะนำร้าน' : t.nav.home}
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'about')}
              className="hover:text-[#EA580C] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              {t.nav.about}
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('menu')}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer flex items-center gap-1.5 ${
                currentView === 'menu'
                  ? 'text-[#EA580C] font-semibold'
                  : 'hover:text-[#EA580C]'
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
              className="hover:text-[#EA580C] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
            >
              {t.nav.order}
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'contact')}
              className="hover:text-[#EA580C] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
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
              className="p-2.5 text-[#111827] hover:text-[#EA580C] hover:bg-gray-100 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white shadow-xl px-5 pt-4 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2 font-medium text-[#111827]">
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'home')}
              className="py-3 px-3 rounded-lg text-left hover:bg-gray-50 hover:text-[#EA580C] transition-colors text-base"
            >
              {currentLang === 'th' ? 'แนะนำร้าน' : t.nav.home}
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'about')}
              className="py-3 px-3 rounded-lg text-left hover:bg-gray-50 hover:text-[#EA580C] transition-colors text-base"
            >
              {t.nav.about}
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('menu')}
              className="py-3 px-3 rounded-lg text-left hover:bg-gray-50 hover:text-[#EA580C] transition-colors text-base flex items-center justify-between"
            >
              <span>{t.nav.menu}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-[#FEF3C7] text-[#B45309]">
                {currentLang === 'th' ? 'เปิดดูเมนู' : 'Open Menu'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'order')}
              className="py-3 px-3 rounded-lg text-left hover:bg-gray-50 hover:text-[#EA580C] transition-colors text-base"
            >
              {t.nav.order}
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('home', 'contact')}
              className="py-3 px-3 rounded-lg text-left hover:bg-gray-50 hover:text-[#EA580C] transition-colors text-base"
            >
              {t.nav.contact}
            </button>

            <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleLinkClick('home', 'order')}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-center text-sm font-bold tracking-wide uppercase text-white bg-[#EA580C] rounded-lg shadow-xs"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#FACC15]" />
                <span>{t.nav.orderButton}</span>
              </button>

              <a
                href={`tel:${RESTAURANT_DATA.phoneRaw}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-center text-sm font-semibold text-[#111827] bg-gray-100 rounded-lg hover:bg-gray-200"
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
