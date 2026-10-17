import { RESTAURANT_DATA, RestaurantData } from './restaurant';
import { MENU_CATEGORIES, MENU_ITEMS, MenuCategory, MenuItem } from './menu';

export const OWNER_STORAGE_KEYS = {
  LOGO: 'tonys_custom_logo',
  PASSWORD: 'tonys_owner_password',
  RESTAURANT_DATA: 'tonys_restaurant_overrides',
  CATEGORIES: 'tonys_custom_categories',
  MENU_ITEMS: 'tonys_custom_menu_items',
  IS_LOGGED_IN: 'tonys_owner_logged_in_session',
};

const DEFAULT_PASSWORD = '1234';

/**
 * Optimize uploaded image file to lightweight Base64 string for localStorage
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
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(OWNER_STORAGE_KEYS.LOGO);
  } catch {
    return null;
  }
}

/**
 * Save custom logo image data URL
 */
export function setStoredLogo(dataUrl: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OWNER_STORAGE_KEYS.LOGO, dataUrl);
    window.dispatchEvent(new Event('tonys_restaurant_updated'));
  } catch (e) {
    console.error('Failed to save custom logo to localStorage', e);
  }
}

/**
 * Remove custom logo, restoring default
 */
export function removeStoredLogo(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(OWNER_STORAGE_KEYS.LOGO);
    window.dispatchEvent(new Event('tonys_restaurant_updated'));
  } catch (e) {
    console.error('Failed to remove custom logo', e);
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
 * Get restaurant data merged with any saved owner overrides
 */
export function getEffectiveRestaurantData(): RestaurantData {
  if (typeof window === 'undefined') return RESTAURANT_DATA;
  try {
    const raw = localStorage.getItem(OWNER_STORAGE_KEYS.RESTAURANT_DATA);
    if (!raw) return RESTAURANT_DATA;
    const overrides = JSON.parse(raw);
    return {
      ...RESTAURANT_DATA,
      ...overrides,
      name: {
        ...RESTAURANT_DATA.name,
        ...(overrides.name || {}),
      },
      tagline: {
        ...RESTAURANT_DATA.tagline,
        ...(overrides.tagline || {}),
      },
      address: {
        ...RESTAURANT_DATA.address,
        ...(overrides.address || {}),
      },
      hours: {
        ...RESTAURANT_DATA.hours,
        ...(overrides.hours || {}),
      },
      links: {
        ...RESTAURANT_DATA.links,
        ...(overrides.links || {}),
      },
    };
  } catch {
    return RESTAURANT_DATA;
  }
}

/**
 * Save restaurant data overrides
 */
export function saveRestaurantOverrides(overrides: Partial<RestaurantData>): void {
  if (typeof window === 'undefined') return;
  try {
    const existingRaw = localStorage.getItem(OWNER_STORAGE_KEYS.RESTAURANT_DATA);
    const existing = existingRaw ? JSON.parse(existingRaw) : {};
    const merged = { ...existing, ...overrides };
    localStorage.setItem(OWNER_STORAGE_KEYS.RESTAURANT_DATA, JSON.stringify(merged));
    window.dispatchEvent(new Event('tonys_restaurant_updated'));
  } catch (e) {
    console.error('Failed to save restaurant overrides', e);
  }
}

/**
 * =========================================================================
 * CATEGORIES MANAGEMENT (Requirement: เพิ่มหมวดหมู่เองได้)
 * =========================================================================
 */
export function getEffectiveCategories(): MenuCategory[] {
  if (typeof window === 'undefined') return MENU_CATEGORIES;
  try {
    const raw = localStorage.getItem(OWNER_STORAGE_KEYS.CATEGORIES);
    if (!raw) return MENU_CATEGORIES;
    const custom = JSON.parse(raw);
    if (Array.isArray(custom) && custom.length > 0) {
      return custom;
    }
    return MENU_CATEGORIES;
  } catch {
    return MENU_CATEGORIES;
  }
}

export function saveEffectiveCategories(categories: MenuCategory[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OWNER_STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('tonys_menu_updated'));
  } catch (e) {
    console.error('Failed to save categories', e);
  }
}

export function addCustomCategory(newCategory: MenuCategory): void {
  const current = getEffectiveCategories();
  // Ensure 'all' stays first if it exists
  const existingIdx = current.findIndex((c) => c.id === newCategory.id);
  let updated: MenuCategory[];
  if (existingIdx >= 0) {
    updated = current.map((c) => (c.id === newCategory.id ? newCategory : c));
  } else {
    updated = [...current, newCategory];
  }
  saveEffectiveCategories(updated);
}

export function deleteCustomCategory(categoryId: string): void {
  if (categoryId === 'all') return; // Cannot delete 'all'
  const current = getEffectiveCategories();
  const updated = current.filter((c) => c.id !== categoryId);
  saveEffectiveCategories(updated);
}

/**
 * =========================================================================
 * MENU ITEMS & DISH IMAGES MANAGEMENT (Requirement: ใส่-เปลี่ยน รูปเมนูอาหารเอง)
 * =========================================================================
 */
export function getEffectiveMenuItems(): MenuItem[] {
  if (typeof window === 'undefined') return MENU_ITEMS;
  try {
    const raw = localStorage.getItem(OWNER_STORAGE_KEYS.MENU_ITEMS);
    if (!raw) return MENU_ITEMS;
    const custom = JSON.parse(raw);
    if (Array.isArray(custom) && custom.length > 0) {
      return custom;
    }
    return MENU_ITEMS;
  } catch {
    return MENU_ITEMS;
  }
}

export function saveEffectiveMenuItems(items: MenuItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OWNER_STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
    window.dispatchEvent(new Event('tonys_menu_updated'));
  } catch (e) {
    console.error('Failed to save menu items', e);
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

export function resetMenuOverrides(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(OWNER_STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(OWNER_STORAGE_KEYS.MENU_ITEMS);
    window.dispatchEvent(new Event('tonys_menu_updated'));
  } catch (e) {
    console.error('Failed to reset menu overrides', e);
  }
}

/**
 * Reset all overrides back to restaurant original data
 */
export function resetRestaurantOverrides(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(OWNER_STORAGE_KEYS.RESTAURANT_DATA);
    localStorage.removeItem(OWNER_STORAGE_KEYS.LOGO);
    localStorage.removeItem(OWNER_STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(OWNER_STORAGE_KEYS.MENU_ITEMS);
    window.dispatchEvent(new Event('tonys_restaurant_updated'));
    window.dispatchEvent(new Event('tonys_menu_updated'));
  } catch (e) {
    console.error('Failed to reset restaurant data', e);
  }
}

