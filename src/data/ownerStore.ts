import { RESTAURANT_DATA, RestaurantData } from './restaurant';
import { MENU_CATEGORIES, MENU_ITEMS, MenuCategory, MenuItem } from './menu';
import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
} from 'firebase/firestore';

export const OWNER_STORAGE_KEYS = {
  LOGO: 'tonys_custom_logo',
  PASSWORD: 'tonys_owner_password',
  RESTAURANT_DATA: 'tonys_restaurant_overrides',
  CATEGORIES: 'tonys_custom_categories',
  MENU_ITEMS: 'tonys_custom_menu_items',
  IS_LOGGED_IN: 'tonys_owner_logged_in_session',
};

const DEFAULT_PASSWORD = '1234';

// In-memory cache synced with Firestore and backed by localStorage for offline instant render
let memoryCategories: MenuCategory[] = MENU_CATEGORIES;
let memoryMenuItems: MenuItem[] = MENU_ITEMS;
let memoryRestaurantData: RestaurantData = RESTAURANT_DATA;
let memoryLogo: string | null = null;

// Initialize memory state from localStorage on startup with safe parsing
if (typeof window !== 'undefined') {
  try {
    const cachedCat = localStorage.getItem(OWNER_STORAGE_KEYS.CATEGORIES);
    if (cachedCat) {
      const parsed = JSON.parse(cachedCat);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCategories = parsed.filter((c) => c && typeof c === 'object' && c.id);
      }
    }

    const cachedItems = localStorage.getItem(OWNER_STORAGE_KEYS.MENU_ITEMS);
    if (cachedItems) {
      const parsed = JSON.parse(cachedItems);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryMenuItems = parsed.filter((m) => m && typeof m === 'object' && m.id);
      }
    }

    const cachedRest = localStorage.getItem(OWNER_STORAGE_KEYS.RESTAURANT_DATA);
    if (cachedRest) {
      const overrides = JSON.parse(cachedRest);
      if (overrides && typeof overrides === 'object') {
        memoryRestaurantData = {
          ...RESTAURANT_DATA,
          ...overrides,
          name: { ...RESTAURANT_DATA.name, ...(overrides.name && typeof overrides.name === 'object' ? overrides.name : {}) },
          tagline: { ...RESTAURANT_DATA.tagline, ...(overrides.tagline && typeof overrides.tagline === 'object' ? overrides.tagline : {}) },
          address: { ...RESTAURANT_DATA.address, ...(overrides.address && typeof overrides.address === 'object' ? overrides.address : {}) },
          hours: { ...RESTAURANT_DATA.hours, ...(overrides.hours && typeof overrides.hours === 'object' ? overrides.hours : {}) },
          links: { ...RESTAURANT_DATA.links, ...(overrides.links && typeof overrides.links === 'object' ? overrides.links : {}) },
        };
      }
    }

    memoryLogo = localStorage.getItem(OWNER_STORAGE_KEYS.LOGO);
  } catch (err) {
    console.error('Failed to initialize local cache', err);
  }
}

/**
 * Real-time Firestore Cloud Synchronization
 * Listens to Firestore collections and documents; whenever an update happens,
 * all clients across any device immediately receive the latest data.
 */
let isCloudSyncInitialized = false;

