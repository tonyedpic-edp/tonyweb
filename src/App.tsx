/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MenuDetailModal } from './components/MenuDetailModal';
import { HeroSection } from './sections/HeroSection';
import { FeaturedDishes } from './sections/FeaturedDishes';
import { MenuSection } from './sections/MenuSection';
import { AboutSection } from './sections/AboutSection';
import { OrderSection } from './sections/OrderSection';
import { ContactSection } from './sections/ContactSection';
import { MenuItem } from './data/menu';
import { Language, TRANSLATIONS } from './data/translations';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tonys_lang');
      if (saved === 'th' || saved === 'en') return saved;
    }
    return 'th';
  });

  const [currentView, setCurrentView] = useState<'home' | 'menu'>('home');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const t = TRANSLATIONS[currentLang];

  const handleToggleLang = () => {
    setCurrentLang((prev) => {
      const nextLang = prev === 'th' ? 'en' : 'th';
      localStorage.setItem('tonys_lang', nextLang);
      document.documentElement.lang = nextLang;
      return nextLang;
    });
  };

  const handleNavigate = (view: 'home' | 'menu', sectionId?: string) => {
    setCurrentView(view);
    if (view === 'home' && sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827] font-sans antialiased selection:bg-[#EA580C] selection:text-white">
      {/* Accessible Header with Nav, View Switcher & Language Switcher */}
      <Header
        currentLang={currentLang}
        onToggleLang={handleToggleLang}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main Single-Page Sections */}
      <main className="flex-1">
        {currentView === 'home' ? (
          /* HOMEPAGE: Dedicated Restaurant Introduction Only (Zero Food Items Cluttering) */
          <>
            <HeroSection
              currentLang={currentLang}
              onExploreMenu={() => handleNavigate('menu')}
            />
            <AboutSection
              currentLang={currentLang}
              onExploreMenu={() => handleNavigate('menu')}
            />
            <OrderSection currentLang={currentLang} />
            <ContactSection currentLang={currentLang} />
          </>
        ) : (
          /* DEDICATED MENU VIEW: Interactive Full Menu & Category Search */
          <div className="animate-in fade-in duration-300">
            {/* Top Navigation Strip */}
            <div className="bg-[#111827] text-white py-8 border-b border-gray-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => handleNavigate('home', 'home')}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FACC15] hover:text-white transition-colors cursor-pointer w-fit"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>
                      {currentLang === 'th' ? '← กลับหน้าแนะนำร้าน' : '← Back to Restaurant Overview'}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                    <span>
                      {currentLang === 'th'
                        ? 'เมนูแท้ปรุงสดใหม่จานต่อจาน หน้าร้านนิชดาธานี'
                        : 'Authentic à la carte menu cooked to order'}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    {currentLang === 'th' ? 'เมนูอาหารทั้งหมด' : 'Full Food Menu'}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 font-sans max-w-2xl">
                    {currentLang === 'th'
                      ? 'เลือกดูเมนูอาหารไทยรสชาติต้นตำรับ ทั้งผัดกะเพราสูตรเด็ด ผัดไทย ต้มยำ และเมนูแนะนำมากมาย พร้อมระดับความเผ็ดและราคาจริง'
                      : 'Browse our complete authentic Thai dishes, spice levels, and verified in-restaurant pricing.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Complete Menu Section with Search, Filter & Cards */}
            <MenuSection currentLang={currentLang} onSelectItem={setSelectedDish} />

            {/* Featured Specialties */}
            <FeaturedDishes currentLang={currentLang} onSelectItem={setSelectedDish} />

            {/* Ordering Options */}
            <OrderSection currentLang={currentLang} />
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <Footer currentLang={currentLang} onNavigate={handleNavigate} />

      {/* Dish Detail Dialog */}
      <MenuDetailModal
        item={selectedDish}
        onClose={() => setSelectedDish(null)}
        currentLang={currentLang}
      />
    </div>
  );
}
