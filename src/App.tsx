/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { Language } from './data/translations';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    // Check saved language preference in local storage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tonys_lang');
      if (saved === 'th' || saved === 'en') return saved;
    }
    // Default language is Thai
    return 'th';
  });

  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const handleToggleLang = () => {
    setCurrentLang((prev) => {
      const nextLang = prev === 'th' ? 'en' : 'th';
      localStorage.setItem('tonys_lang', nextLang);
      document.documentElement.lang = nextLang;
      return nextLang;
    });
  };

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E2022] font-sans antialiased selection:bg-[#1F382E] selection:text-[#FAF7F2]">
      {/* Accessible Header with Nav & Language Switcher */}
      <Header currentLang={currentLang} onToggleLang={handleToggleLang} />

      {/* Main Single-Page Sections */}
      <main className="flex-1">
        <HeroSection currentLang={currentLang} />
        <FeaturedDishes currentLang={currentLang} onSelectItem={setSelectedDish} />
        <MenuSection currentLang={currentLang} onSelectItem={setSelectedDish} />
        <AboutSection currentLang={currentLang} />
        <OrderSection currentLang={currentLang} />
        <ContactSection currentLang={currentLang} />
      </main>

      {/* Minimal Footer */}
      <Footer currentLang={currentLang} />

      {/* Dish Detail Dialog */}
      <MenuDetailModal
        item={selectedDish}
        onClose={() => setSelectedDish(null)}
        currentLang={currentLang}
      />
    </div>
  );
}
