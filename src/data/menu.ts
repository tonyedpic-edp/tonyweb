/**
 * Tony's Kitchen — Authentic Menu Data
 *
 * Menu items reflect verified traditional offerings at Tony's Kitchen.
 * Prices are authentic and in Thai Baht (THB).
 * If any price or dish modification requires daily verification at the kitchen counter,
 * the `priceVerified` flag and notes document it explicitly.
 */

// Import images bundled by Vite (automatically resolves base URL on GitHub Pages)
import heroKrapowImg from '@/src/assets/images/hero_pad_krapow_1792052171401.jpg';
import signatureKrapowImg from '@/src/assets/images/signature_pad_krapow_1792052172767.jpg';
import padThaiImg from '@/src/assets/images/dish_pad_thai_1792052174152.jpg';
import tomYumImg from '@/src/assets/images/dish_tom_yum_1792052175362.jpg';
import greenCurryImg from '@/src/assets/images/dish_green_curry_1792052174672.jpg';

export { heroKrapowImg, signatureKrapowImg, padThaiImg, tomYumImg, greenCurryImg };

export interface MenuCategory {
  id: string;
  nameTh: string;
  nameEn: string;
  descriptionTh: string;
  descriptionEn: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  nameTh: string;
  nameEn: string;
  descriptionTh?: string;
  descriptionEn?: string;
  price?: number; // Verified price in THB; omitted if unverified
  priceVerified: boolean;
  image?: string;
  isFeatured?: boolean; // Featured in signature/spotlight section
  available: boolean;
  spiciness: 0 | 1 | 2 | 3; // 0 = non-spicy, 1 = mild, 2 = medium, 3 = hot
  orderUrl?: string; // Specific order link or defaults to app
  customizationsTh?: string[];
  customizationsEn?: string[];
}

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'all',
    nameTh: 'ทุกหมวดหมู่',
    nameEn: 'All Dishes',
    descriptionTh: 'รวมเมนูอาหารไทยปรุงสดใหม่ตามสั่งทุกรายการ',
    descriptionEn: 'Full selection of authentic Thai dishes prepared fresh to order.',
  },
  {
    id: 'wok-basil',
    nameTh: 'ผัดกะเพราและเมนูผัด',
    nameEn: 'Wok & Holy Basil',
    descriptionTh: 'ผัดกะเพราแท้หอมกลิ่นกระทะ คั่วพริกแห้งและใบกะเพราสดรสชาติเข้มข้น',
    descriptionEn: 'High-heat wok tossed holy basil and classic Thai stir-fries with authentic aroma.',
  },
  {
    id: 'noodles',
    nameTh: 'ก๋วยเตี๋ยวและผัดไทย',
    nameEn: 'Noodles & Pad Thai',
    descriptionTh: 'ผัดไทยสูตรเด็ด ผัดซีอิ๊ว และเมนูเส้นรสกลมกล่อม',
    descriptionEn: 'Traditional wok-seared noodles, signature Pad Thai, and noodle specialties.',
  },
  {
    id: 'curry-soup',
    nameTh: 'แกงและต้มยำ',
    nameEn: 'Curries & Soups',
    descriptionTh: 'ต้มยำรสแซ่บ แกงกะทิเข้มข้น หอมสมุนไพรสดแท้',
    descriptionEn: 'Rich coconut curries, aromatic herb broths, and authentic Tom Yum.',
  },
  {
    id: 'rice',
    nameTh: 'อาหารจานเดียว',
    nameEn: 'Rice Dishes',
    descriptionTh: 'ข้าวผัดสูตรโบราณ และอาหารจานเดียวอิ่มอร่อยคุ้มค่า',
    descriptionEn: 'Comforting Thai fried rice and single-plate rice favorites.',
  },
  {
    id: 'sides',
    nameTh: 'เครื่องเคียงและเพิ่มเติม',
    nameEn: 'Sides & Extras',
    descriptionTh: 'ไข่ดาวขอบกรอบ ข้าวหอมมะลิ และเครื่องเคียงคู่ความอร่อย',
    descriptionEn: 'Crispy fried eggs, steamed jasmine rice, and extra accompaniments.',
  },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'pad-krapow-gai',
    categoryId: 'wok-basil',
    nameTh: 'ผัดกะเพราไก่ + ไข่ดาวกรอบ',
    nameEn: 'Thai Basil Chicken with Fried Egg',
    descriptionTh: 'เมนูซิกเนเจอร์ประจำร้าน: เนื้อไก่สับผัดกะเพราแท้ รสชาติจัดจ้านคั่วแห้งหอมกลิ่นกระทะ พริกกระเทียมสด ทานคู่ข้าวหอมมะลิและไข่ดาวกรอบขอบกรอบไข่แดงเยิ้ม',
    descriptionEn: 'Tony’s signature stir-fry: finely minced chicken wok-tossed with fresh Thai holy basil, garlic, and bird’s eye chilies. Served with steamed jasmine rice and a crispy Thai fried egg with runny yolk.',
    price: 85,
    priceVerified: true,
    image: signatureKrapowImg,
    isFeatured: true,
    available: true,
    spiciness: 3,
    customizationsTh: ['เลือกระดับความเผ็ด: เผ็ดน้อย, เผ็ดกลาง, เผ็ดจัดจ้าน', 'เพิ่มไข่ดาวกรอบ (+15 บาท)'],
    customizationsEn: ['Choose spice level: Mild, Medium, Thai Spicy', 'Add extra crispy fried egg (+15 THB)'],
  },
  {
    id: 'pad-krapow-moo-krob',
    categoryId: 'wok-basil',
    nameTh: 'ผัดกะเพราหมูกรอบราดข้าว',
    nameEn: 'Crispy Pork Belly Basil with Rice',
    descriptionTh: 'หมูกรอบชิ้นหนาหนังกรอบฟู คั่วกะเพราพริกสดรสจัดจ้าน ซอสเคลือบหมูเข้มข้น หอมใบกะเพราสด ราดข้าวหอมมะลิร้อนๆ',
    descriptionEn: 'Golden crispy pork belly tossed in screaming-hot wok with holy basil leaves, fresh bird’s eye chilies, and savory dark sauce over jasmine rice.',
    price: 95,
    priceVerified: true,
    isFeatured: true,
    available: true,
    spiciness: 3,
  },
  {
    id: 'pad-thai-kung',
    categoryId: 'noodles',
    nameTh: 'ผัดไทยกุ้งสดแม่น้ำ',
    nameEn: 'Signature Pad Thai with Tiger Prawns',
    descriptionTh: 'ผัดไทยสูตรพิเศษ กุ้งสดตัวโต เส้นจันทน์เหนียวนุ่ม ผัดเคลือบซอสมะขามเปียกเคี่ยวเองรสชาติสามรสกลมกล่อม เสิร์ฟพร้อมถั่วงอกสด กุยช่าย มะนาว และถั่วคั่วหอม',
    descriptionEn: 'Traditional Thai rice noodles wok-stirred with fresh tiger prawns, firm tofu, pickled radish, eggs, Chinese chives, roasted crushed peanuts, and house-made tamarind sauce.',
    price: 95,
    priceVerified: true,
    image: padThaiImg,
    isFeatured: true,
    available: true,
    spiciness: 1,
    customizationsTh: ['ไม่ใส่ถั่วลิสง (แจ้งได้)', 'เลือกระดับความเผ็ด'],
    customizationsEn: ['Peanut-free option on request', 'Spice preference option'],
  },
  {
    id: 'tom-yum-goong',
    categoryId: 'curry-soup',
    nameTh: 'ต้มยำกุ้งน้ำข้นสมุนไพรสด',
    nameEn: 'Authentic Tom Yum Goong Soup',
    descriptionTh: 'ต้มยำกุ้งสูตรเด็ด กุ้งสดเนื้อแน่น น้ำซุปเข้มข้นกลมกล่อม หอมกลิ่นตะไคร้ ใบมะกรูด ข่าแก่ และพริกเผาแท้ ปรุงรสต้มยำครบรส เปรี้ยว เผ็ด เค็ม หวาน',
    descriptionEn: 'World-renowned hot and sour soup infused with fresh lemongrass, galangal, kaffir lime leaves, straw mushrooms, sweet chili jam, and succulent prawns.',
    price: 130,
    priceVerified: true,
    image: tomYumImg,
    isFeatured: true,
    available: true,
    spiciness: 2,
  },
  {
    id: 'green-curry-gai',
    categoryId: 'curry-soup',
    nameTh: 'แกงเขียวหวานไก่กะทิสด',
    nameEn: 'Central Thai Green Curry with Chicken',
    descriptionTh: 'แกงเขียวหวานสูตรโบราณ หัวกะทิเคี่ยวแตกมัน หอมเครื่องแกงตำสด เนื้อไก่นุ่มละมุน มะเขือเปราะกรอบหวาน และใบโหระพาสดกลิ่นหอมอบอวล',
    descriptionEn: 'Tender chicken slices gently simmered in fresh coconut milk, aromatic green curry paste, Thai round eggplants, and sweet basil leaves.',
    price: 110,
    priceVerified: true,
    image: greenCurryImg,
    isFeatured: false,
    available: true,
    spiciness: 2,
  },
  {
    id: 'pad-see-ew',
    categoryId: 'noodles',
    nameTh: 'ผัดซีอิ๊วเส้นใหญ่หมู / ไก่',
    nameEn: 'Stir-Fried Wide Rice Noodles (Pad See Ew)',
    descriptionTh: 'เส้นใหญ่ผัดซีอิ๊วหอมกลิ่นคั่วกระทะ เนื้อหมูหมักนุ่ม คะน้าฮ่องกงยอดอ่อนกรอบ ไข่ไก่สด และซีอิ๊วดำชั้นดี ผัดแห้งไม่อมน้ำมัน',
    descriptionEn: 'Fresh wide rice flat noodles flash-fried in a searing wok with tender pork slices, Chinese broccoli (gai lan), farm eggs, and superior dark sweet soy sauce.',
    price: 75,
    priceVerified: true,
    isFeatured: false,
    available: true,
    spiciness: 0,
  },
  {
    id: 'spaghetti-pad-kee-mao',
    categoryId: 'noodles',
    nameTh: 'สปาเก็ตตี้ผัดขี้เมาทะเล / ไก่',
    nameEn: 'Spicy Drunken Spaghetti (Pad Kee Mao)',
    descriptionTh: 'เส้นสปาเก็ตตี้เหนียวนุ่ม ผัดขี้เมาเผ็ดร้อนถึงใจ ใส่พริกไทยอ่อน กระชายซอย ใบกะเพรา และพริกขี้หนูสด รสชาติจัดจ้านหอมสมุนไพรไทย',
    descriptionEn: 'Al dente spaghetti noodles tossed with young green peppercorns, fingerroot, fresh sweet basil, garlic, and fresh chilies for a bold aromatic flavor.',
    price: 85,
    priceVerified: true,
    isFeatured: false,
    available: true,
    spiciness: 3,
  },
  {
    id: 'garlic-pepper-pork',
    categoryId: 'wok-basil',
    nameTh: 'หมู / ไก่ ทอดกระเทียมพริกไทยราดข้าว',
    nameEn: 'Garlic & White Pepper Stir-Fry with Rice',
    descriptionTh: 'หมูหมักนุ่มผัดกระเทียมโทนเจียวเหลืองกรอบ พริกไทยขาวป่นหอมเตะจมูก ซอสเข้มข้นรสกลมกล่อม ราดข้าวสวยร้อนๆ ทานคู่แตงกวาสด',
    descriptionEn: 'Tender marinated meat slices sautéed with abundant golden crispy garlic and crushed white pepper in savory sauce, served on steaming jasmine rice.',
    price: 75,
    priceVerified: true,
    isFeatured: false,
    available: true,
    spiciness: 0,
  },
  {
    id: 'thai-fried-rice',
    categoryId: 'rice',
    nameTh: 'ข้าวผัดโบราณ หมู / ไก่ / กุ้ง',
    nameEn: 'Traditional Thai Fried Rice (Khao Pad)',
    descriptionTh: 'ข้าวผัดรสชาติต้นตำรับ เม็ดข้าวร่วนสวยหอมกลิ่นกระทะ คะน้า มะเขือเทศ หอมใหญ่ และไข่ไก่ เสิร์ฟพร้อมพริกน้ำปลา มะนาวผ่าซีก และต้นหอม',
    descriptionEn: 'Jasmine rice wok-fried with farm eggs, diced onions, tomatoes, Chinese broccoli, and light soy seasoning. Served with fresh lime and chili fish sauce.',
    price: 75,
    priceVerified: true,
    isFeatured: false,
    available: true,
    spiciness: 0,
  },
  {
    id: 'suki-stirfry',
    categoryId: 'noodles',
    nameTh: 'สุกี้แห้งทะเล / หมู รวมมิตร',
    nameEn: 'Thai Suki Glass Noodle Stir-Fry',
    descriptionTh: 'วุ้นเส้นเหนียวนุ่มผัดสุกี้ ผักกาดขาว ผักบุ้ง ขึ้นฉ่าย ไข่ไก่ ผัดแห้งเข้ากับน้ำจิ้มสุกี้เต้าหู้ยี้สูตรเด็ดของร้าน รสชาติเข้มข้นจัดจ้าน',
    descriptionEn: 'Clear glass noodles stir-fried with Chinese cabbage, morning glory, celery, eggs, choice of meat or seafood, and house-made fermented chili suki sauce.',
    price: 80,
    priceVerified: true,
    isFeatured: false,
    available: true,
    spiciness: 1,
  },
  {
    id: 'crispy-fried-egg',
    categoryId: 'sides',
    nameTh: 'ไข่ดาวขอบกรอบไข่แดงเยิ้ม (Kai Dao)',
    nameEn: 'Crispy Thai Style Fried Egg (Kai Dao)',
    descriptionTh: 'ไข่ดาวทอดสไตล์ไทย ขอบกรอบฟูสีทอง ไข่แดงยางมะตูมเยิ้มฉ่ำ เข้ากันที่สุดกับผัดกะเพราและข้าวผัด',
    descriptionEn: 'The quintessential Thai accompaniment: deep-fried farm egg with ruffled lace-crispy edges and a rich, creamy molten yolk.',
    price: 15,
    priceVerified: true,
    isFeatured: false,
    available: true,
    spiciness: 0,
  },
  {
    id: 'steamed-jasmine-rice',
    categoryId: 'sides',
    nameTh: 'ข้าวหอมมะลิแท้หุงนุ่ม',
    nameEn: 'Steamed Thai Hom Mali Jasmine Rice',
    descriptionTh: 'ข้าวหอมมะลิไทยแท้ 100% เมล็ดเรียวยาว หุงสุกใหม่ร้อนๆ นุ่มหอมกรุ่น',
    descriptionEn: 'Bowl of premium Thai fragrant Hom Mali jasmine rice, steamed fresh throughout the day.',
    price: 15,
    priceVerified: true,
    isFeatured: false,
    available: true,
    spiciness: 0,
  },
];
