import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Plus,
  Trash2,
  Edit2,
  Search,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Utensils,
  Flame,
  CheckCircle2,
  Sparkles,
  X,
} from 'lucide-react';
import {
  getEffectiveMenuItems,
  getEffectiveCategories,
  updateMenuItemDishImage,
  saveOrUpdateMenuItem,
  deleteCustomMenuItem,
  optimizeImageFile,
  resetMenuOverrides,
} from '../data/ownerStore';
import { MenuItem, MenuCategory } from '../data/menu';

interface OwnerDishManagerProps {
  onNotify: (text: string, type?: 'success' | 'error') => void;
  initialDishId?: string | null;
}

export const OwnerDishManager: React.FC<OwnerDishManagerProps> = ({
  onNotify,
  initialDishId,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(getEffectiveMenuItems());
  const [categories, setCategories] = useState<MenuCategory[]>(getEffectiveCategories());
  const [filterCat, setFilterCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active dish for image upload or editing
  const [targetDishForUpload, setTargetDishForUpload] = useState<MenuItem | null>(null);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Dish Form State
  const [newNameTh, setNewNameTh] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newCatId, setNewCatId] = useState(categories[1]?.id || 'wok-basil');
  const [newPrice, setNewPrice] = useState<number | ''>(85);
  const [newSpiciness, setNewSpiciness] = useState<0 | 1 | 2 | 3>(1);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newDescTh, setNewDescTh] = useState('');
  const [newDescEn, setNewDescEn] = useState('');
  const [newIsFeatured, setNewIsFeatured] = useState(false);

  // Direct image file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadDishId, setActiveUploadDishId] = useState<string | null>(null);

  // Live updates listener
  useEffect(() => {
    const handleUpdate = () => {
      setMenuItems(getEffectiveMenuItems());
      setCategories(getEffectiveCategories());
    };
    window.addEventListener('tonys_menu_updated', handleUpdate);
    return () => window.removeEventListener('tonys_menu_updated', handleUpdate);
  }, []);

  // Filtered dishes
  const filteredDishes = menuItems.filter((dish) => {
    const matchCat = filterCat === 'all' || dish.categoryId === filterCat;
    if (!matchCat) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      dish.nameTh.toLowerCase().includes(q) ||
      dish.nameEn.toLowerCase().includes(q) ||
      (dish.descriptionTh && dish.descriptionTh.toLowerCase().includes(q))
    );
  });

  // Handle direct image file upload for an existing dish
  const handleTriggerUpload = (dishId: string) => {
    setActiveUploadDishId(dishId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadDishId) return;

    if (!file.type.startsWith('image/')) {
      onNotify('กรุณาเลือกไฟล์ภาพเท่านั้น (JPG, PNG, WebP)', 'error');
      return;
    }

    try {
      const optimizedBase64 = await optimizeImageFile(file, 1200, 1200, 0.85);
      if (optimizedBase64) {
        updateMenuItemDishImage(activeUploadDishId, optimizedBase64);
        setMenuItems(getEffectiveMenuItems());
        const dish = menuItems.find((d) => d.id === activeUploadDishId);
        onNotify(`เปลี่ยนรูปภาพสำหรับ "${dish ? dish.nameTh : 'เมนูอาหาร'}" สำเร็จเรียบร้อย!`);
      }
    } catch {
      onNotify('เกิดข้อผิดพลาดในการประมวลผลไฟล์ภาพ', 'error');
    } finally {
      setActiveUploadDishId(null);
    }
  };

  // Handle New Dish Photo
  const handleNewDishPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const optimizedBase64 = await optimizeImageFile(file, 1200, 1200, 0.85);
      setNewImagePreview(optimizedBase64);
    } catch {
      onNotify('เกิดข้อผิดพลาดในการโหลดรูปภาพ', 'error');
    }
  };

  // Submit New Dish
  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameTh.trim()) {
      onNotify('กรุณาระบุชื่อเมนูภาษาไทย', 'error');
      return;
    }

    const uniqueId = `dish-${Date.now()}`;
    const newDish: MenuItem = {
      id: uniqueId,
      categoryId: newCatId,
      nameTh: newNameTh.trim(),
      nameEn: newNameEn.trim() || newNameTh.trim(),
      descriptionTh: newDescTh.trim() || undefined,
      descriptionEn: newDescEn.trim() || undefined,
      price: newPrice === '' ? undefined : Number(newPrice),
      priceVerified: true,
      image: newImagePreview || undefined,
      available: true,
      spiciness: newSpiciness,
      isFeatured: newIsFeatured,
    };

    saveOrUpdateMenuItem(newDish);
    setMenuItems(getEffectiveMenuItems());
    onNotify(`เพิ่มเมนู "${newDish.nameTh}" เรียบร้อยแล้ว!`);

    // Reset Form
    setNewNameTh('');
    setNewNameEn('');
    setNewPrice(85);
    setNewImagePreview(null);
    setNewDescTh('');
    setNewDescEn('');
    setNewIsFeatured(false);
    setShowAddForm(false);
  };

  // Save Edited Dish Details
  const handleSaveEditDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;

    saveOrUpdateMenuItem(editingDish);
    setMenuItems(getEffectiveMenuItems());
    onNotify(`บันทึกการแก้ไขเมนู "${editingDish.nameTh}" เรียบร้อย!`);
    setEditingDish(null);
  };

  // Delete Dish
  const handleDeleteDish = (dish: MenuItem) => {
    if (window.confirm(`ต้องการลบเมนู "${dish.nameTh}" ออกจากระบบใช่หรือไม่?`)) {
      deleteCustomMenuItem(dish.id);
      setMenuItems(getEffectiveMenuItems());
      onNotify(`ลบเมนู "${dish.nameTh}" เรียบร้อยแล้ว`);
    }
  };

  // Reset Photo for specific dish (Prompt URL or Reset)
  const handlePromptImageUrl = (dish: MenuItem) => {
    const inputUrl = window.prompt(
      `ใส่ URL ลิงก์รูปภาพใหม่สำหรับ "${dish.nameTh}":\n(เช่น https://example.com/dish.jpg)`,
      dish.image || ''
    );
    if (inputUrl !== null) {
      updateMenuItemDishImage(dish.id, inputUrl.trim());
      setMenuItems(getEffectiveMenuItems());
      onNotify(`อัปเดตรูปภาพสำหรับ "${dish.nameTh}" เรียบร้อย!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden Global File Input for 1-Click Dish Image Change */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
      />

      {/* Overview Banner */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <Camera className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-[#111827]">
              จัดการเมนูและใส่-เปลี่ยนรูปภาพอาหาร (Dishes & Food Photos)
            </h4>
            <p className="text-xs text-gray-600 mt-0.5 font-sans leading-relaxed">
              คลิกปุ่ม &quot;📷 เปลี่ยนรูปภาพ&quot; ที่เมนูใดก็ได้ เพื่อเลือกไฟล์รูปถ่ายจากเครื่องหรือมือถือของคุณ รูปจะถูกปรับขนาดและบันทึกทันที
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#FACC15]" />
          <span>{showAddForm ? 'ซ่อนแบบฟอร์ม' : '+ เพิ่มเมนูใหม่'}</span>
        </button>
      </div>

      {/* Collapsible Form: Add New Dish */}
      {showAddForm && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#EA580C]" />
              <span>เพิ่มเมนูอาหารใหม่ (+ Add New Dish)</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateDish} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  ชื่อเมนูภาษาไทย <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newNameTh}
                  onChange={(e) => setNewNameTh(e.target.value)}
                  placeholder="เช่น ต้มยำรวมมิตรน้ำใส, ยำวุ้นเส้นโบราณ"
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  ชื่อเมนูภาษาอังกฤษ (English Name)
                </label>
                <input
                  type="text"
                  value={newNameEn}
                  onChange={(e) => setNewNameEn(e.target.value)}
                  placeholder="e.g. Seafood Clear Tom Yum Soup"
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  หมวดหมู่ (Category)
                </label>
                <select
                  value={newCatId}
                  onChange={(e) => setNewCatId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                >
                  {categories
                    .filter((c) => c.id !== 'all')
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nameTh} ({cat.nameEn})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  ราคา (บาท THB)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="85"
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  ระดับความเผ็ด
                </label>
                <select
                  value={newSpiciness}
                  onChange={(e) => setNewSpiciness(Number(e.target.value) as 0 | 1 | 2 | 3)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                >
                  <option value={0}>0 - ไม่เผ็ด (Non-spicy)</option>
                  <option value={1}>1 - เผ็ดน้อย (Mild)</option>
                  <option value={2}>2 - เผ็ดกลาง (Medium)</option>
                  <option value={3}>3 - เผ็ดมาก (Hot)</option>
                </select>
              </div>
            </div>

            {/* Photo Upload Area */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                รูปภาพเมนูอาหาร (Dish Photo)
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50">
                {newImagePreview ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                    <img
                      src={newImagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setNewImagePreview(null)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full text-xs shadow-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gray-200 flex flex-col items-center justify-center text-gray-400 shrink-0">
                    <Utensils className="w-8 h-8 opacity-40" />
                    <span className="text-[10px] mt-1 font-sans">ยังไม่มีรูป</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-[#111827] text-xs font-bold rounded-lg border border-gray-300 shadow-2xs transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>เลือกไฟล์รูปภาพจากเครื่อง...</span>
                    <input
                      type="file"
                      onChange={handleNewDishPhoto}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-gray-500 font-sans">
                    รองรับไฟล์ JPG, PNG, WebP ขนาดแนะนำไม่เกิน 3MB
                  </p>
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  คำอธิบายเมนู (ภาษาไทย)
                </label>
                <textarea
                  rows={2}
                  value={newDescTh}
                  onChange={(e) => setNewDescTh(e.target.value)}
                  placeholder="วัตถุดิบและรสชาติของอาหาร เช่น รสจัดจ้าน หอมใบกะเพราสด..."
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  คำอธิบายเมนู (ภาษาอังกฤษ)
                </label>
                <textarea
                  rows={2}
                  value={newDescEn}
                  onChange={(e) => setNewDescEn(e.target.value)}
                  placeholder="Description for English visitors..."
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIsFeatured}
                  onChange={(e) => setNewIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#EA580C] rounded border-gray-300 focus:ring-[#EA580C]"
                />
                <span className="text-xs font-bold text-gray-700">
                  แสดงในหมวดหมู่เมนูแนะนำพิเศษ (Featured Dish)
                </span>
              </label>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#FACC15]" />
                <span>บันทึกเมนูใหม่</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อเมนูอาหารเพื่อเปลี่ยนรูปหรือแก้ไข..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#EA580C]"
          />
        </div>

        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-3.5 py-2 text-xs font-bold bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#EA580C]"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              หมวด: {c.nameTh}
            </option>
          ))}
        </select>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDishes.map((dish) => {
          const categoryObj = categories.find((c) => c.id === dish.categoryId);

          return (
            <div
              key={dish.id}
              className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between gap-3"
            >
              <div className="flex gap-3.5">
                {/* Dish Thumbnail */}
                <div className="relative w-22 h-22 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 group">
                  {dish.image ? (
                    <img
                      src={dish.image}
                      alt={dish.nameTh}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <Utensils className="w-6 h-6 opacity-40 text-[#EA580C]" />
                      <span className="text-[9px] mt-0.5">ไม่มีรูป</span>
                    </div>
                  )}

                  {/* Overlay button on thumbnail */}
                  <button
                    type="button"
                    onClick={() => handleTriggerUpload(dish.id)}
                    title="คลิกเพื่อเปลี่ยนรูป"
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer gap-1"
                  >
                    <Camera className="w-4 h-4 text-[#FACC15]" />
                    <span>เปลี่ยนรูป</span>
                  </button>
                </div>

                {/* Dish Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#111827] truncate">
                        {dish.nameTh}
                      </h4>
                      <p className="text-xs text-gray-400 font-sans truncate">
                        {dish.nameEn}
                      </p>
                    </div>

                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-gray-100 text-[#EA580C] shrink-0">
                      {dish.price ? `${dish.price} ฿` : 'ตามสั่ง'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/70 font-semibold">
                      {categoryObj ? categoryObj.nameTh : dish.categoryId}
                    </span>

                    {dish.spiciness > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200/70 flex items-center gap-0.5 font-semibold">
                        <Flame className="w-3 h-3 text-[#EA580C]" />
                        <span>เผ็ดระดับ {dish.spiciness}</span>
                      </span>
                    )}

                    {dish.isFeatured && (
                      <span className="px-2 py-0.5 rounded-md bg-black text-[#FACC15] font-bold">
                        ★ แนะนำ
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTriggerUpload(dish.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#FACC15]" />
                    <span>เปลี่ยนรูปอาหาร</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePromptImageUrl(dish)}
                    title="ใส่ URL ลิงก์รูปภาพ"
                    className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingDish(dish)}
                    className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    title="แก้ไขข้อมูลเมนู"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteDish(dish)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="ลบเมนูนี้"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDishes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <Utensils className="w-8 h-8 mx-auto text-gray-300 mb-2" />
          <p className="text-xs text-gray-500">ไม่พบเมนูที่ค้นหา</p>
        </div>
      )}

      {/* Edit Dish Modal */}
      {editingDish && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#EA580C]" />
                <span>แก้ไขข้อมูลเมนู: {editingDish.nameTh}</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingDish(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDish} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  ชื่อเมนูภาษาไทย
                </label>
                <input
                  type="text"
                  required
                  value={editingDish.nameTh}
                  onChange={(e) =>
                    setEditingDish({ ...editingDish, nameTh: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  ชื่อเมนูภาษาอังกฤษ
                </label>
                <input
                  type="text"
                  value={editingDish.nameEn}
                  onChange={(e) =>
                    setEditingDish({ ...editingDish, nameEn: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    หมวดหมู่
                  </label>
                  <select
                    value={editingDish.categoryId}
                    onChange={(e) =>
                      setEditingDish({ ...editingDish, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                  >
                    {categories
                      .filter((c) => c.id !== 'all')
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nameTh}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    ราคา (บาท)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={editingDish.price ?? ''}
                    onChange={(e) =>
                      setEditingDish({
                        ...editingDish,
                        price: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  คำอธิบายภาษาไทย
                </label>
                <textarea
                  rows={2}
                  value={editingDish.descriptionTh || ''}
                  onChange={(e) =>
                    setEditingDish({ ...editingDish, descriptionTh: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDish.isFeatured || false}
                    onChange={(e) =>
                      setEditingDish({ ...editingDish, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 text-[#EA580C] rounded border-gray-300 focus:ring-[#EA580C]"
                  />
                  <span className="text-xs font-bold text-gray-700">เมนูแนะนำพิเศษ</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingDish(null)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs cursor-pointer"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
