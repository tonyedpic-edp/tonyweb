import React from 'react';
import { Smartphone, Bike, MessageCircle, Phone, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { RESTAURANT_DATA } from '../data/restaurant';

interface OrderSectionProps {
  currentLang: Language;
}

export const OrderSection: React.FC<OrderSectionProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <section id="order" className="py-18 sm:py-24 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#EA580C] mb-3">
            <Smartphone className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{t.orderSection.kicker}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111827] mb-4 [text-wrap:balance]">
            {t.orderSection.title}
          </h2>

          <p className="text-base text-[#4B5563] leading-relaxed max-w-2xl mx-auto">
            {t.orderSection.subtitle}
          </p>
        </div>

        {/* 4 Ordering Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left mb-12">
          {/* Channel 1: Official Web App */}
          <div className="relative bg-white rounded-2xl p-6 sm:p-7 border-2 border-[#EA580C] shadow-sm flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-card">
            <div className="absolute -top-3 left-6 bg-[#111827] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-sm shadow-xs border border-[#F59E0B]">
              {t.orderSection.appCard.tag}
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center mb-5 mt-1 border border-[#FED7AA]">
                <Smartphone className="w-6 h-6 text-[#EA580C]" />
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111827] mb-2 leading-snug">
                {t.orderSection.appCard.title}
              </h3>

              <p className="text-xs text-[#4B5563] leading-relaxed mb-5">
                {t.orderSection.appCard.desc}
              </p>

              <div className="space-y-2 mb-6 text-xs text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                  <span>{currentLang === 'th' ? 'เมนูแท้ตรงตามหน้าร้าน' : 'Full official menu & prices'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                  <span>{currentLang === 'th' ? 'เปิดสั่งได้ทันทีบนเบราว์เซอร์' : 'Instant in-browser ordering'}</span>
                </div>
              </div>
            </div>

            <a
              href={RESTAURANT_DATA.links.app}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg transition-colors shadow-2xs hover:shadow-xs"
            >
              <span>{t.orderSection.appCard.button}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FACC15]" />
            </a>
          </div>

          {/* Channel 2: GrabFood */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-2xs flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-card">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E8F8EE] text-[#00B14F] flex items-center justify-center mb-5">
                <Bike className="w-6 h-6 text-[#00B14F]" />
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111827] mb-2 leading-snug">
                {t.orderSection.grabCard.title}
              </h3>

              <p className="text-xs text-[#4B5563] leading-relaxed mb-5">
                {t.orderSection.grabCard.desc}
              </p>

              <div className="space-y-2 mb-6 text-xs text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00B14F] shrink-0" />
                  <span>{currentLang === 'th' ? 'ส่งด่วนถึงบ้านโดยไรเดอร์' : 'Fast GrabFood delivery'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00B14F] shrink-0" />
                  <span>{currentLang === 'th' ? 'ติดตามไรเดอร์แบบเรียลไทม์' : 'Real-time GPS tracking'}</span>
                </div>
              </div>
            </div>

            <a
              href={RESTAURANT_DATA.links.grabFood}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#00B14F] hover:bg-[#009A44] rounded-lg transition-colors shadow-2xs hover:shadow-xs"
            >
              <span>{t.orderSection.grabCard.button}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Channel 3: LINE Chat */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-2xs flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-card">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E6F9EE] text-[#06C755] flex items-center justify-center mb-5">
                <MessageCircle className="w-6 h-6 text-[#06C755]" />
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111827] mb-2 leading-snug">
                {t.orderSection.lineCard.title}
              </h3>

              <p className="text-xs text-[#4B5563] leading-relaxed mb-5">
                {t.orderSection.lineCard.desc}
              </p>

              <div className="space-y-2 mb-6 text-xs text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#06C755] shrink-0" />
                  <span>{currentLang === 'th' ? 'สั่งล่วงหน้ารับหน้าร้านได้' : 'Pre-order for pickup'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#06C755] shrink-0" />
                  <span>ID: {RESTAURANT_DATA.links.lineId}</span>
                </div>
              </div>
            </div>

            <a
              href={RESTAURANT_DATA.links.line}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#06C755] hover:bg-[#05b04b] rounded-lg transition-colors shadow-2xs hover:shadow-xs"
            >
              <span>{t.orderSection.lineCard.button}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Channel 4: WhatsApp Chat */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-2xs flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-card">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E8FAF0] text-[#25D366] flex items-center justify-center mb-5">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111827] mb-2 leading-snug">
                {t.orderSection.whatsappCard.title}
              </h3>

              <p className="text-xs text-[#4B5563] leading-relaxed mb-5">
                {t.orderSection.whatsappCard.desc}
              </p>

              <div className="space-y-2 mb-6 text-xs text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                  <span>{currentLang === 'th' ? 'สะดวกสำหรับลูกค้าต่างชาติ' : 'English chat friendly'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                  <span>+66 84 153 6498</span>
                </div>
              </div>
            </div>

            <a
              href={RESTAURANT_DATA.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#25D366] hover:bg-[#20ba59] rounded-lg transition-colors shadow-2xs hover:shadow-xs"
            >
              <span>{t.orderSection.whatsappCard.button}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Direct Phone Call Banner */}
        <div className="max-w-2xl mx-auto p-4.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-center shadow-2xs">
          <p className="text-xs sm:text-sm text-[#111827] flex items-center justify-center flex-wrap gap-1.5">
            <span>{t.orderSection.callDirect}</span>
            <a
              href={`tel:${RESTAURANT_DATA.phoneRaw}`}
              className="inline-flex items-center gap-1.5 font-bold text-[#EA580C] hover:text-[#C2410C] hover:underline underline-offset-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{RESTAURANT_DATA.phone}</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
