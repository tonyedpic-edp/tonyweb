import React from 'react';
import { ArrowRight, Clock, MapPin, Phone, Sparkles } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { RESTAURANT_DATA } from '../data/restaurant';
import { heroKrapowImg } from '../data/menu';

interface HeroSectionProps {
  currentLang: Language;
  onExploreMenu?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentLang, onExploreMenu }) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <section id="home" className="relative overflow-hidden bg-white pt-10 pb-18 lg:pt-16 lg:pb-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Editorial Introduction to the Restaurant (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Subtle editorial kicker (Orange & Yellow accents) */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#EA580C] mb-5">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span>{t.hero.kicker}</span>
              <span aria-hidden="true" className="text-gray-300">·</span>
              <span className="text-[#4B5563] font-medium">{t.hero.authenticBadge}</span>
            </div>

            {/* Main Headline (Deep Black) */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111827] leading-[1.12] mb-6 [text-wrap:balance]">
              {t.hero.headline}
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-xl mb-8 font-sans">
              {t.hero.subheadline}
            </p>

            {/* Primary & Secondary Action Buttons (Orange & Black) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
              <button
                type="button"
                onClick={onExploreMenu}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-bold tracking-wider uppercase text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all text-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#EA580C]"
              >
                <span>{t.hero.exploreMenu}</span>
                <ArrowRight className="w-4 h-4 text-[#FACC15]" />
              </button>

              <a
                href="#order"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold tracking-wider uppercase text-white bg-[#111827] hover:bg-black rounded-lg transition-all hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#111827]"
              >
                <span>{t.hero.orderOnline}</span>
              </a>
            </div>

            {/* Architectural Trust & Info Strip */}
            <div className="pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-xs text-[#4B5563]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] flex items-center justify-center shrink-0 border border-[#FED7AA]">
                  <Clock className="w-4 h-4 text-[#EA580C]" />
                </div>
                <div>
                  <span className="block font-semibold text-[#111827] text-xs mb-0.5">{t.hero.hoursLabel}</span>
                  <span className="text-[#6B7280] leading-normal">{currentLang === 'th' ? RESTAURANT_DATA.hours.th : RESTAURANT_DATA.hours.en}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center shrink-0 border border-[#FDE68A]">
                  <MapPin className="w-4 h-4 text-[#B45309]" />
                </div>
                <div>
                  <span className="block font-semibold text-[#111827] text-xs mb-0.5">
                    {currentLang === 'th' ? 'ทำเลที่ตั้ง' : 'Location'}
                  </span>
                  <span className="text-[#6B7280] leading-normal">
                    {currentLang === 'th' ? RESTAURANT_DATA.address.landmarkTh : RESTAURANT_DATA.address.landmarkEn}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] flex items-center justify-center shrink-0 border border-[#FED7AA]">
                  <Phone className="w-4 h-4 text-[#EA580C]" />
                </div>
                <div>
                  <span className="block font-semibold text-[#111827] text-xs mb-0.5">{t.hero.phoneLabel}</span>
                  <a
                    href={`tel:${RESTAURANT_DATA.phoneRaw}`}
                    className="text-[#EA580C] font-semibold hover:underline underline-offset-2 block"
                  >
                    {RESTAURANT_DATA.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Thai Food Photography (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative p-2.5 sm:p-3 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3">
                <img
                  src={heroKrapowImg}
                  alt="Authentic Thai Holy Basil Chicken with Crispy Fried Egg at Tony's Kitchen"
                  loading="eager"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

                {/* Bottom Caption on Image */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-[#FACC15] mb-1">
                    <Sparkles className="w-3 h-3 text-[#FACC15]" />
                    <span>{currentLang === 'th' ? 'รสชาติดั้งเดิม' : 'House Heritage'}</span>
                  </div>
                  <p className="font-serif text-lg sm:text-xl font-bold leading-tight drop-shadow-sm">
                    {currentLang === 'th' ? 'ผัดกะเพราไก่สูตรแท้ + ไข่ดาวกรอบ' : 'Original Thai Basil Chicken & Crispy Egg'}
                  </p>
                  <p className="text-xs text-stone-200 mt-0.5 font-sans">
                    {currentLang === 'th' ? 'ข้าวหอมมะลิแท้ · พริกสดตำใหม่ · หอมกลิ่นกระทะ Wok Hei' : 'Jasmine Rice · Crushed Fresh Chilies · True Wok Hei'}
                  </p>
                </div>
              </div>

              {/* Quality Seal (Black & Yellow) */}
              <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#111827] text-white rounded-full shadow-lg border border-[#F59E0B] text-[11px] font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                <span>{currentLang === 'th' ? 'อาหารไทยแท้ 100%' : 'Authentic Thai'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
