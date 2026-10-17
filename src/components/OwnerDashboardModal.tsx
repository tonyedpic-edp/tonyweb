import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Save,
  CheckCircle2,
  Lock,
  Phone,
  Clock,
  Globe,
  ExternalLink,
  Store,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  getStoredLogo,
  setStoredLogo,
  removeStoredLogo,
  getEffectiveRestaurantData,
  saveRestaurantOverrides,
  resetRestaurantOverrides,
  setOwnerPassword,
  getOwnerPassword,
} from '../data/ownerStore';
import { RestaurantData } from '../data/restaurant';
import { OwnerCategoryManager } from './OwnerCategoryManager';
import { OwnerDishManager } from './OwnerDishManager';
import { FolderPlus, Utensils } from 'lucide-react';

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoUpdated?: () => void;
  initialTab?: 'categories' | 'dishes' | 'logo' | 'info' | 'security';
  initialDishId?: string | null;
}

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({
  isOpen,
  onClose,
  onLogoUpdated,
  initialTab = 'categories',
  initialDishId,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'dishes' | 'logo' | 'info' | 'security'>(initialTab);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [formData, setFormData] = useState<RestaurantData>(getEffectiveRestaurantData());
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      setCurrentLogo(getStoredLogo());
      setFormData(getEffectiveRestaurantData());
      setStatusMessage(null);
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  // Handle Logo Upload (Requirement 3)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('กรุณาเลือกไฟล์รูปภาพเท่านั้น (PNG, JPG, WebP, SVG)', 'error');
      return;
    }

    // Limit to reasonable size for localStorage (e.g. 3MB)
    if (file.size > 3 * 1024 * 1024) {
      showToast('ขนาดไฟล์ภาพใหญ่เกินไป (แนะนำไม่เกิน 3MB)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setStoredLogo(dataUrl);
        setCurrentLogo(dataUrl);
        if (onLogoUpdated) onLogoUpdated();
        showToast('อัปโหลดและเปลี่ยนรูปโลโก้สำเร็จเรียบร้อย!');
      }
    };
    reader.onerror = () => {
      showToast('เกิดข้อผิดพลาดในการอ่านไฟล์ภาพ', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Reset Logo
  const handleResetLogo = () => {
    removeStoredLogo();
    setCurrentLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onLogoUpdated) onLogoUpdated();
    showToast('คืนค่าเป็นรูปโลโก้เริ่มต้นเรียบร้อย');
  };

  // Save Website Info
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    saveRestaurantOverrides(formData);
    showToast('บันทึกการแก้ไขข้อมูลร้านค้าสำเร็จ ข้อมูลหน้าเว็บได้รับการอัปเดตทันที!');
  };

  // Save New Password
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      showToast('กรุณาระบุรหัสผ่านใหม่', 'error');
      return;
    }
    if (newPassword.length < 4) {
      showToast('รหัสผ่านควรมีความยาวอย่างน้อย 4 ตัวอักษร', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('รหัสผ่านใหม่และการยืนยันไม่ตรงกัน', 'error');
      return;
    }

    setOwnerPassword(newPassword.trim());
    setNewPassword('');
    setConfirmPassword('');
    showToast('เปลี่ยนรหัสผ่านเจ้าของร้านเรียบร้อยแล้ว');
  };

  // Reset Everything to Default
  const handleResetAllDefaults = () => {
    if (window.confirm('คุณต้องการคืนค่าข้อมูลเว็บไซต์และโลโก้ทั้งหมดกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
      resetRestaurantOverrides();
      setCurrentLogo(null);
      setFormData(getEffectiveRestaurantData());
      if (onLogoUpdated) onLogoUpdated();
      showToast('คืนค่าข้อมูลทั้งหมดเป็นค่าเริ่มต้นเรียบร้อยแล้ว');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="owner-dashboard-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111827] px-6 py-4.5 text-white flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#EA580C] text-[#FACC15] flex items-center justify-center font-bold shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="owner-dashboard-title" className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                  ระบบจัดการร้านค้า (Owner Control Panel)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">
                  Owner Mode
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans">
                แก้ไขรูปโลโก้, ข้อมูลร้าน, เบอร์โทร, และลิงก์สั่งอาหารได้ทันที
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-1 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-red-50 text-red-800 border-b border-red-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-gray-100 px-6 py-2 border-b border-gray-200 flex gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-white text-[#EA580C] shadow-xs border border-gray-200 font-bold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <FolderPlus className="w-4 h-4 text-[#EA580C]" />
            <span>จัดการหมวดหมู่เมนู (Categories)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dishes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'dishes'
                ? 'bg-white text-[#EA580C] shadow-xs border border-gray-200 font-bold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <Utensils className="w-4 h-4 text-[#EA580C]" />
            <span>ใส่-เปลี่ยนรูปเมนูอาหาร (Dishes & Photos)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'logo'
                ? 'bg-white text-[#EA580C] shadow-xs border border-gray-200 font-bold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#EA580C]" />
            <span>เปลี่ยนรูปโลโก้ร้าน (Logo)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'info'
                ? 'bg-white text-[#EA580C] shadow-xs border border-gray-200 font-bold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <Store className="w-4 h-4 text-[#EA580C]" />
            <span>ข้อมูลร้าน & ลิงก์สั่งอาหาร</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-white text-[#EA580C] shadow-xs border border-gray-200 font-bold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            <Lock className="w-4 h-4 text-[#EA580C]" />
            <span>รหัสผ่านเจ้าของร้าน</span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* TAB: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="max-w-3xl mx-auto">
              <OwnerCategoryManager onNotify={showToast} />
            </div>
          )}

          {/* TAB: DISHES & PHOTOS MANAGEMENT */}
          {activeTab === 'dishes' && (
            <div className="max-w-4xl mx-auto">
              <OwnerDishManager onNotify={showToast} initialDishId={initialDishId} />
            </div>
          )}

          {/* TAB 1: LOGO MANAGEMENT */}
          {activeTab === 'logo' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">
                  เปลี่ยนรูปภาพโลโก้ร้าน (Change Restaurant Logo)
                </h3>
                <p className="text-xs text-gray-600 font-sans">
                  คุณสามารถอัปโหลดไฟล์รูปภาพโลโก้ใหม่ของร้าน เพื่อแสดงที่ส่วนหัวของเว็บไซต์ (Header) และส่วนท้าย (Footer)
                </p>
              </div>

              {/* Live Preview Section */}
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                  ตัวอย่างการแสดงผลโลโก้จริง (Live Logo Preview)
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Round Badge Preview (As seen in Header) */}
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-[#111827] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md border-2 border-[#F59E0B] mx-auto overflow-hidden">
                      {currentLogo ? (
                        <img
                          src={currentLogo}
                          alt="Tony's Kitchen Logo Preview"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <span className="text-[#FACC15]">TK</span>
                      )}
                    </div>
                    <span className="block text-[11px] text-gray-500 mt-2 font-medium">
                      ขนาดไอคอน Header & Footer (80px - ขยายใหญ่ 100%)
                    </span>
                  </div>

                  {/* Card Display Preview */}
                  <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#111827] text-white flex items-center justify-center font-serif text-xl font-bold border-2 border-[#F59E0B] shrink-0 overflow-hidden">
                      {currentLogo ? (
                        <img
                          src={currentLogo}
                          alt="Tony's Kitchen Logo"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <span className="text-[#FACC15]">TK</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-gray-900 leading-tight">
                        {formData.name.th || "ครัวโทนี่ (Tony's Kitchen)"}
                      </h4>
                      <p className="text-xs text-gray-500 font-sans">
                        {formData.tagline.th || 'อาหารไทยแท้ รังสรรค์ด้วยความใส่ใจ'}
                      </p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          currentLogo
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {currentLogo ? '✓ ใช้โลโก้ที่คุณอัปโหลด' : '✓ ใช้โลโก้เริ่มต้น (TK Emblem)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Controls */}
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="logo-file-input"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <label
                    htmlFor="logo-file-input"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm hover:shadow-md transition-all text-center"
                  >
                    <Upload className="w-4 h-4 text-[#FACC15]" />
                    <span>เลือกรูปภาพโลโก้ใหม่จากเครื่อง</span>
                  </label>

                  {currentLogo && (
                    <button
                      type="button"
                      onClick={handleResetLogo}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer text-center"
                    >
                      <RotateCcw className="w-4 h-4 text-gray-500" />
                      <span>คืนค่าโลโก้เริ่มต้น</span>
                    </button>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-orange-900">คำแนะนำในการเลือกรูปโลโก้:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-orange-800 text-[11px]">
                      <li>รองรับไฟล์ PNG, JPG, WebP หรือ SVG</li>
                      <li>แนะนำรูปทรงสี่เหลี่ยมจัตุรัส (1:1) หรือรูปวงกลม ความละเอียด 512x512 พิกเซลขึ้นไป</li>
                      <li>ระบบจะบันทึกลงในหน่วยความจำของบราวเซอร์และแสดงผลทันที</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RESTAURANT INFO & ORDERING LINKS */}
          {activeTab === 'info' && (
            <form onSubmit={handleSaveInfo} className="space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h3 className="font-serif text-xl font-bold text-gray-900 leading-tight">
                    แก้ไขข้อมูลร้านค้า & ลิงก์สั่งอาหาร
                  </h3>
                  <p className="text-xs text-gray-500 font-sans">
                    แก้ไขชื่อร้าน, คำโปรย, เบอร์โทร และลิงก์สั่งอาหารต่าง ๆ
                  </p>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#FACC15]" />
                  <span>บันทึกข้อมูล</span>
                </button>
              </div>

              {/* Names & Taglines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    ชื่อร้าน (ภาษาไทย)
                  </label>
                  <input
                    type="text"
                    value={formData.name.th}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: { ...formData.name, th: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    ชื่อร้าน (English Name)
                  </label>
                  <input
                    type="text"
                    value={formData.name.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: { ...formData.name, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    คำโปรยร้าน (ภาษาไทย)
                  </label>
                  <input
                    type="text"
                    value={formData.tagline.th}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tagline: { ...formData.tagline, th: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Brand Tagline (English)
                  </label>
                  <input
                    type="text"
                    value={formData.tagline.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tagline: { ...formData.tagline, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              {/* Contact & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    เบอร์โทรศัพท์ร้าน (Phone Number)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                          phoneRaw: e.target.value.replace(/[^0-9+]/g, ''),
                        })
                      }
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    เวลาเปิด-ปิด (ภาษาไทย)
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.hours.th}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hours: { ...formData.hours, th: e.target.value },
                        })
                      }
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>
              </div>

              {/* Ordering URLs */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  ลิงก์ช่องทางสั่งอาหาร (Ordering URLs)
                </span>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    ลิงก์ Web App สั่งอาหารของร้าน:
                  </label>
                  <input
                    type="url"
                    value={formData.links.app}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        links: { ...formData.links, app: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    ลิงก์ GrabFood:
                  </label>
                  <input
                    type="url"
                    value={formData.links.grabFood}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        links: { ...formData.links, grabFood: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      ลิงก์ LINE Official / Account:
                    </label>
                    <input
                      type="url"
                      value={formData.links.line}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: { ...formData.links, line: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      LINE ID:
                    </label>
                    <input
                      type="text"
                      value={formData.links.lineId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: { ...formData.links, lineId: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    ลิงก์ WhatsApp:
                  </label>
                  <input
                    type="url"
                    value={formData.links.whatsapp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        links: { ...formData.links, whatsapp: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#FACC15]" />
                  <span>บันทึกการเปลี่ยนแปลง</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-md mx-auto">
              <div>
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">
                  ตั้งรหัสผ่านเจ้าของร้านใหม่
                </h3>
                <p className="text-xs text-gray-600 font-sans">
                  เปลี่ยนรหัสผ่านที่ใช้สำหรับกดรูป Logo 5 ครั้งเพื่อเข้าสู่ระบบ Owner
                </p>
              </div>

              <form onSubmit={handleSavePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    รหัสผ่านใหม่ (New Password)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="อย่างน้อย 4 ตัวอักษร"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    ยืนยันรหัสผ่านใหม่ (Confirm New Password)
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all cursor-pointer text-center"
                >
                  บันทึกรหัสผ่านใหม่
                </button>
              </form>

              <div className="pt-6 border-t border-gray-200">
                <span className="block text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
                  คืนค่าระบบเริ่มต้นทั้งหมด (Danger Zone)
                </span>
                <p className="text-xs text-gray-500 mb-3 font-sans">
                  หากต้องการลบข้อมูลที่แก้ไขและรูปภาพโลโก้ทั้งหมด กลับเป็นค่าเริ่มต้นจากระบบ
                </p>
                <button
                  type="button"
                  onClick={handleResetAllDefaults}
                  className="w-full py-2.5 px-4 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  คืนค่าข้อมูลและโลโก้ทั้งหมดกลับสู่ค่าเริ่มต้น
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>โหมดเจ้าของร้านพร้อมใช้งาน (Owner Mode Active)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง / ดูหน้าเว็บจริง
          </button>
        </div>
      </div>
    </div>
  );
};
