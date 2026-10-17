import React from 'react';
import { Sparkles, MapPin, ExternalLink, Leaf, Flame, HeartHandshake, ArrowRight } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { RESTAURANT_DATA } from '../data/restaurant';
import { greenCurryImg } from '../data/menu';

interface AboutSectionProps {
  currentLang: Language;
  onExploreMenu?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ currentLang, onExploreMenu }) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <section id="about" className="py-18 sm:py-24 bg-[#0B0F17] border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Authentic Photography of Central Thai Green Curry (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative p-2.5 sm:p-3 bg-[#111827] rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-800">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900 aspect-4/3">
                <img
                  src={greenCurryImg}
                  alt="Authentic Central Thai Green Curry at Tony's Kitchen"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#FACC15] block mb-1">
                    {currentLang === 'th' ? 'สูตรต้นตำรับแท้' : 'Central Thai Heritage'}
                  </span>
                  <p className="font-serif text-base sm:text-lg font-bold leading-tight drop-shadow-sm">
                    {currentLang === 'th' ? 'แกงเขียวหวานไก่กะทิสด' : 'Homestyle Thai Coconut Curries'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Honest Story & Principles (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#EA580C] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{t.about.kicker}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 [text-wrap:balance]">
              {t.about.title}
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed mb-8 font-sans">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </div>

            {/* 3 Pillars of Authentic Thai Cooking (Clean Minimal Luxury Dark Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-5 rounded-2xl bg-[#111827] border border-amber-500/30 hover:border-[#F59E0B] shadow-2xs hover:shadow-lg transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-950/60 flex items-center justify-center mb-3 border border-amber-500/40">
                  <Leaf className="w-4 h-4 text-[#FACC15]" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{t.about.pillar1Title}</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">{t.about.pillar1Desc}</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#111827] border border-orange-500/30 hover:border-[#EA580C] shadow-2xs hover:shadow-lg transition-all">
                <div className="w-9 h-9 rounded-xl bg-orange-950/60 flex items-center justify-center mb-3 border border-orange-500/40">
                  <Flame className="w-4 h-4 text-[#EA580C]" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{t.about.pillar2Title}</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">{t.about.pillar2Desc}</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#111827] border border-yellow-500/30 hover:border-[#FACC15] shadow-2xs hover:shadow-lg transition-all">
                <div className="w-9 h-9 rounded-xl bg-yellow-950/60 flex items-center justify-center mb-3 border border-yellow-500/40">
                  <HeartHandshake className="w-4 h-4 text-[#FACC15]" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{t.about.pillar3Title}</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">{t.about.pillar3Desc}</p>
              </div>
            </div>

            {/* Address & Google Maps link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 rounded-xl bg-[#111827] border border-gray-800">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                <div className="text-xs text-gray-300">
                  <span className="font-bold text-white block mb-0.5">
                    {currentLang === 'th' ? RESTAURANT_DATA.address.landmarkTh : RESTAURANT_DATA.address.landmarkEn}
                  </span>
                  <span className="text-gray-400">{currentLang === 'th' ? RESTAURANT_DATA.address.th : RESTAURANT_DATA.address.en}</span>
                </div>
              </div>

              <a
                href={RESTAURANT_DATA.links.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:text-[#FACC15] bg-black/60 border border-gray-700 hover:border-[#EA580C] rounded-lg shadow-2xs hover:shadow-xs transition-all whitespace-nowrap shrink-0"
              >
                <span>{t.about.viewMap}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#F59E0B]" />
              </a>
            </div>

            {/* Explore Menu CTA */}
            <div className="mt-6">
              <button
                type="button"
                onClick={onExploreMenu}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EA580C] hover:text-[#C2410C] hover:underline cursor-pointer"
              >
                <span>{t.about.exploreMenuCTA}</span>
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
