# Tony's Kitchen (ครัวโทนี่) — Modern Minimal Restaurant Website

> **"Real Thai Food. Made with Passion."**  
> Authentic Thai restaurant located in front of the entrance to Nichada Thani Village, Samakkhi 29 Alley, Bang Talat, Pak Kret District, Nonthaburi 11120, Thailand.  
> Telephone: **084-153-6498**  
> Official Ordering Web App: [https://tony-kitchen-thai-restaurant-pwa.ai.studio](https://tony-kitchen-thai-restaurant-pwa.ai.studio)  
> Live GitHub Pages URL: [https://tonykitchenth-cloud.github.io/tonys-kitchen-website/](https://tonykitchenth-cloud.github.io/tonys-kitchen-website/)

---

## 1. Design System & Architectural Summary

The redesigned website follows a **Modern Minimal** aesthetic tailored for high-end international food brands and authentic Thai cuisine:

- **Warm Neutral Canvas**: Soft ivory background (`#FAF7F2`) combined with charcoal near-black text (`#18181A`) for contrast and legibility.
- **Herbal Dark Green Accents**: Restrained deep green (`#1F382E`) inspired by fresh Thai holy basil and lime leaves.
- **Warm Gold Highlights**: Muted golden accents (`#C89B3C` / `#D4A373`) for subtle focal hierarchy.
- **Typography**: Clean, readable sans-serif pairing with **Noto Sans Thai** for authentic Thai rendering and **Plus Jakarta Sans / Playfair Display** for brand titles.
- **Zero-Pill Discipline**: Informational metadata uses clean unboxed text with typographic separators (`·`), eliminating candy-like capsule badges.
- **Commercial Food Photography**: Large, realistic, high-resolution food photography without artificial filters or embedded text.

---

## 2. Generated Project Structure

```text
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Pages CI/CD workflow
├── public/
│   └── images/                     # Dedicated public directory for replacement food photos
│       ├── hero_pad_krapow.jpg
│       ├── signature_pad_krapow.jpg
│       ├── dish_pad_thai.jpg
│       ├── dish_tom_yum.jpg
│       └── dish_green_curry.jpg
├── src/
│   ├── assets/
│   │   └── images/                 # Bundled image assets
│   ├── components/
│   │   ├── Header.tsx              # Sticky header, brand wordmark, language toggle
│   │   ├── Footer.tsx              # Minimal footer with links & dynamic copyright
│   │   ├── LanguageSwitcher.tsx    # Accessible TH/EN language switch control
│   │   ├── MenuCard.tsx            # Uniform food cards with prices & spice badges
│   │   ├── MenuFilter.tsx          # Real-time search and category segmented buttons
│   │   ├── MenuDetailModal.tsx     # Dish detail popup with verified ordering options
│   │   └── OrderSection.tsx        # 4 verified ordering channels + telephone call
│   ├── sections/
│   │   ├── HeroSection.tsx         # 2-column hero with tagline and trust indicators
│   │   ├── FeaturedDishes.tsx      # Spotlight section for signature Thai dishes
│   │   ├── MenuSection.tsx         # Interactive menu with instant search & filtering
│   │   ├── AboutSection.tsx        # Authentic positioning and culinary pillars
│   │   ├── ContactSection.tsx      # Address, copy button, phone, and embedded map
│   │   └── OrderSection.tsx        # Section re-export for ordering hub
│   ├── data/
│   │   ├── restaurant.ts           # Central business data, verified address, phone, links
│   │   ├── menu.ts                 # Central menu records, verified THB prices, spice ratings
│   │   └── translations.ts         # Full Thai & English dictionary for all UI text
│   ├── styles/
│   │   └── global.css              # Global styles, Tailwind imports, scroll-padding
│   ├── App.tsx                     # Main single-page application orchestrator
│   └── main.tsx                    # React 19 entry point
├── index.html                      # SEO metadata, OpenGraph, Schema.org Restaurant JSON-LD
├── vite.config.ts                  # Vite config with base: '/tonys-kitchen-website/' for prod
├── tsconfig.json                   # Strict TypeScript configuration
└── package.json
```

---

## 3. Original Website Source-of-Truth & Retrieved Details

### Verified & Preserved:
- **Restaurant Name**: Tony's Kitchen (ครัวโทนี่)
- **Tagline**: "Real Thai Food. Made with Passion." (อาหารไทยแท้ รังสรรค์ด้วยความใส่ใจ)
- **Address**: In front of the entrance to Nichada Thani Village, Samakkhi 29 Alley, Bang Talat, Pak Kret District, Nonthaburi 11120, Thailand
- **Phone Number**: `084-153-6498` (Clickable `tel:+66841536498`)
- **Ordering App URL**: `https://tony-kitchen-thai-restaurant-pwa.ai.studio`
- **GrabFood URL**: Verified link to Tony's Kitchen Express Nichada Thani store on GrabFood.
- **LINE ID**: `padaroisauce` (`https://line.me/ti/p/~padaroisauce`)
- **WhatsApp**: `+66 84 153 6498` (`https://wa.me/66841536498`)
- **Operating Hours**: Daily 10:00 AM – 9:00 PM (10:00 - 21:00 น.) verified at the Nichada Thani branch.
- **Signature & À La Carte Dishes**:
  - *Pad Krapow Gai Kai Dao* (85 THB)
  - *Pad Krapow Moo Krob* (95 THB)
  - *Signature Pad Thai with Tiger Prawns* (95 THB)
  - *Tom Yum Goong* (130 THB)
  - *Green Curry Chicken* (110 THB)
  - *Pad See Ew* (75 THB)
  - *Spaghetti Pad Kee Mao* (85 THB)
  - *Garlic & Pepper Pork/Chicken* (75 THB)
  - *Thai Fried Rice* (75 THB)
  - *Thai Suki Glass Noodles* (80 THB)
  - *Crispy Fried Egg (Kai Dao)* (15 THB)
  - *Steamed Hom Mali Jasmine Rice* (15 THB)

### Details Marked for Manual Verification:
- **Daily Specials & Seasonal Seafood**: If seasonal prices change at the market, the price can be adjusted directly in `src/data/menu.ts`. If an item's price is unknown, leave `priceVerified: false` to display the fallback message: *"Please contact the restaurant for the current price"*.
- **No unsupported claims**: No artificial awards, Michelin badges, or fake customer review counts were fabricated.

---

## 4. Connecting and Syncing with GitHub

To push this codebase to your GitHub repository:

```bash
# 1. Initialize git and commit files
git init
git add .
git commit -m "feat: rebuild modern minimal restaurant website for Tony's Kitchen"

# 2. Set default branch to main
git branch -M main

# 3. Connect to your GitHub repository
git remote add origin https://github.com/tonykitchenth-cloud/tonys-kitchen-website.git

# 4. Push to GitHub
git push -u origin main --force
```

---

## 5. Configuring GitHub Pages

1. Navigate to your repository on GitHub:  
   `https://github.com/tonykitchenth-cloud/tonys-kitchen-website`
2. Click **Settings** (top navigation tab).
3. In the left sidebar, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment**:
   - Change **Source** to **GitHub Actions**.
5. Once selected, the included `.github/workflows/deploy.yml` workflow will automatically trigger on every push to `main`, compile the website with `base: '/tonys-kitchen-website/'`, and deploy it live.

---

## 6. How to Test the Deployed Website

1. Visit the published URL:  
   `https://tonykitchenth-cloud.github.io/tonys-kitchen-website/`
2. **Language Toggle**: Click `TH / EN` in the header. Verify that navigation items, headings, category tabs, and dish names update instantly without reloading the page.
3. **Menu Search & Filtering**:
   - Type `กะเพรา` or `basil` in the search box to verify dual-language searching.
   - Click category filter tabs (*Wok & Holy Basil*, *Noodles*, *Curries & Soups*) to test filtering.
   - Click the "Clear Search" button to return to the full menu.
4. **Dish Detail Modal**: Click on any dish card to open the detail dialog. Test the ordering buttons and press `Esc` or the close icon to dismiss.
5. **Ordering Channels**: Click the *Tony's Kitchen Web App*, *GrabFood*, *LINE*, and *WhatsApp* buttons to ensure they open in new tabs with the correct URLs.
6. **Mobile Layout**: Open DevTools responsive mode at `360px`, `390px`, and `768px`. Verify that the hamburger menu opens, links jump smoothly to sections, and the address copy button provides visual confirmation.

---

## 7. How to Update Menu Items, Prices, Images, and Links

All restaurant information is kept strictly separate from the visual components:

### A. Updating Menu Dishes & Prices
Open `src/data/menu.ts`:
```typescript
{
  id: 'pad-krapow-gai',
  categoryId: 'wok-basil',
  nameTh: 'ผัดกะเพราไก่ + ไข่ดาวกรอบ',
  nameEn: 'Thai Basil Chicken with Fried Egg',
  price: 85,              // Update price here
  priceVerified: true,    // Set to false if awaiting market price
  spiciness: 3,           // 0 = none, 1 = mild, 2 = medium, 3 = hot
  available: true,        // Set to false to mark sold out
}
```

### B. Adding or Replacing Food Photographs
1. Save your photo into `public/images/` (e.g., `public/images/new_dish.jpg`).
2. In `src/data/menu.ts`, set `image: '/tonys-kitchen-website/images/new_dish.jpg'` or import the image directly at the top of the file.

### C. Updating Restaurant Contact Information
Open `src/data/restaurant.ts` to edit:
- `phone`: Restaurant phone number.
- `hours`: Daily operating hours.
- `address`: Address text or landmark descriptions.
- `links`: Update GrabFood, LINE, WhatsApp, or Google Maps URLs in one location.

---

## 📄 License
SPDX-License-Identifier: Apache-2.0
