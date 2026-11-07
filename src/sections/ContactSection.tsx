import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Clock, Copy, Check, ExternalLink, Navigation } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { RESTAURANT_DATA, RestaurantData } from '../data/restaurant';

interface ContactSectionProps {
  currentLang: Language;
  restaurantData?: RestaurantData;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ currentLang, restaurantData }) => {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[currentLang];
  const restaurant = restaurantData || RESTAURANT_DATA;

  const handleCopyAddress = () => {
    const fullAddress = `${restaurant.name[currentLang]}, ${restaurant.address[currentLang]}`;
    
    // Fallback copy function for restricted iframe sandboxes
    const fallbackCopy = (text: string) => {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Copy address fallback failed', err);
      }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(fullAddress)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        })
        .catch(() => {
          fallbackCopy(fullAddress);
        });
    } else {
      fallbackCopy(fullAddress);
    }
  };

  return (
    <section id="contact" className="py-18 sm:py-24 bg-[#0B0F17] border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#EA580C] mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{t.contact.kicker}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 [text-wrap:balance]">
            {t.contact.title}
          </h2>

          <p className="text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>

        {/* 2-Column Grid: Contact Information & Keyless Embedded Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start text-left">
          {/* Left Column: Contact Details Cards (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            {/* Address Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#111827] border border-gray-800 shadow-xl">
              <div className="flex items-start justify-between gap-4 mb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-950/60 text-[#EA580C] flex items-center justify-center shrink-0 border border-orange-500/40">
                    <MapPin className="w-5 h-5 text-[#EA580C]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {t.contact.addressTitle}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {currentLang === 'th' ? restaurant.address.landmarkTh : restaurant.address.landmarkEn}
                    </span>
                  </div>
                </div>

                {/* Copy Address Button */}
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-black/60 hover:bg-black text-gray-200 border border-gray-700 hover:border-[#EA580C] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#EA580C]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#FACC15]" />
                      <span className="text-[#FACC15]">{t.contact.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                      <span>{t.contact.copyAddress}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                {currentLang === 'th' ? restaurant.address.th : restaurant.address.en}
              </p>

              <div className="pt-3.5 border-t border-gray-800 flex items-center justify-between">
                <a
                  href={restaurant.links.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#FACC15] hover:text-[#EA580C] hover:underline"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>{t.contact.getDirections}</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Operating Hours & Phone Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Hours */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#111827] border border-gray-800 shadow-xl">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-950/60 flex items-center justify-center shrink-0 border border-amber-500/40">
                    <Clock className="w-3.5 h-3.5 text-[#FACC15]" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    {t.contact.hoursTitle}
                  </h4>
                </div>
                <p className="text-xs font-semibold text-white">
                  {currentLang === 'th' ? restaurant.hours.th : restaurant.hours.en}
                </p>
                {restaurant.hours.noteTh && (
                  <p className="text-[11px] text-gray-400 mt-1 leading-normal">
                    {currentLang === 'th' ? restaurant.hours.noteTh : restaurant.hours.noteEn}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#111827] border border-gray-800 shadow-xl">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-950/60 flex items-center justify-center shrink-0 border border-orange-500/40">
                    <Phone className="w-3.5 h-3.5 text-[#EA580C]" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    {t.contact.phoneTitle}
                  </h4>
                </div>
                <a
                  href={`tel:${restaurant.phoneRaw}`}
                  className="text-sm font-bold text-[#FACC15] hover:text-[#EA580C] transition-colors block"
                >
                  {restaurant.phone}
                </a>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  {currentLang === 'th' ? 'โทรสั่งอาหารหรือสอบถามทาง' : 'Click to call for orders'}
                </span>
              </div>
            </div>

            {/* Direct Chat Channels (LINE & WhatsApp) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#111827] border border-gray-800 shadow-xl">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-orange-950/60 flex items-center justify-center shrink-0 border border-orange-500/40">
                  <MessageCircle className="w-3.5 h-3.5 text-[#EA580C]" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  {t.contact.chatTitle}
                </h4>
              </div>
              <p className="text-xs text-gray-300 mb-3.5 leading-relaxed">
                {t.contact.chatDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={restaurant.links.line}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3.5 text-xs font-bold text-white bg-[#06C755] hover:bg-[#05b04b] rounded-lg transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.contact.lineChat}</span>
                </a>

                <a
                  href={restaurant.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-lg transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.contact.whatsappChat}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Keyless Embedded Google Map (6 cols) */}
          <div className="lg:col-span-6">
            <div className="bg-[#111827] p-3 rounded-2xl sm:rounded-3xl border border-gray-800 shadow-xl">
              <div className="relative w-full aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
                <iframe
                  title="Tony's Kitchen Google Maps Location at Nichada Thani Village entrance"
                  src={restaurant.links.embedMap}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="p-3 text-center">
                <span className="text-[11px] text-gray-400">
                  {t.contact.mapNotice}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
