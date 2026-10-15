import React from 'react';
import { ArrowRight, Clock, MapPin, Phone, Sparkles } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { RESTAURANT_DATA } from '../data/restaurant';
import { heroKrapowImg } from '../data/menu';

interface HeroSectionProps {
  currentLang: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <section id="home" className="relative overflow-hidden bg-[#FAF7F2] pt-10 pb-18 lg:pt-16 lg:pb-28 border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Editorial Content (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Subtle editorial kicker (Unboxed text with bullet) */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#1F382E] mb-5">
              <span className="w-2 h-2 rounded-full bg-[#C89B3C]" />
              <span>{t.hero.kicker}</span>
              <span aria-hidden="true" className="text-[#C5BDB1]">·</span>
              <span className="text-[#736B5E] font-medium">{t.hero.authenticBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#18181A] leading-[1.12] mb-6 [text-wrap:balance]">
              {t.hero.headline}
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#554E44] leading-relaxed max-w-xl mb-8 font-sans">
              {t.hero.subheadline}
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-bold tracking-wider uppercase text-[#FAF7F2] bg-[#1F382E] hover:bg-[#162720] rounded-lg shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all text-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1F382E]"
              >
                <span>{t.hero.exploreMenu}</span>
                <ArrowRight className="w-4 h-4 text-[#D4A373]" />
              </a>

              <a
                href="#order"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold tracking-wider uppercase text-[#18181A] bg-[#EFE8DC] hover:bg-[#E5DDD0] border border-[#DDD3C5] rounded-lg transition-all hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1F382E]"
              >
                <span>{t.hero.orderOnline}</span>
              </a>
            </div>

            {/* Architectural Trust & Info Strip */}
            <div className="pt-8 border-t border-[#E8E2D8] grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-xs text-[#554E44]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFE9DF] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#1F382E]" />
                </div>
                <div>
                  <span className="block font-semibold text-[#18181A] text-xs mb-0.5">{t.hero.hoursLabel}</span>
                  <span className="text-[#6B6458] leading-normal">{currentLang === 'th' ? RESTAURANT_DATA.hours.th : RESTAURANT_DATA.hours.en}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFE9DF] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#1F382E]" />
                </div>
                <div>
                  <span className="block font-semibold text-[#18181A] text-xs mb-0.5">
                    {currentLang === 'th' ? 'ทำเลที่ตั้ง' : 'Location'}
                  </span>
                  <span className="text-[#6B6458] leading-normal">
                    {currentLang === 'th' ? RESTAURANT_DATA.address.landmarkTh : RESTAURANT_DATA.address.landmarkEn}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFE9DF] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#1F382E]" />
                </div>
                <div>
                  <span className="block font-semibold text-[#18181A] text-xs mb-0.5">{t.hero.phoneLabel}</span>
                  <a
                    href={`tel:${RESTAURANT_DATA.phoneRaw}`}
                    className="text-[#1F382E] font-medium hover:underline underline-offset-2 block"
                  >
                    {RESTAURANT_DATA.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Thai Food Photography (5 cols) */}
          <div className="lg:col-span-5 relative">
            {/* Outer Art Mat Container */}
            <div className="relative p-2.5 sm:p-3 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#E2D9CC]">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#EAE2D5] aspect-4/3 sm:aspect-16/10 lg:aspect-4/3">
                <img
                  src={heroKrapowImg}
                  alt="Authentic Thai Holy Basil Chicken with Crispy Fried Egg at Tony's Kitchen"
                  loading="eager"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pointer-events-none" />

                {/* Bottom Caption on Image */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-[#E5C384] mb-1">
                    <Sparkles className="w-3 h-3 text-[#C89B3C]" />
                    <span>{currentLang === 'th' ? 'จานเด็ดแนะนำ' : 'Signature House Dish'}</span>
                  </div>
                  <p className="font-serif text-lg sm:text-xl font-bold leading-tight drop-shadow-sm">
                    {currentLang === 'th' ? 'ผัดกะเพราไก่สูตรแท้ + ไข่ดาวกรอบ' : 'Original Thai Basil Chicken & Crispy Egg'}
                  </p>
                  <p className="text-xs text-stone-200 mt-0.5 font-sans">
                    {currentLang === 'th' ? 'ข้าวหอมมะลิแท้ · พริกสดตำใหม่ · หอมกลิ่นกระทะ Wok Hei' : 'Jasmine Rice · Crushed Fresh Chilies · True Wok Hei'}
                  </p>
                </div>
              </div>

              {/* Floating Culinary Quality Seal in top right corner */}
              <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#1F382E] text-[#FAF7F2] rounded-full shadow-lg border border-[#C89B3C]/40 text-[11px] font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C89B3C]" />
                <span>{currentLang === 'th' ? 'รสชาติไทยแท้ 100%' : 'Authentic Thai'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
