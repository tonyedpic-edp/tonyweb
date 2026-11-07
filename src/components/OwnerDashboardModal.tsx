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
  Store,
  Sparkles,
  Info,
  FolderPlus,
  Utensils,
  AlertTriangle,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import {
  getStoredLogo,
  setStoredLogo,
  removeStoredLogo,
  getEffectiveRestaurantData,
  saveRestaurantOverrides,
  resetRestaurantOverrides,
  setOwnerPassword,
  optimizeImageFile,
} from '../data/ownerStore';
import { RestaurantData, RESTAURANT_DATA } from '../data/restaurant';
import { OwnerCategoryManager } from './OwnerCategoryManager';
import { OwnerDishManager } from './OwnerDishManager';

// Safe React Error Boundary to prevent any blank white screen crashes
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class DashboardErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Error occurred' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Owner dashboard error caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 sm:p-8 text-center bg-[#111827] rounded-3xl border border-red-500/40 text-white my-4 max-w-lg mx-auto">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            {this.props.fallbackTitle || 'เกิดข้อผิดพลาดในการแสดงผล'}
          </h3>
          <p className="text-xs text-gray-400 mb-4 font-sans">
            ระบบสามารถกู้คืนได้ทันทีโดยกดปุ่มด้านล่าง
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, errorMessage: '' })}
              className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              ลองโหลดใหม่อีกครั้ง
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoUpdated?: () => void;
  initialTab?: 'categories' | 'dishes' | 'logo' | 'info' | 'security';
  initialDishId?: string | null;
}

interface InfoFormFields {
  nameTh: string;
  nameEn: string;
  taglineTh: string;
  taglineEn: string;
  phone: string;
  hoursTh: string;
  hoursEn: string;
  addressTh: string;
  addressEn: string;
  landmarkTh: string;
  landmarkEn: string;
  appUrl: string;
  grabFoodUrl: string;
  lineUrl: string;
  lineId: string;
  whatsappUrl: string;
  googleMapsUrl: string;
}

