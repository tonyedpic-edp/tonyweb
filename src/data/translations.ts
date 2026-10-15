export type Language = 'th' | 'en';

export interface Translations {
  nav: {
    home: string;
    featured: string;
    menu: string;
    about: string;
    order: string;
    contact: string;
    orderButton: string;
    langToggleAria: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    kicker: string;
    headline: string;
    subheadline: string;
    exploreMenu: string;
    orderOnline: string;
    hoursLabel: string;
    locationLabel: string;
    phoneLabel: string;
    authenticBadge: string;
  };
  featured: {
    kicker: string;
    title: string;
    subtitle: string;
    viewDetails: string;
    orderNow: string;
    currency: string;
  };
  menu: {
    kicker: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    noResultsTitle: string;
    noResultsDesc: string;
    resetSearch: string;
    spiceLevel: string;
    mild: string;
    medium: string;
    hot: string;
    nonSpicy: string;
    viewDetails: string;
    orderThisDish: string;
    contactForPrice: string;
    verifiedPriceNote: string;
    currency: string;
  };
  modal: {
    ingredientsTitle: string;
    customizationTitle: string;
    spiceLevelTitle: string;
    orderViaApp: string;
    orderViaGrab: string;
    orderViaLine: string;
    closeModal: string;
  };
  orderSection: {
    kicker: string;
    title: string;
    subtitle: string;
    appCard: {
      tag: string;
      title: string;
      desc: string;
      button: string;
    };
    grabCard: {
      tag: string;
      title: string;
      desc: string;
      button: string;
    };
    lineCard: {
      tag: string;
      title: string;
      desc: string;
      button: string;
    };
    whatsappCard: {
      tag: string;
      title: string;
      desc: string;
      button: string;
    };
    callDirect: string;
  };
  about: {
    kicker: string;
    title: string;
    p1: string;
    p2: string;
    p3: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    viewMap: string;
    exploreMenuCTA: string;
  };
  contact: {
    kicker: string;
    title: string;
    subtitle: string;
    addressTitle: string;
    copyAddress: string;
    copied: string;
    hoursTitle: string;
    phoneTitle: string;
    callNow: string;
    chatTitle: string;
    chatDesc: string;
    lineChat: string;
    whatsappChat: string;
    getDirections: string;
    mapNotice: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    orderingChannels: string;
    hoursHeading: string;
    addressHeading: string;
    rights: string;
    verifiedNote: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  th: {
    nav: {
      home: 'หน้าแรก',
      featured: 'เมนูแนะนำ',
      menu: 'เมนูอาหาร',
      about: 'เกี่ยวกับเรา',
      order: 'สั่งอาหาร',
      contact: 'ติดต่อเรา',
      orderButton: 'สั่งอาหารออนไลน์',
      langToggleAria: 'เปลี่ยนเป็นภาษาอังกฤษ (Switch to English)',
      openMenu: 'เปิดเมนู',
      closeMenu: 'ปิดเมนู',
    },
    hero: {
      kicker: 'ครัวโทนี่ · ร้านอาหารไทยหน้าหมู่บ้านนิชดาธานี',
      headline: 'Real Thai Food. Made with Passion.',
      subheadline:
        'สัมผัสรสชาติอาหารไทยแท้ ปรุงสดใหม่ด้วยความพิถีพิถัน พร้อมความอบอุ่นเสมือนครัวที่บ้านคุณ',
      exploreMenu: 'ดูเมนูทั้งหมด',
      orderOnline: 'สั่งอาหารออนไลน์',
      hoursLabel: 'เปิดบริการทุกวัน',
      locationLabel: 'หน้าทางเข้าหมู่บ้านนิชดาธานี ซอยสามัคคี 29',
      phoneLabel: 'โทรสั่งอาหาร',
      authenticBadge: 'รสชาติต้นตำรับแท้',
    },
    featured: {
      kicker: 'เมนูพิเศษคัดสรร',
      title: 'จานเด็ดแนะนำจากครัวโทนี่',
      subtitle:
        'รสชาติจัดจ้าน หอมกลิ่นกระทะคั่วแท้ และวัตถุดิบสมุนไพรสดใหม่ที่ปรุงอย่างใส่ใจทุกจาน',
      viewDetails: 'ดูรายละเอียด',
      orderNow: 'สั่งเมนูนี้',
      currency: 'บาท',
    },
    menu: {
      kicker: 'เมนูอาหารปรุงสดใหม่',
      title: 'อาหารไทยจานโปรด ปรุงสดตามสั่ง',
      subtitle:
        'คัดสรรวัตถุดิบคุณภาพ ปรุงสดใหม่จานต่อจานตามแบบฉบับอาหารไทยแท้ พร้อมราคาจริงหน้าร้าน',
      searchPlaceholder: 'ค้นหาเมนู เช่น กะเพรา, ผัดไทย, ต้มยำ...',
      allCategories: 'ทุกหมวดหมู่',
      noResultsTitle: 'ไม่พบเมนูที่ค้นหา',
      noResultsDesc: 'ลองค้นหาด้วยคำอื่น หรือเลือกดูหมวดหมู่ด้านบน',
      resetSearch: 'ล้างคำค้นหา',
      spiceLevel: 'ความเผ็ด',
      mild: 'เผ็ดน้อย',
      medium: 'เผ็ดกลาง',
      hot: 'เผ็ดจัดจ้าน',
      nonSpicy: 'ไม่เผ็ด',
      viewDetails: 'ดูรายละเอียด',
      orderThisDish: 'สั่งอาหาร',
      contactForPrice: 'กรุณาสอบถามราคาปัจจุบันที่หน้าร้าน',
      verifiedPriceNote: '* ราคาอาหารทุกรายการตรงตามข้อมูลจริงของร้าน Tony’s Kitchen',
      currency: '฿',
    },
    modal: {
      ingredientsTitle: 'ความพิเศษของเมนูนี้',
      customizationTitle: 'ตัวเลือกเพิ่มเติม',
      spiceLevelTitle: 'ระดับความเผ็ด',
      orderViaApp: 'สั่งผ่านเว็บแอป Tony’s Kitchen',
      orderViaGrab: 'สั่งผ่าน GrabFood',
      orderViaLine: 'สั่งทาง LINE (ID: padaroisauce)',
      closeModal: 'ปิดหน้าต่าง',
    },
    orderSection: {
      kicker: 'ช่องทางสั่งอาหารที่สะดวกสบาย',
      title: 'สั่งอาหารออนไลน์กับ Tony’s Kitchen',
      subtitle:
        'เลือกช่องทางที่สะดวกที่สุดสำหรับคุณ ทั้งเว็บแอปสั่งอาหารอย่างเป็นทางการ GrabFood หรือสั่งตรงกับทางร้าน',
      appCard: {
        tag: 'ช่องทางหลักแนะนำ',
        title: 'สั่งผ่านเว็บแอป Tony’s Kitchen',
        desc: 'ระบบสั่งอาหารออนไลน์อย่างเป็นทางการ เมนูครบครัน สั่งง่ายบนมือถือทุกระบบ ไม่ต้องดาวน์โหลดแอป',
        button: 'เปิดเว็บแอปสั่งอาหาร',
      },
      grabCard: {
        tag: 'จัดส่งด่วนเดลิเวอรี',
        title: 'สั่งผ่าน GrabFood',
        desc: 'บริการจัดส่งรวดเร็วถึงบ้านคุณโดยไรเดอร์ GrabFood ติดตามสถานะออเดอร์แบบเรียลไทม์',
        button: 'สั่งผ่าน GrabFood',
      },
      lineCard: {
        tag: 'แชทสั่งตรงกับร้าน',
        title: 'ติดต่อผ่าน LINE',
        desc: 'สอบถามรายละเอียด สั่งอาหารล่วงหน้า หรือแจ้งคำขอพิเศษโดยตรงผ่าน LINE ID: padaroisauce',
        button: 'คุยทาง LINE',
      },
      whatsappCard: {
        tag: 'แชทผ่าน WhatsApp',
        title: 'ติดต่อผ่าน WhatsApp',
        desc: 'สะดวกสบายสำหรับลูกค้าต่างชาติและชาวต่างชาติในหมู่นิชดาธานี ติดต่อที่ +66 84 153 6498',
        button: 'แชททาง WhatsApp',
      },
      callDirect: 'หรือโทรสั่งอาหารโดยตรงที่เบอร์',
    },
    about: {
      kicker: 'เรื่องราวของครัวโทนี่',
      title: 'ความตั้งใจในทุกจานรสชาติไทยแท้',
      p1: 'Tony’s Kitchen (ครัวโทนี่) ตั้งอยู่บริเวณหน้าทางเข้าหมู่บ้านนิชดาธานี ซอยสามัคคี 29 ตำบลบางตลาด อำเภอปากเกร็ด จังหวัดนนทบุรี ให้บริการอาหารไทยแท้ตามสั่งด้วยความใส่ใจและรสชาติที่จริงใจ',
      p2: 'เราเชื่อมั่นว่าอาหารไทยที่ดี ต้องปรุงสดใหม่ด้วยไฟแรงของกระทะเหล็ก ใช้ใบกะเพราไทยแท้ พริกสด และกระเทียมไทยคั่วหอม เพื่อดึงรสชาติและกลิ่น Wok Hei อันเป็นเอกลักษณ์ออกมาอย่างเต็มที่',
      p3: 'เราพร้อมต้อนรับทั้งลูกค้าที่แวะมารับอาหารหน้าร้านและผู้สั่งผ่านช่องทางเดลิเวอรี ด้วยมาตรฐานความสะอาด วัตถุดิบสดใหม่ และรสชาติที่คุ้มค่าในทุกมื้อ',
      pillar1Title: 'สมุนไพรสดและกะเพราแท้',
      pillar1Desc: 'ใช้ใบกะเพราสดกลิ่นหอม พริกขี้หนู และกระเทียมสดตำใหม่จานต่อจาน',
      pillar2Title: 'ไฟกระทะแรงกลิ่น Wok Hei',
      pillar2Desc: 'เทคนิคการผัดด้วยไฟแรงจัด คั่วแห้งเข้าเนื้อ ไม่อมน้ำมัน',
      pillar3Title: 'ปรุงสดใหม่ทุกออเดอร์',
      pillar3Desc: 'อาหารทุกจานปรุงตามสั่ง เสิร์ฟร้อนพร้อมกลิ่นหอมกรุ่น',
      viewMap: 'ดูแผนที่ตั้งร้านบน Google Maps',
      exploreMenuCTA: 'ดูเมนูอาหารทั้งหมด',
    },
    contact: {
      kicker: 'ที่ตั้งและข้อมูลติดต่อ',
      title: 'แวะมาหาเราหรือโทรสั่งอาหาร',
      subtitle:
        'ยินดีต้อนรับทุกท่าน ทั้งการมารับอาหารหน้าร้านและสั่งผ่านช่องทางออนไลน์ต่างๆ',
      addressTitle: 'ที่อยู่ร้าน',
      copyAddress: 'คัดลอกที่อยู่',
      copied: 'คัดลอกเรียบร้อยแล้ว!',
      hoursTitle: 'เวลาเปิดบริการ',
      phoneTitle: 'เบอร์โทรศัพท์ติดต่อ',
      callNow: 'โทรออกทันที',
      chatTitle: 'แชทติดต่อสอบถาม',
      chatDesc: 'สามารถทักไลน์หรือวอทส์แอปเพื่อสอบถามเมนูและสั่งอาหารได้ตลอดเวลาทำการ',
      lineChat: 'LINE ID: padaroisauce',
      whatsappChat: 'WhatsApp: +66 84 153 6498',
      getDirections: 'เปิดแผนที่นำทาง Google Maps',
      mapNotice: 'ตั้งอยู่บริเวณหน้าทางเข้าหมู่บ้านนิชดาธานี ซอยสามัคคี 29 ตำบลบางตลาด ปากเกร็ด นนทบุรี',
    },
    footer: {
      tagline: 'Real Thai Food. Made with Passion.',
      quickLinks: 'เมนูลัด',
      orderingChannels: 'ช่องทางสั่งอาหาร',
      hoursHeading: 'เวลาทำการ',
      addressHeading: 'ที่อยู่ร้าน',
      rights: 'สงวนลิขสิทธิ์ทั้งหมด',
      verifiedNote: 'ร้านอาหารไทยแท้ หน้าทางเข้าหมู่บ้านนิชดาธานี นนทบุรี',
    },
  },
  en: {
    nav: {
      home: 'Home',
      featured: 'Featured',
      menu: 'Menu',
      about: 'About',
      order: 'Order Online',
      contact: 'Contact',
      orderButton: 'Order Now',
      langToggleAria: 'Switch to Thai (เปลี่ยนเป็นภาษาไทย)',
      openMenu: 'Open Menu',
      closeMenu: 'Close Menu',
    },
    hero: {
      kicker: "Tony's Kitchen · Authentic Thai at Nichada Thani",
      headline: 'Real Thai Food. Made with Passion.',
      subheadline:
        'Discover authentic Thai flavors, freshly prepared with care and served with the warmth of a home-style kitchen.',
      exploreMenu: 'Explore Our Menu',
      orderOnline: 'Order Online',
      hoursLabel: 'Open Daily',
      locationLabel: 'In front of Nichada Thani Village entrance, Samakkhi 29 Alley',
      phoneLabel: 'Call for Orders',
      authenticBadge: 'Authentic Thai Taste',
    },
    featured: {
      kicker: "House Specialties",
      title: "Featured Thai Dishes",
      subtitle:
        'Handcrafted with vibrant fresh herbs, balanced seasonings, and authentic high-heat wok flame.',
      viewDetails: 'View Details',
      orderNow: 'Order Dish',
      currency: 'THB',
    },
    menu: {
      kicker: 'Freshly Prepared À La Carte',
      title: 'Our Authentic Thai Menu',
      subtitle:
        'Cooked to order with quality fresh produce and true balance of spicy, sour, sweet, and savory Thai flavors.',
      searchPlaceholder: 'Search dishes e.g. Basil, Pad Thai, Tom Yum...',
      allCategories: 'All Categories',
      noResultsTitle: 'No dishes found',
      noResultsDesc: 'Try adjusting your search terms or select a category above.',
      resetSearch: 'Reset Search',
      spiceLevel: 'Spice Level',
      mild: 'Mild',
      medium: 'Medium',
      hot: 'Thai Spicy',
      nonSpicy: 'Non-Spicy',
      viewDetails: 'View Details',
      orderThisDish: 'Order Dish',
      contactForPrice: 'Please contact the restaurant for current price',
      verifiedPriceNote: '* All prices reflect verified in-restaurant pricing at Tony’s Kitchen.',
      currency: '฿',
    },
    modal: {
      ingredientsTitle: 'Dish Highlights',
      customizationTitle: 'Customization Options',
      spiceLevelTitle: 'Spiciness',
      orderViaApp: "Order via Tony's Kitchen App",
      orderViaGrab: 'Order on GrabFood',
      orderViaLine: 'Order via LINE (ID: padaroisauce)',
      closeModal: 'Close Window',
    },
    orderSection: {
      kicker: 'Convenient Ordering Channels',
      title: 'Order Online from Tony’s Kitchen',
      subtitle:
        'Select your preferred ordering method: our official web app, GrabFood delivery, or direct chat and telephone.',
      appCard: {
        tag: 'Recommended Channel',
        title: "Tony's Kitchen Web App",
        desc: 'Our official mobile web ordering app. Browse the full menu and place orders directly on your browser without downloading any software.',
        button: 'Open Ordering App',
      },
      grabCard: {
        tag: 'Instant Delivery',
        title: 'Order on GrabFood',
        desc: 'Get your favorite Thai dishes delivered hot and fresh directly to your door with live GPS tracking.',
        button: 'Order via GrabFood',
      },
      lineCard: {
        tag: 'Direct Messaging',
        title: 'Chat via LINE',
        desc: 'Have special dietary requests or prefer placing chat orders? Connect directly via LINE ID: padaroisauce.',
        button: 'Open LINE Chat',
      },
      whatsappCard: {
        tag: 'International Chat',
        title: 'Chat via WhatsApp',
        desc: 'Convenient for international residents and visitors in Nichada Thani. Reach us at +66 84 153 6498.',
        button: 'Open WhatsApp',
      },
      callDirect: 'Or call the restaurant directly at',
    },
    about: {
      kicker: "About Tony's Kitchen",
      title: 'Authentic Thai Food. Made with Passion.',
      p1: "Tony’s Kitchen is an authentic Thai culinary kitchen located right in front of the entrance to Nichada Thani Village on Samakkhi 29 Alley in Bang Talat, Pak Kret District, Nonthaburi.",
      p2: 'We believe real Thai food should never be hurried or diluted. That is why we hand-pick pungent holy basil, pound fresh bird’s eye chilies and garlic daily, and master the extreme heat of the wok to capture the irreplaceable fragrance known as Wok Hei.',
      p3: 'Whether you are a longtime resident of Nichada Thani or ordering online from your home or office, Tony’s Kitchen is dedicated to delivering consistent, generous, and hearty Thai cooking that feels like home.',
      pillar1Title: 'Fresh Herbs & Genuine Holy Basil',
      pillar1Desc: 'We strictly use authentic Thai holy basil (Bai Kra Pao) and fresh market chilies—never fillers.',
      pillar2Title: 'Wok Hei Mastery',
      pillar2Desc: 'Searing wok heat that creates a lightly smoky, deeply aromatic caramelization in every stir-fry.',
      pillar3Title: 'Cooked Fresh to Order',
      pillar3Desc: 'Every plate is cooked from scratch when the order comes in, ensuring crispy textures and piping hot aroma.',
      viewMap: 'View Location on Google Maps',
      exploreMenuCTA: 'Explore Complete Menu',
    },
    contact: {
      kicker: 'Location & Working Hours',
      title: 'Visit Us or Get in Touch',
      subtitle:
        'We welcome dine-in pickup orders and online deliveries throughout Pak Kret and surrounding neighborhoods.',
      addressTitle: 'Restaurant Location',
      copyAddress: 'Copy Address',
      copied: 'Address Copied!',
      hoursTitle: 'Operating Hours',
      phoneTitle: 'Telephone Number',
      callNow: 'Call 084-153-6498',
      chatTitle: 'Chat Directly',
      chatDesc: 'Contact us via LINE or WhatsApp for quick inquiries, large orders, or dietary specifications.',
      lineChat: 'LINE ID: padaroisauce',
      whatsappChat: 'WhatsApp: +66 84 153 6498',
      getDirections: 'Get Google Maps Directions',
      mapNotice: 'Located in front of Nichada Thani Village entrance, Samakkhi 29 Alley, Bang Talat, Pak Kret.',
    },
    footer: {
      tagline: 'Real Thai Food. Made with Passion.',
      quickLinks: 'Quick Links',
      orderingChannels: 'Ordering Options',
      hoursHeading: 'Kitchen Hours',
      addressHeading: 'Address',
      rights: 'All rights reserved.',
      verifiedNote: 'Authentic Thai Restaurant at Nichada Thani, Nonthaburi, Thailand.',
    },
  },
};
