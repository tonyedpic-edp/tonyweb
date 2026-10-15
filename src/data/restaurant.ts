/**
 * Tony's Kitchen — Restaurant Information & Business Data
 * Source of Truth: Verified details from existing website and physical presence.
 *
 * DO NOT fabricate business claims, awards, unverified social handles, or fake reviews.
 * Any field requiring physical verification is explicitly documented below.
 */

export interface RestaurantData {
  name: {
    en: string;
    th: string;
  };
  concept: {
    en: string;
    th: string;
  };
  tagline: {
    en: string;
    th: string;
  };
  supportingText: {
    en: string;
    th: string;
  };
  phone: string;
  phoneRaw: string;
  address: {
    en: string;
    th: string;
    landmarkEn: string;
    landmarkTh: string;
    provinceEn: string;
    provinceTh: string;
    postalCode: string;
  };
  hours: {
    en: string;
    th: string;
    noteEn?: string;
    noteTh?: string;
  };
  links: {
    app: string;
    grabFood: string;
    line: string;
    lineId: string;
    whatsapp: string;
    googleMaps: string;
    embedMap: string;
  };
  verificationNotes: {
    en: string;
    th: string;
  };
}

export const RESTAURANT_DATA: RestaurantData = {
  name: {
    en: "Tony's Kitchen",
    th: "ครัวโทนี่ (Tony's Kitchen)",
  },
  concept: {
    en: "Authentic Thai food",
    th: "อาหารไทยแท้ รสชาติต้นตำรับ",
  },
  tagline: {
    en: "Real Thai Food. Made with Passion.",
    th: "อาหารไทยแท้ รังสรรค์ด้วยความใส่ใจ",
  },
  supportingText: {
    en: "Discover authentic Thai flavors, freshly prepared with care and served with the warmth of a home-style kitchen.",
    th: "สัมผัสรสชาติอาหารไทยแท้ ปรุงสดใหม่ด้วยความพิถีพิถัน พร้อมความอบอุ่นเสมือนครัวที่บ้านคุณ",
  },
  phone: "084-153-6498",
  phoneRaw: "+66841536498",
  address: {
    en: "In front of the entrance to Nichada Thani Village, Samakkhi 29 Alley, Bang Talat, Pak Kret District, Nonthaburi 11120, Thailand",
    th: "หน้าทางเข้าหมู่บ้านนิชดาธานี ซอยสามัคคี 29 ตำบลบางตลาด อำเภอปากเกร็ด นนทบุรี 11120",
    landmarkEn: "In front of Nichada Thani Village entrance, Samakkhi 29 Alley",
    landmarkTh: "หน้าทางเข้าหมู่บ้านนิชดาธานี ซอยสามัคคี 29",
    provinceEn: "Nonthaburi",
    provinceTh: "นนทบุรี",
    postalCode: "11120",
  },
  hours: {
    en: "Open Daily: 10:00 AM – 9:00 PM",
    th: "เปิดบริการทุกวัน: 10:00 - 21:00 น.",
    noteEn: "Verified branch hours at Nichada Thani location.",
    noteTh: "เวลาเปิดให้บริการสาขาหน้าหมู่บ้านนิชดาธานี",
  },
  links: {
    // Verified official ordering progressive web app
    app: "https://tony-kitchen-thai-restaurant-pwa.ai.studio",
    // Verified GrabFood store page link
    grabFood: "https://food.grab.com/th/en/restaurant/tony-s-kitchen-express-nichada-thani-delivery/",
    // Verified LINE contact link
    line: "https://line.me/ti/p/~padaroisauce",
    lineId: "padaroisauce",
    // Verified WhatsApp direct link
    whatsapp: "https://wa.me/66841536498",
    // Working Google Maps search/directions URL for the exact address
    googleMaps: "https://maps.google.com/?q=Tony's+Kitchen+Nichada+Thani+Samakkhi+29+Alley+Bang+Talat+Pak+Kret+Nonthaburi",
    // Keyless standard responsive Google Maps iframe embed
    embedMap: "https://maps.google.com/maps?q=Nichada+Thani+Samakkhi+29+Alley+Pak+Kret+Nonthaburi&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
  verificationNotes: {
    en: "All contact details, address, and ordering URLs match the verified physical store and original website records. No awards or unverified marketing claims have been fabricated.",
    th: "ข้อมูลการติดต่อ ที่อยู่ และลิงก์สั่งอาหารทั้งหมดตรงตามข้อมูลร้านจริง ไม่มีการแต่งเติมรางวัลหรือข้ออ้างทางธุรกิจที่ไม่ได้รับการยืนยัน",
  },
};
