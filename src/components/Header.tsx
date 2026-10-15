import React, { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed, Phone } from 'lucide-react';
import { RESTAURANT_DATA } from '../data/restaurant';
import { Language, TRANSLATIONS } from '../data/translations';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  currentLang: Language;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentLang, onToggleLang }) => {
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

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-xs border-b border-[#E5DDD0]'
          : 'bg-[#FAF7F2] border-b border-[#E8E2D8]/70'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Logo / Brand Lockup */}
          <a
            href="#home"
            className="flex items-center gap-3 text-left group whitespace-nowrap shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F382E]"
            onClick={closeMenu}
          >
            <div className="w-10 h-10 rounded-full bg-[#1F382E] text-[#FAF7F2] flex items-center justify-center font-serif text-lg font-bold shadow-2xs border border-[#C89B3C]/30 transition-transform group-hover:scale-105 duration-200">
              TK
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#18181A] group-hover:text-[#1F382E] transition-colors leading-tight">
                Tony's Kitchen
              </span>
              <span className="block text-[11px] font-sans font-medium text-[#736B5E] tracking-wide">
                {currentLang === 'th' ? 'ครัวโทนี่ · อาหารไทยแท้' : 'Authentic Thai Food'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A453E]">
            <a
              href="#home"
              className="hover:text-[#1F382E] transition-colors whitespace-nowrap shrink-0 py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1F382E] after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform"
            >
              {t.nav.home}
            </a>
            <a
              href="#featured"
              className="hover:text-[#1F382E] transition-colors whitespace-nowrap shrink-0 py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1F382E] after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform"
            >
              {t.nav.featured}
            </a>
            <a
              href="#menu"
              className="hover:text-[#1F382E] transition-colors whitespace-nowrap shrink-0 py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1F382E] after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform"
            >
              {t.nav.menu}
            </a>
            <a
              href="#about"
              className="hover:text-[#1F382E] transition-colors whitespace-nowrap shrink-0 py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1F382E] after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform"
            >
              {t.nav.about}
            </a>
            <a
              href="#contact"
              className="hover:text-[#1F382E] transition-colors whitespace-nowrap shrink-0 py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1F382E] after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform"
            >
              {t.nav.contact}
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <LanguageSwitcher currentLang={currentLang} onToggle={onToggleLang} />

            <a
              href="#order"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-[#FAF7F2] bg-[#1F382E] hover:bg-[#162720] rounded-lg shadow-2xs transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F382E]"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{t.nav.orderButton}</span>
            </a>
          </div>

          {/* Mobile Actions: Language toggle + Hamburger */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <LanguageSwitcher currentLang={currentLang} onToggle={onToggleLang} />

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={mobileMenuOpen}
              className="p-2.5 text-[#2B2925] hover:text-[#18181A] hover:bg-[#EAE4D9] rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-[#1F382E]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E2D8] bg-[#FAF7F2] shadow-xl px-5 pt-4 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2 font-medium text-[#3A3630]">
            <a
              href="#home"
              onClick={closeMenu}
              className="py-3 px-3 rounded-lg hover:bg-[#EFE9DF] hover:text-[#18181A] transition-colors text-base"
            >
              {t.nav.home}
            </a>
            <a
              href="#featured"
              onClick={closeMenu}
              className="py-3 px-3 rounded-lg hover:bg-[#EFE9DF] hover:text-[#18181A] transition-colors text-base"
            >
              {t.nav.featured}
            </a>
            <a
              href="#menu"
              onClick={closeMenu}
              className="py-3 px-3 rounded-lg hover:bg-[#EFE9DF] hover:text-[#18181A] transition-colors text-base"
            >
              {t.nav.menu}
            </a>
            <a
              href="#about"
              onClick={closeMenu}
              className="py-3 px-3 rounded-lg hover:bg-[#EFE9DF] hover:text-[#18181A] transition-colors text-base"
            >
              {t.nav.about}
            </a>
            <a
              href="#contact"
              onClick={closeMenu}
              className="py-3 px-3 rounded-lg hover:bg-[#EFE9DF] hover:text-[#18181A] transition-colors text-base"
            >
              {t.nav.contact}
            </a>

            <div className="pt-4 mt-2 border-t border-[#E8E2D8] flex flex-col gap-3">
              <a
                href="#order"
                onClick={closeMenu}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-center text-sm font-bold tracking-wide uppercase text-[#FAF7F2] bg-[#1F382E] rounded-lg shadow-xs"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#D4A373]" />
                <span>{t.nav.orderButton}</span>
              </a>

              <a
                href={`tel:${RESTAURANT_DATA.phoneRaw}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-center text-sm font-semibold text-[#1F382E] bg-[#EFE9DF] rounded-lg"
              >
                <Phone className="w-4 h-4" />
                <span>{RESTAURANT_DATA.phone}</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
