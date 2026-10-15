import React from 'react';
import { Globe } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface LanguageSwitcherProps {
  currentLang: Language;
  onToggle: () => void;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
  onToggle,
  className = '',
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={t.nav.langToggleAria}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F382E] ${
        className || 'bg-[#EFE9DF] hover:bg-[#E5DDD0] text-[#3A3630]'
      }`}
    >
      <Globe className="w-3.5 h-3.5 text-[#1F382E]" aria-hidden="true" />
      <span className={currentLang === 'th' ? 'font-bold text-[#1F382E]' : 'opacity-70'}>TH</span>
      <span className="opacity-30">/</span>
      <span className={currentLang === 'en' ? 'font-bold text-[#1F382E]' : 'opacity-70'}>EN</span>
    </button>
  );
};