const buildInfoForm = (data: RestaurantData): InfoFormFields => ({
  nameTh: data.name?.th || RESTAURANT_DATA.name.th,
  nameEn: data.name?.en || RESTAURANT_DATA.name.en,
  taglineTh: data.tagline?.th || RESTAURANT_DATA.tagline.th,
  taglineEn: data.tagline?.en || RESTAURANT_DATA.tagline.en,
  phone: data.phone || RESTAURANT_DATA.phone,
  hoursTh: data.hours?.th || RESTAURANT_DATA.hours.th,
  hoursEn: data.hours?.en || RESTAURANT_DATA.hours.en,
  addressTh: data.address?.th || RESTAURANT_DATA.address.th,
  addressEn: data.address?.en || RESTAURANT_DATA.address.en,
  landmarkTh: data.address?.landmarkTh || RESTAURANT_DATA.address.landmarkTh,
  landmarkEn: data.address?.landmarkEn || RESTAURANT_DATA.address.landmarkEn,
  appUrl: data.links?.app || RESTAURANT_DATA.links.app,
  grabFoodUrl: data.links?.grabFood || RESTAURANT_DATA.links.grabFood,
  lineUrl: data.links?.line || RESTAURANT_DATA.links.line,
  lineId: data.links?.lineId || RESTAURANT_DATA.links.lineId,
  whatsappUrl: data.links?.whatsapp || RESTAURANT_DATA.links.whatsapp,
  googleMapsUrl: data.links?.googleMaps || RESTAURANT_DATA.links.googleMaps,
});

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({
  isOpen,
  onClose,
  onLogoUpdated,
  initialTab = 'categories',
  initialDishId,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'dishes' | 'logo' | 'info' | 'security'>(initialTab);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [infoForm, setInfoForm] = useState<InfoFormFields>(() => buildInfoForm(getEffectiveRestaurantData()));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pendingLogo, setPendingLogo] = useState<string | null>(null);
  const [isSavingLogo, setIsSavingLogo] = useState(false);
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      try {
        setCurrentLogo(getStoredLogo());
        const effective = getEffectiveRestaurantData();
        setInfoForm(buildInfoForm(effective));
      } catch (err) {
        console.error('Failed to load initial data in modal', err);
      }
      setStatusMessage(null);
      setNewPassword('');
      setConfirmPassword('');
      setPendingLogo(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  // Handle Logo Selection
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('กรุณาเลือกไฟล์รูปภาพเท่านั้น (PNG, JPG, WebP, SVG)', 'error');
      return;
    }

    try {
      const optimized = await optimizeImageFile(file, 800, 800, 0.85);
      if (optimized) {
        setPendingLogo(optimized);
        showToast('เลือกรูปโลโก้เรียบร้อยแล้ว กรุณากดปุ่ม "บันทึกรูปโลโก้ใหม่" เพื่อนำไปใช้งาน');
      }
    } catch {
      showToast('เกิดข้อผิดพลาดในการอ่านไฟล์ภาพ', 'error');
    }
  };

  // Explicit Save Logo Button handler
  const handleSaveLogo = async () => {
    if (!pendingLogo) return;
    setIsSavingLogo(true);
    try {
      await setStoredLogo(pendingLogo);
      setCurrentLogo(pendingLogo);
      setPendingLogo(null);
      if (onLogoUpdated) onLogoUpdated();
      showToast('บันทึกและอัปเดตรูปโลโก้ใหม่ขึ้นระบบสำเร็จ ข้อมูลในทุกอุปกรณ์จะอัปเดตทันที!');
    } catch {
      showToast('เกิดข้อผิดพลาดในการบันทึกรูปโลโก้', 'error');
    } finally {
      setIsSavingLogo(false);
    }
  };

  // Reset Logo
  const handleResetLogo = async () => {
    await removeStoredLogo();
    setCurrentLogo(null);
    setPendingLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onLogoUpdated) onLogoUpdated();
    showToast('คืนค่าเป็นรูปโลโก้เริ่มต้นเรียบร้อย');
  };

  // Save Website Info & Links with full atomic persistence
  const handleSaveInfo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingInfo(true);
    try {
      const current = getEffectiveRestaurantData();
      const updatedData: RestaurantData = {
        ...current,
        name: {
          en: infoForm.nameEn.trim() || current.name.en,
          th: infoForm.nameTh.trim() || current.name.th,
        },
        tagline: {
          en: infoForm.taglineEn.trim() || current.tagline.en,
          th: infoForm.taglineTh.trim() || current.tagline.th,
        },
        phone: infoForm.phone.trim() || current.phone,
        phoneRaw: infoForm.phone.trim().replace(/[^0-9+]/g, '') || current.phoneRaw,
        hours: {
          ...current.hours,
          en: infoForm.hoursEn.trim() || current.hours.en,
          th: infoForm.hoursTh.trim() || current.hours.th,
        },
        address: {
          ...current.address,
          en: infoForm.addressEn.trim() || current.address.en,
          th: infoForm.addressTh.trim() || current.address.th,
          landmarkEn: infoForm.landmarkEn.trim() || current.address.landmarkEn,
          landmarkTh: infoForm.landmarkTh.trim() || current.address.landmarkTh,
        },
        links: {
          ...current.links,
          app: infoForm.appUrl.trim() || current.links.app,
          grabFood: infoForm.grabFoodUrl.trim() || current.links.grabFood,
          line: infoForm.lineUrl.trim() || current.links.line,
          lineId: infoForm.lineId.trim() || current.links.lineId,
          whatsapp: infoForm.whatsappUrl.trim() || current.links.whatsapp,
          googleMaps: infoForm.googleMapsUrl.trim() || current.links.googleMaps,
        },
      };

      await saveRestaurantOverrides(updatedData);
      setInfoForm(buildInfoForm(updatedData));
      if (onLogoUpdated) onLogoUpdated();
      showToast('✓ บันทึกข้อมูลและลิงก์เรียบร้อยแล้ว! ทุกส่วนของหน้าเว็บได้รับการอัปเดตทันที');
    } catch (err) {
      console.error('Save info error:', err);
      showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    } finally {
      setIsSavingInfo(false);
    }
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
  const handleResetAllDefaults = async () => {
    if (window.confirm('คุณต้องการคืนค่าข้อมูลเว็บไซต์และโลโก้ทั้งหมดกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
      await resetRestaurantOverrides();
      setCurrentLogo(null);
      setPendingLogo(null);
      const defaults = getEffectiveRestaurantData();
      setInfoForm(buildInfoForm(defaults));
      if (onLogoUpdated) onLogoUpdated();
      showToast('คืนค่าข้อมูลทั้งหมดเป็นค่าเริ่มต้นเรียบร้อยแล้ว');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="owner-dashboard-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden"
    >
      <div
        className="relative w-full max-w-4xl bg-[#0B0F17] text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-800 flex flex-col h-[94vh] max-h-[94vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed Height, Never Shrinks */}
        <div className="bg-black px-4 sm:px-6 py-3.5 sm:py-4.5 text-white flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EA580C] text-[#FACC15] flex items-center justify-center font-bold shadow-xs shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="owner-dashboard-title" className="font-serif text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white leading-tight truncate">
                  ระบบจัดการร้านค้า (Owner Control Panel)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black text-[#FACC15] border border-amber-400/40 shrink-0">
                  Owner Mode
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans truncate">
                แก้ไขรูปอาหาร, จัดการหมวดหมู่, เปลี่ยนโลโก้ร้าน, และอัปเดตข้อมูลได้ทันที
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast Notification */}
        {statusMessage && (
          <div
            className={`px-4 sm:px-6 py-2.5 text-xs font-semibold flex items-center gap-2 shrink-0 animate-in slide-in-from-top-1 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950 text-emerald-300 border-b border-emerald-800'
                : 'bg-red-950 text-red-300 border-b border-red-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="truncate">{statusMessage.text}</span>
          </div>
        )}

        {/* Navigation Tabs - Horizontal Scroll Protected */}
        <div className="bg-[#111827] px-3 sm:px-6 py-2 border-b border-gray-800 flex gap-1.5 sm:gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-[#EA580C] text-white shadow-xs font-bold'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <FolderPlus className="w-4 h-4 text-[#FACC15]" />
            <span>จัดการหมวดหมู่เมนู</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dishes')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'dishes'
                ? 'bg-[#EA580C] text-white shadow-xs font-bold'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Utensils className="w-4 h-4 text-[#FACC15]" />
            <span>ใส่-เปลี่ยนรูปเมนูอาหาร</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logo')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'logo'
                ? 'bg-[#EA580C] text-white shadow-xs font-bold'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#FACC15]" />
            <span>เปลี่ยนรูปโลโก้ร้าน</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'info'
                ? 'bg-[#EA580C] text-white shadow-xs font-bold'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Store className="w-4 h-4 text-[#FACC15]" />
            <span>ข้อมูลร้าน & ลิงก์สื่อ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-[#EA580C] text-white shadow-xs font-bold'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Lock className="w-4 h-4 text-[#FACC15]" />
            <span>รหัสผ่าน</span>
          </button>
        </div>

        {/* Scrollable Body Content - Critical min-h-0 prevents container overflow */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#0B0F17] text-white">
          <DashboardErrorBoundary fallbackTitle="เกิดข้อผิดพลาดในการโหลดระบบจัดการ">
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

            {/* TAB: LOGO MANAGEMENT */}
            {activeTab === 'logo' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-1">
                    เปลี่ยนรูปภาพโลโก้ร้าน (Change Restaurant Logo)
                  </h3>
                  <p className="text-xs text-gray-400 font-sans">
                    คุณสามารถอัปโหลดไฟล์รูปภาพโลโก้ใหม่ของร้าน เพื่อแสดงที่ส่วนหัวของเว็บไซต์ (Header) และส่วนท้าย (Footer)
                  </p>
                </div>

                {/* Live Preview Section */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#111827] border border-gray-800">
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                    ตัวอย่างการแสดงผลโลโก้จริง (Live Logo Preview)
                  </span>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Round Badge Preview (As seen in Header) */}
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-2xl bg-black text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md border-2 border-[#F59E0B] mx-auto overflow-hidden">
                        {pendingLogo || currentLogo ? (
                          <img
                            src={pendingLogo || currentLogo || ''}
                            alt="Tony's Kitchen Logo Preview"
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span className="text-[#FACC15]">TK</span>
                        )}
                      </div>
                      <span className="block text-[11px] text-gray-400 mt-2 font-medium">
                        ขนาดไอคอน Header & Footer (80px)
                      </span>
                    </div>

                    {/* Card Display Preview */}
                    <div className="flex-1 bg-black/60 p-4 rounded-xl border border-gray-800 flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center font-serif text-xl font-bold border-2 border-[#F59E0B] shrink-0 overflow-hidden">
                        {pendingLogo || currentLogo ? (
                          <img
                            src={pendingLogo || currentLogo || ''}
                            alt="Tony's Kitchen Logo"
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span className="text-[#FACC15]">TK</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif text-base sm:text-lg font-bold text-white leading-tight truncate">
                          {infoForm.nameTh}
                        </h4>
                        <p className="text-xs text-gray-400 font-sans truncate">
                          {infoForm.taglineTh}
                        </p>
                        <div className="mt-1">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            pendingLogo
                              ? 'bg-amber-900/60 text-[#FACC15] border border-amber-500/50'
                              : currentLogo
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-gray-800 text-gray-300'
                          }`}>
                            {pendingLogo
                              ? '⏳ รูปใหม่รอการกดบันทึก'
                              : currentLogo
                              ? '✓ ใช้โลโก้ที่คุณอัปโหลดแล้ว'
                              : '✓ ใช้โลโก้เริ่มต้น (TK Emblem)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload Controls & Save Button */}
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="logo-file-input"
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />

                  {/* Prominent Action Bar when a new image is selected */}
                  {pendingLogo && (
                    <div className="p-4 rounded-2xl bg-[#111827] border-2 border-[#EA580C] shadow-lg animate-in fade-in slide-in-from-top-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#EA580C]" />
                            <span>คุณได้เลือกรูปภาพโลโก้ใหม่แล้ว!</span>
                          </h4>
                          <p className="text-xs text-gray-300 mt-0.5 font-sans">
                            กดปุ่ม &quot;บันทึกรูปโลโก้ใหม่&quot; เพื่อแทนที่รูปเก่าและอัปเดตลง Cloud ให้ลูกค้าทุกคนเห็นทันที
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPendingLogo(null)}
                            className="px-4 py-2.5 rounded-xl border border-gray-700 text-xs font-bold text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
                          >
                            ยกเลิก
                          </button>
                          <button
                            type="button"
                            disabled={isSavingLogo}
                            onClick={handleSaveLogo}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Save className="w-4 h-4 text-[#FACC15]" />
                            <span>{isSavingLogo ? 'กำลังบันทึก...' : 'บันทึกรูปโลโก้ใหม่'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <label
                      htmlFor="logo-file-input"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm hover:shadow-md transition-all text-center"
                    >
                      <Upload className="w-4 h-4 text-[#FACC15]" />
                      <span>{currentLogo ? 'เลือกเปลี่ยนรูปภาพโลโก้ใหม่' : 'เลือกรูปภาพโลโก้จากเครื่อง'}</span>
                    </label>

                    {currentLogo && (
                      <button
                        type="button"
                        onClick={handleResetLogo}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-gray-700 text-xs font-bold text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer text-center"
                      >
                        <RotateCcw className="w-4 h-4 text-gray-400" />
                        <span>คืนค่าโลโก้เริ่มต้น</span>
                      </button>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-[#111827] border border-gray-800 text-xs text-gray-300 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-white">คำแนะนำในการเปลี่ยนโลโก้ร้าน:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-400 text-[11px]">
                        <li>เมื่อกดเลือกรูปจากเครื่องแล้ว จะมีปุ่ม <strong>&quot;บันทึกรูปโลโก้ใหม่&quot;</strong> แสดงขึ้นมาให้กดยืนยัน</li>
                        <li>เมื่อบันทึกแล้ว ระบบ Cloud Firestore จะส่งรูปโลโก้ใหม่ไปยังมือถือของลูกค้าทุกคนทันที</li>
                        <li>รองรับไฟล์ PNG, JPG, WebP หรือ SVG แนะนำรูปทรงจัตุรัส (1:1)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: RESTAURANT INFO & ORDERING LINKS */}
            {activeTab === 'info' && (
              <form onSubmit={handleSaveInfo} className="space-y-6 max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-800 gap-3">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                      แก้ไขข้อมูลร้านค้า & ลิงก์สื่อ / ช่องทางสั่งอาหาร
                    </h3>
                    <p className="text-xs text-gray-400 font-sans mt-0.5">
                      แก้ไขชื่อร้าน, คำโปรย, เบอร์โทร, ที่อยู่ และลิงก์สั่งอาหารต่าง ๆ
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingInfo}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Save className="w-4 h-4 text-[#FACC15]" />
                    <span>{isSavingInfo ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</span>
                  </button>
                </div>

                {/* Section 1: Names & Taglines */}
                <div className="space-y-4">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#FACC15]">
                    1. ชื่อร้าน & คำโปรย (Brand Identity)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        ชื่อร้าน (ภาษาไทย)
                      </label>
                      <input
                        type="text"
                        value={infoForm.nameTh}
                        onChange={(e) => setInfoForm((prev) => ({ ...prev, nameTh: e.target.value }))}
                        className="w-full px-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        ชื่อร้าน (English Name)
                      </label>
                      <input
                        type="text"
                        value={infoForm.nameEn}
                        onChange={(e) => setInfoForm((prev) => ({ ...prev, nameEn: e.target.value }))}
                        className="w-full px-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        คำโปรยร้าน (ภาษาไทย)
                      </label>
                      <input
                        type="text"
                        value={infoForm.taglineTh}
                        onChange={(e) => setInfoForm((prev) => ({ ...prev, taglineTh: e.target.value }))}
                        className="w-full px-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Brand Tagline (English)
                      </label>
                      <input
                        type="text"
                        value={infoForm.taglineEn}
                        onChange={(e) => setInfoForm((prev) => ({ ...prev, taglineEn: e.target.value }))}
                        className="w-full px-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Contact, Phone & Hours */}
                <div className="space-y-4 pt-3 border-t border-gray-800">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#FACC15]">
                    2. เบอร์โทรศัพท์ & เวลาเปิด-ปิด (Contact & Hours)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        เบอร์โทรศัพท์ร้าน
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={infoForm.phone}
                          onChange={(e) => setInfoForm((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="084-153-6498"
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        เวลาทำการ (ภาษาไทย)
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={infoForm.hoursTh}
                          onChange={(e) => setInfoForm((prev) => ({ ...prev, hoursTh: e.target.value }))}
                          placeholder="เปิดบริการทุกวัน: 10:00 - 21:00 น."
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Hours (English)
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={infoForm.hoursEn}
                          onChange={(e) => setInfoForm((prev) => ({ ...prev, hoursEn: e.target.value }))}
                          placeholder="Open Daily: 10:00 AM – 9:00 PM"
                          className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Address & Location */}
                <div className="space-y-4 pt-3 border-t border-gray-800">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#FACC15] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>3. ทำเลที่ตั้ง & ที่อยู่ร้าน (Location & Address)</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        จุดสังเกตทำเลที่ตั้ง (ภาษาไทย)
                      </label>
                      <input
                        type="text"
                        value={infoForm.landmarkTh}
                        onChange={(e) => setInfoForm((prev) => ({ ...prev, landmarkTh: e.target.value }))}
                        placeholder="หน้าทางเข้าหมู่บ้านนิชดาธานี ซอยสามัคคี 29"
                        className="w-full px-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Landmark / Location (English)
                      </label>
                      <input
                        type="text"
                        value={infoForm.landmarkEn}
                        onChange={(e) => setInfoForm((prev) => ({ ...prev, landmarkEn: e.target.value }))}
                        placeholder="In front of Nichada Thani Village entrance"
                        className="w-full px-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        ที่อยู่ร้านฉบับเต็ม (ภาษาไทย)
                      </label>
                      <input
                        type="text"
                        value={infoForm.addressTh}
                        onChange={(e) => setInfoForm((prev) => ({ ...prev, addressTh: e.target.value }))}
                        placeholder="หน้าทางเข้าหมู่บ้านนิชดาธานี ซอยสามัคคี 29 ตำบลบางตลาด อำเภอปากเกร็ด นนทบุรี 11120"
                        className="w-full px-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Ordering URLs & Social Links */}
                <div className="space-y-4 pt-3 border-t border-gray-800">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#FACC15]">
                    4. ลิงก์ช่องทางสั่งอาหาร & สื่อออนไลน์ (Ordering & Media Links)
                  </span>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                      ลิงก์ Web App สั่งอาหารของร้าน:
                    </label>
                    <input
                      type="url"
                      value={infoForm.appUrl}
                      onChange={(e) => setInfoForm((prev) => ({ ...prev, appUrl: e.target.value }))}
                      placeholder="https://tonykitchenth-cloud.github.io/tonypos2/"
                      className="w-full px-3.5 py-2 text-xs bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                      ลิงก์ GrabFood:
                    </label>
                    <input
                      type="url"
                      value={infoForm.grabFoodUrl}
                      onChange={(e) => setInfoForm((prev) => ({ ...prev, grabFoodUrl: e.target.value }))}
                      placeholder="https://app.grab.com/s/0gwvUpSc"
                      className="w-full px-3.5 py-2 text-xs bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                        ลิงก์ LINE Official / Account:
                      </label>
                      <input
                        type="url"
                        value={infoForm.lineUrl}
                        onChange={(e) => setInfoForm((prev) => ({ ...prev, lineUrl: e.target.value }))}
                        placeholder="https://line.me/ti/p/~padaroisauce"
                        className="w-full px-3.5 py-2 text-xs bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                        LINE ID:
                      </label>
                      <input
                        type="text"
                        value={infoForm.lineId}
                        onChange={(e) => setInfoForm((prev) => ({ ...prev, lineId: e.target.value }))}
                        placeholder="padaroisauce"
                        className="w-full px-3.5 py-2 text-xs bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                      ลิงก์ WhatsApp:
                    </label>
                    <input
                      type="url"
                      value={infoForm.whatsappUrl}
                      onChange={(e) => setInfoForm((prev) => ({ ...prev, whatsappUrl: e.target.value }))}
                      placeholder="https://wa.me/66841536498"
                      className="w-full px-3.5 py-2 text-xs bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                      ลิงก์ Google Maps สำหรับลูกค้านำทาง:
                    </label>
                    <input
                      type="url"
                      value={infoForm.googleMapsUrl}
                      onChange={(e) => setInfoForm((prev) => ({ ...prev, googleMapsUrl: e.target.value }))}
                      placeholder="https://maps.google.com/?q=Tony's+Kitchen..."
                      className="w-full px-3.5 py-2 text-xs bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit Action Bar */}
                <div className="pt-4 pb-2 flex items-center justify-between border-t border-gray-800">
                  <span className="text-[11px] text-gray-400">
                    * เมื่อกดบันทึก ข้อมูลในหน้าแรกและทุกอุปกรณ์จะอัปเดตตรงกันทันที
                  </span>

                  <button
                    type="submit"
                    disabled={isSavingInfo}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 text-[#FACC15]" />
                    <span>{isSavingInfo ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการเปลี่ยนแปลง'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB: SECURITY & PASSWORD */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-md mx-auto">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-1">
                    ตั้งรหัสผ่านเจ้าของร้านใหม่
                  </h3>
                  <p className="text-xs text-gray-400 font-sans">
                    เปลี่ยนรหัสผ่านที่ใช้สำหรับกดรูป Logo 5 ครั้งเพื่อเข้าสู่ระบบ Owner
                  </p>
                </div>

                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      รหัสผ่านใหม่ (New Password)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="อย่างน้อย 4 ตัวอักษร"
                      className="w-full px-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      ยืนยันรหัสผ่านใหม่ (Confirm New Password)
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
                      className="w-full px-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all cursor-pointer text-center"
                  >
                    บันทึกรหัสผ่านใหม่
                  </button>
                </form>

                <div className="pt-6 border-t border-gray-800">
                  <span className="block text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
                    คืนค่าระบบเริ่มต้นทั้งหมด (Danger Zone)
                  </span>
                  <p className="text-xs text-gray-400 mb-3 font-sans">
                    หากต้องการลบข้อมูลที่แก้ไขและรูปภาพโลโก้ทั้งหมด กลับเป็นค่าเริ่มต้นจากระบบ
                  </p>
                  <button
                    type="button"
                    onClick={handleResetAllDefaults}
                    className="w-full py-2.5 px-4 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-950/40 text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    คืนค่าข้อมูลและโลโก้ทั้งหมดกลับสู่ค่าเริ่มต้น
                  </button>
                </div>
              </div>
            )}
          </DashboardErrorBoundary>
        </div>

        {/* Footer - Fixed Height, Never Overflowing */}
        <div className="bg-black px-4 sm:px-6 py-3 sm:py-3.5 border-t border-gray-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">โหมดเจ้าของร้านพร้อมใช้งาน (Owner Mode Active)</span>
            <span className="sm:hidden">Owner Mode</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#111827] hover:bg-gray-800 border border-gray-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง / ดูหน้าเว็บจริง
          </button>
        </div>
      </div>
    </div>
  );
};