export function initCloudSync(): void {
  if (typeof window === 'undefined' || isCloudSyncInitialized) return;
  isCloudSyncInitialized = true;

  // Validate Firestore server connection
  getDocFromServer(doc(db, 'settings', 'global')).catch(() => {
    // Non-blocking initial connectivity verification
  });

  // 1. Listen to Global Settings (Logo, Restaurant Data Overrides)
  try {
    const settingsDocRef = doc(db, 'settings', 'global');
    onSnapshot(
      settingsDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data) {
            if (data.logo !== undefined) {
              memoryLogo = data.logo || null;
              if (data.logo) {
                localStorage.setItem(OWNER_STORAGE_KEYS.LOGO, data.logo);
              } else {
                localStorage.removeItem(OWNER_STORAGE_KEYS.LOGO);
              }
            }
            if (data.restaurantData) {
              memoryRestaurantData = {
                ...RESTAURANT_DATA,
                ...data.restaurantData,
                name: { ...RESTAURANT_DATA.name, ...(data.restaurantData.name || {}) },
                tagline: { ...RESTAURANT_DATA.tagline, ...(data.restaurantData.tagline || {}) },
                address: { ...RESTAURANT_DATA.address, ...(data.restaurantData.address || {}) },
                hours: { ...RESTAURANT_DATA.hours, ...(data.restaurantData.hours || {}) },
                links: { ...RESTAURANT_DATA.links, ...(data.restaurantData.links || {}) },
              };
              localStorage.setItem(
                OWNER_STORAGE_KEYS.RESTAURANT_DATA,
                JSON.stringify(data.restaurantData)
              );
            }
            window.dispatchEvent(new Event('tonys_restaurant_updated'));
          }
        }
      },
      (err) => {
        console.warn('Firestore settings listener note:', err.message);
      }
    );
  } catch (e) {
    console.error('Failed to attach settings listener', e);
  }

  // 2. Listen to Categories Document in Cloud
  try {
    const categoriesDocRef = doc(db, 'settings', 'categories');
    onSnapshot(
      categoriesDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && Array.isArray(data.list) && data.list.length > 0) {
            memoryCategories = data.list;
            localStorage.setItem(OWNER_STORAGE_KEYS.CATEGORIES, JSON.stringify(data.list));
            window.dispatchEvent(new Event('tonys_menu_updated'));
          }
        }
      },
      (err) => {
        console.warn('Firestore categories listener note:', err.message);
      }
    );
  } catch (e) {
    console.error('Failed to attach categories listener', e);
  }

  // 3. Listen to Menu Items Document in Cloud
  try {
    const menuItemsDocRef = doc(db, 'settings', 'menu_items');
    onSnapshot(
      menuItemsDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && Array.isArray(data.list) && data.list.length > 0) {
            memoryMenuItems = data.list;
            localStorage.setItem(OWNER_STORAGE_KEYS.MENU_ITEMS, JSON.stringify(data.list));
            window.dispatchEvent(new Event('tonys_menu_updated'));
          }
        }
      },
      (err) => {
        console.warn('Firestore menu items listener note:', err.message);
      }
    );
  } catch (e) {
    console.error('Failed to attach menu items listener', e);
  }
}

/**
 * Optimize uploaded image file to lightweight Base64 string for Firestore and local storage
 */
