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
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C] ${
        className || 'bg-gray-50 hover:bg-gray-100 text-[#111827]'
      }`}
    >
      <Globe className="w-3.5 h-3.5 text-[#EA580C]" aria-hidden="true" />
      <span className={currentLang === 'th' ? 'font-bold text-[#EA580C]' : 'text-gray-500'}>TH</span>
      <span className="text-gray-300">/</span>
      <span className={currentLang === 'en' ? 'font-bold text-[#EA580C]' : 'text-gray-500'}>EN</span>
    </button>
  );
};
