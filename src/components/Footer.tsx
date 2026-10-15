import React from 'react';
import { Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { RESTAURANT_DATA } from '../data/restaurant';
import { Language, TRANSLATIONS } from '../data/translations';

interface FooterProps {
  currentLang: Language;
  onNavigate?: (view: 'home' | 'menu', sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onNavigate }) => {
  const t = TRANSLATIONS[currentLang];
  const currentYear = new Date().getFullYear();

  const handleLink = (view: 'home' | 'menu', sectionId?: string) => {
    if (onNavigate) {
      onNavigate(view, sectionId);
    }
  };

  return (
    <footer className="bg-[#111827] text-white pt-18 pb-14 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-gray-800 text-left">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-serif text-lg font-bold border-2 border-[#F59E0B] shadow-xs">
                TK
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold tracking-tight text-white leading-tight">
                  Tony's Kitchen
                </span>
                <span className="block text-xs font-sans text-[#A89F91]">
                  {currentLang === 'th' ? 'ครัวโทนี่ · อาหารไทยแท้' : 'Real Thai Food. Made with Passion.'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A89F91] leading-relaxed mb-6 max-w-sm">
              {t.hero.subheadline}
            </p>

            <div className="flex items-center gap-3">
              <a
                href={RESTAURANT_DATA.links.line}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LINE contact"
                className="w-9 h-9 rounded-lg bg-[#272624] hover:bg-[#06C755] text-white flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={RESTAURANT_DATA.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp contact"
                className="w-9 h-9 rounded-lg bg-[#272624] hover:bg-[#25D366] text-white flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={`tel:${RESTAURANT_DATA.phoneRaw}`}
                aria-label="Call restaurant"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#EA580C] text-white flex items-center justify-center transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Essential Navigation Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <button
                  type="button"
                  onClick={() => handleLink('home', 'home')}
                  className="hover:text-[#FACC15] transition-colors cursor-pointer text-left"
                >
                  {currentLang === 'th' ? 'แนะนำร้าน' : t.nav.home}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink('menu')}
                  className="hover:text-[#FACC15] transition-colors cursor-pointer text-left"
                >
                  {t.nav.menu}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink('home', 'about')}
                  className="hover:text-[#FACC15] transition-colors cursor-pointer text-left"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink('home', 'order')}
                  className="hover:text-[#FACC15] transition-colors cursor-pointer text-left"
                >
                  {t.nav.order}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink('home', 'contact')}
                  className="hover:text-[#FACC15] transition-colors cursor-pointer text-left"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Ordering Channels (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-4">
              {t.footer.orderingChannels}
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <a
                  href={RESTAURANT_DATA.links.app}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FACC15] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{currentLang === 'th' ? 'เว็บแอป Tony’s Kitchen' : "Tony's Kitchen Web App"}</span>
                  <ExternalLink className="w-3 h-3 text-[#F59E0B]" />
                </a>
              </li>
              <li>
                <a
                  href={RESTAURANT_DATA.links.grabFood}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FACC15] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>GrabFood</span>
                  <ExternalLink className="w-3 h-3 text-[#F59E0B]" />
                </a>
              </li>
              <li>
                <a
                  href={RESTAURANT_DATA.links.line}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FACC15] transition-colors"
                >
                  LINE (ID: {RESTAURANT_DATA.links.lineId})
                </a>
              </li>
              <li>
                <a
                  href={RESTAURANT_DATA.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FACC15] transition-colors"
                >
                  WhatsApp: +66 84 153 6498
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Hours (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-2">
              {t.footer.hoursHeading}
            </h4>
            <p className="text-xs font-bold text-white mb-4">
              {currentLang === 'th' ? RESTAURANT_DATA.hours.th : RESTAURANT_DATA.hours.en}
            </p>

            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-2">
              {t.footer.addressHeading}
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              {currentLang === 'th' ? RESTAURANT_DATA.address.th : RESTAURANT_DATA.address.en}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {currentYear} Tony's Kitchen. {t.footer.rights}</p>
          <p className="text-center sm:text-right">{t.footer.verifiedNote}</p>
        </div>
      </div>
    </footer>
  );
};