export async function optimizeImageFile(
  file: File,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Get current custom logo data URL or null if using default
 */
export function getStoredLogo(): string | null {
  return memoryLogo;
}

/**
 * Save custom logo image and sync to Cloud Firestore
 */
export async function setStoredLogo(dataUrl: string): Promise<void> {
  memoryLogo = dataUrl;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(OWNER_STORAGE_KEYS.LOGO, dataUrl);
      window.dispatchEvent(new Event('tonys_restaurant_updated'));
    } catch (e) {
      console.warn('Local storage write warning', e);
    }
  }

  // Push to Cloud Firestore
  try {
    await setDoc(
      doc(db, 'settings', 'global'),
      {
        logo: dataUrl,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (cloudErr) {
    console.error('Failed to sync logo to cloud', cloudErr);
  }
}

/**
 * Remove custom logo, restoring default across devices
 */
export async function removeStoredLogo(): Promise<void> {
  memoryLogo = null;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(OWNER_STORAGE_KEYS.LOGO);
      window.dispatchEvent(new Event('tonys_restaurant_updated'));
    } catch (e) {
      console.warn('Local storage remove warning', e);
    }
  }

  // Clear in Cloud Firestore
  try {
    await setDoc(
      doc(db, 'settings', 'global'),
      {
        logo: null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (cloudErr) {
    console.error('Failed to clear logo in cloud', cloudErr);
  }
}

/**
 * Get owner password (defaults to '1234')
 */
export function getOwnerPassword(): string {
  if (typeof window === 'undefined') return DEFAULT_PASSWORD;
  try {
    return localStorage.getItem(OWNER_STORAGE_KEYS.PASSWORD) || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

/**
 * Update owner password
 */
export function setOwnerPassword(newPassword: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OWNER_STORAGE_KEYS.PASSWORD, newPassword);
  } catch (e) {
    console.error('Failed to save owner password', e);
  }
}

/**
 * Verify owner password
 */
export function verifyOwnerPassword(inputPassword: string): boolean {
  const currentPassword = getOwnerPassword();
  return inputPassword.trim() === currentPassword.trim();
}

/**
 * Owner session state helpers
 */
export function isOwnerLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(OWNER_STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  } catch {
    return false;
  }
}

export function setOwnerLoggedIn(status: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (status) {
      sessionStorage.setItem(OWNER_STORAGE_KEYS.IS_LOGGED_IN, 'true');
    } else {
      sessionStorage.removeItem(OWNER_STORAGE_KEYS.IS_LOGGED_IN);
    }
    window.dispatchEvent(new Event('tonys_owner_auth_changed'));
  } catch (e) {
    console.error('Failed to set owner login status', e);
  }
}

/**
 * Get restaurant data merged with any saved owner overrides with deep non-null guarantees
 */
export function getEffectiveRestaurantData(): RestaurantData {
  const safeData = memoryRestaurantData || RESTAURANT_DATA;
  const safeName = safeData.name && typeof safeData.name === 'object' ? safeData.name : RESTAURANT_DATA.name;
  const safeTagline = safeData.tagline && typeof safeData.tagline === 'object' ? safeData.tagline : RESTAURANT_DATA.tagline;
  const safeAddress = safeData.address && typeof safeData.address === 'object' ? safeData.address : RESTAURANT_DATA.address;
  const safeHours = safeData.hours && typeof safeData.hours === 'object' ? safeData.hours : RESTAURANT_DATA.hours;
  const safeLinks = safeData.links && typeof safeData.links === 'object' ? safeData.links : RESTAURANT_DATA.links;

  return {
    ...RESTAURANT_DATA,
    ...safeData,
    name: {
      en: safeName.en || RESTAURANT_DATA.name.en,
      th: safeName.th || RESTAURANT_DATA.name.th,
    },
    concept: {
      en: safeData.concept?.en || RESTAURANT_DATA.concept.en,
      th: safeData.concept?.th || RESTAURANT_DATA.concept.th,
    },
    tagline: {
      en: safeTagline.en || RESTAURANT_DATA.tagline.en,
      th: safeTagline.th || RESTAURANT_DATA.tagline.th,
    },
    supportingText: {
      en: safeData.supportingText?.en || RESTAURANT_DATA.supportingText.en,
      th: safeData.supportingText?.th || RESTAURANT_DATA.supportingText.th,
    },
    phone: safeData.phone || RESTAURANT_DATA.phone,
    phoneRaw: safeData.phoneRaw || RESTAURANT_DATA.phoneRaw,
    address: {
      en: safeAddress.en || RESTAURANT_DATA.address.en,
      th: safeAddress.th || RESTAURANT_DATA.address.th,
      landmarkEn: safeAddress.landmarkEn || RESTAURANT_DATA.address.landmarkEn,
      landmarkTh: safeAddress.landmarkTh || RESTAURANT_DATA.address.landmarkTh,
      provinceEn: safeAddress.provinceEn || RESTAURANT_DATA.address.provinceEn,
      provinceTh: safeAddress.provinceTh || RESTAURANT_DATA.address.provinceTh,
      postalCode: safeAddress.postalCode || RESTAURANT_DATA.address.postalCode,
    },
    hours: {
      en: safeHours.en || RESTAURANT_DATA.hours.en,
      th: safeHours.th || RESTAURANT_DATA.hours.th,
      noteEn: safeHours.noteEn || RESTAURANT_DATA.hours.noteEn,
      noteTh: safeHours.noteTh || RESTAURANT_DATA.hours.noteTh,
    },
    links: {
      app: safeLinks.app || RESTAURANT_DATA.links.app,
      grabFood: safeLinks.grabFood || RESTAURANT_DATA.links.grabFood,
      line: safeLinks.line || RESTAURANT_DATA.links.line,
      lineId: safeLinks.lineId || RESTAURANT_DATA.links.lineId,
      whatsapp: safeLinks.whatsapp || RESTAURANT_DATA.links.whatsapp,
      googleMaps: safeLinks.googleMaps || RESTAURANT_DATA.links.googleMaps,
      embedMap: safeLinks.embedMap || RESTAURANT_DATA.links.embedMap,
    },
    verificationNotes: {
      en: safeData.verificationNotes?.en || RESTAURANT_DATA.verificationNotes.en,
      th: safeData.verificationNotes?.th || RESTAURANT_DATA.verificationNotes.th,
    },
  };
}

/**
 * Save restaurant data overrides and sync to Cloud Firestore
 */
export async function saveRestaurantOverrides(overrides: Partial<RestaurantData>): Promise<void> {
  const current = getEffectiveRestaurantData();
  const merged: RestaurantData = {
    ...current,
    ...overrides,
    name: { ...current.name, ...(overrides.name && typeof overrides.name === 'object' ? overrides.name : {}) },
    tagline: { ...current.tagline, ...(overrides.tagline && typeof overrides.tagline === 'object' ? overrides.tagline : {}) },
    address: { ...current.address, ...(overrides.address && typeof overrides.address === 'object' ? overrides.address : {}) },
    hours: { ...current.hours, ...(overrides.hours && typeof overrides.hours === 'object' ? overrides.hours : {}) },
    links: { ...current.links, ...(overrides.links && typeof overrides.links === 'object' ? overrides.links : {}) },
  };
  memoryRestaurantData = merged;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(OWNER_STORAGE_KEYS.RESTAURANT_DATA, JSON.stringify(overrides));
      window.dispatchEvent(new Event('tonys_restaurant_updated'));
    } catch (e) {
      console.warn('Local storage write warning', e);
    }
  }

  // Push to Cloud Firestore
  try {
    await setDoc(
      doc(db, 'settings', 'global'),
      {
        restaurantData: overrides,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (cloudErr) {
    console.error('Failed to sync restaurant overrides to cloud', cloudErr);
  }
}

/**
 * =========================================================================
 * CATEGORIES MANAGEMENT (Synced with Cloud Firestore)
 * =========================================================================
 */
export function getEffectiveCategories(): MenuCategory[] {
  if (!Array.isArray(memoryCategories) || memoryCategories.length === 0) {
    return MENU_CATEGORIES;
  }
  const filtered = memoryCategories.filter((c) => c && typeof c === 'object' && c.id && c.nameTh);
  return filtered.length > 0 ? filtered : MENU_CATEGORIES;
}

export async function saveEffectiveCategories(categories: MenuCategory[]): Promise<void> {
  const safeCategories = (categories || []).filter((c) => c && typeof c === 'object' && c.id);
  memoryCategories = safeCategories.length > 0 ? safeCategories : MENU_CATEGORIES;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(OWNER_STORAGE_KEYS.CATEGORIES, JSON.stringify(memoryCategories));
      window.dispatchEvent(new Event('tonys_menu_updated'));
    } catch (e) {
      console.warn('Local storage write warning', e);
    }
  }

  // Push to Cloud Firestore
  try {
    await setDoc(
      doc(db, 'settings', 'categories'),
      {
        list: memoryCategories,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (cloudErr) {
    console.error('Failed to sync categories to cloud', cloudErr);
  }
}

export function addCustomCategory(newCategory: MenuCategory): void {
  if (!newCategory || !newCategory.id) return;
  const current = getEffectiveCategories();
  const existingIdx = current.findIndex((c) => c && c.id === newCategory.id);
  let updated: MenuCategory[];
  if (existingIdx >= 0) {
    updated = current.map((c) => (c && c.id === newCategory.id ? newCategory : c));
  } else {
    updated = [...current, newCategory];
  }
  saveEffectiveCategories(updated);
}

export function deleteCustomCategory(categoryId: string): void {
  if (categoryId === 'all') return; // Cannot delete 'all'
  const current = getEffectiveCategories();
  const updated = current.filter((c) => c && c.id !== categoryId);
  saveEffectiveCategories(updated);
}

/**
 * =========================================================================
 * MENU ITEMS & DISH IMAGES MANAGEMENT (Synced with Cloud Firestore)
 * =========================================================================
 */
export function getEffectiveMenuItems(): MenuItem[] {
  if (!Array.isArray(memoryMenuItems) || memoryMenuItems.length === 0) {
    return MENU_ITEMS;
  }
  const filtered = memoryMenuItems.filter((m) => m && typeof m === 'object' && m.id && m.nameTh);
  return filtered.length > 0 ? filtered : MENU_ITEMS;
}

export async function saveEffectiveMenuItems(items: MenuItem[]): Promise<void> {
  memoryMenuItems = items;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(OWNER_STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
      window.dispatchEvent(new Event('tonys_menu_updated'));
    } catch (e) {
      console.warn('Local storage write warning', e);
    }
  }

  // Push to Cloud Firestore
  try {
    await setDoc(
      doc(db, 'settings', 'menu_items'),
      {
        list: items,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (cloudErr) {
    console.error('Failed to sync menu items to cloud', cloudErr);
  }
}

export function updateMenuItemDishImage(dishId: string, imageDataUrl: string): void {
  const items = getEffectiveMenuItems();
  const updated = items.map((dish) => {
    if (dish.id === dishId) {
      return { ...dish, image: imageDataUrl };
    }
    return dish;
  });
  saveEffectiveMenuItems(updated);
}

export function saveOrUpdateMenuItem(dish: MenuItem): void {
  const items = getEffectiveMenuItems();
  const idx = items.findIndex((d) => d.id === dish.id);
  let updated: MenuItem[];
  if (idx >= 0) {
    updated = items.map((d) => (d.id === dish.id ? dish : d));
  } else {
    updated = [dish, ...items];
  }
  saveEffectiveMenuItems(updated);
}

export function deleteCustomMenuItem(dishId: string): void {
  const items = getEffectiveMenuItems();
  const updated = items.filter((d) => d.id !== dishId);
  saveEffectiveMenuItems(updated);
}

export async function resetMenuOverrides(): Promise<void> {
  memoryCategories = MENU_CATEGORIES;
  memoryMenuItems = MENU_ITEMS;

  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(OWNER_STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(OWNER_STORAGE_KEYS.MENU_ITEMS);
      window.dispatchEvent(new Event('tonys_menu_updated'));
    } catch (e) {
      console.warn('Local storage remove warning', e);
    }
  }

  try {
    await deleteDoc(doc(db, 'settings', 'categories'));
    await deleteDoc(doc(db, 'settings', 'menu_items'));
  } catch (cloudErr) {
    console.error('Failed to reset cloud menu overrides', cloudErr);
  }
}

/**
 * Reset all overrides back to restaurant original data
 */
export async function resetRestaurantOverrides(): Promise<void> {
  memoryRestaurantData = RESTAURANT_DATA;
  memoryLogo = null;
  memoryCategories = MENU_CATEGORIES;
  memoryMenuItems = MENU_ITEMS;

  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(OWNER_STORAGE_KEYS.RESTAURANT_DATA);
      localStorage.removeItem(OWNER_STORAGE_KEYS.LOGO);
      localStorage.removeItem(OWNER_STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(OWNER_STORAGE_KEYS.MENU_ITEMS);
      window.dispatchEvent(new Event('tonys_restaurant_updated'));
      window.dispatchEvent(new Event('tonys_menu_updated'));
    } catch (e) {
      console.warn('Local storage remove warning', e);
    }
  }

  try {
    await deleteDoc(doc(db, 'settings', 'global'));
    await deleteDoc(doc(db, 'settings', 'categories'));
    await deleteDoc(doc(db, 'settings', 'menu_items'));
  } catch (cloudErr) {
    console.error('Failed to reset all cloud settings', cloudErr);
  }
}
