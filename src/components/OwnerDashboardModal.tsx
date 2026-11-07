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
        <div className="p-8 text-center bg-[#111827] rounded-3xl border border-red-500/40 text-white my-4 max-w-lg mx-auto">
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

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({
  isOpen,
  onClose,
  onLogoUpdated,
  initialTab = 'categories',
  initialDishId,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'dishes' | 'logo' | 'info' | 'security'>(initialTab);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [formData, setFormData] = useState<RestaurantData>(getEffectiveRestaurantData);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pendingLogo, setPendingLogo] = useState<string | null>(null);
  const [isSavingLogo, setIsSavingLogo] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      try {
        setCurrentLogo(getStoredLogo());
        setFormData(getEffectiveRestaurantData());
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
    }, 4000);
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

  // Save Website Info
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveRestaurantOverrides(formData);
      showToast('บันทึกการแก้ไขข้อมูลร้านค้าสำเร็จ ข้อมูลหน้าเว็บได้รับการอัปเดตทันที!');
      if (onLogoUpdated) onLogoUpdated();
    } catch {
      showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
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
      setFormData(getEffectiveRestaurantData());
      if (onLogoUpdated) onLogoUpdated();
      showToast('คืนค่าข้อมูลทั้งหมดเป็นค่าเริ่มต้นเรียบร้อยแล้ว');
    }
  };

  // Safe field accessors with deep defaults
  const safeNameTh = formData?.name?.th ?? RESTAURANT_DATA.name.th;
  const safeNameEn = formData?.name?.en ?? RESTAURANT_DATA.name.en;
  const safeTaglineTh = formData?.tagline?.th ?? RESTAURANT_DATA.tagline.th;
  const safeTaglineEn = formData?.tagline?.en ?? RESTAURANT_DATA.tagline.en;
  const safePhone = formData?.phone ?? RESTAURANT_DATA.phone;
  const safeHoursTh = formData?.hours?.th ?? RESTAURANT_DATA.hours.th;
  const safeAppUrl = formData?.links?.app ?? RESTAURANT_DATA.links.app;
  const safeGrabUrl = formData?.links?.grabFood ?? RESTAURANT_DATA.links.grabFood;
  const safeLineUrl = formData?.links?.line ?? RESTAURANT_DATA.links.line;
  const safeLineId = formData?.links?.lineId ?? RESTAURANT_DATA.links.lineId;
  const safeWhatsappUrl = formData?.links?.whatsapp ?? RESTAURANT_DATA.links.whatsapp;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="owner-dashboard-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-4xl bg-[#0B0F17] text-white rounded-3xl shadow-2xl border border-gray-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-black px-6 py-4.5 text-white flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#EA580C] text-[#FACC15] flex items-center justify-center font-bold shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="owner-dashboard-title" className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                  ระบบจัดการร้านค้า (Owner Control Panel)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black text-[#FACC15] border border-amber-400/40">
                  Owner Mode
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans">
                แก้ไขรูปอาหาร, จัดการหมวดหมู่, เปลี่ยนโลโก้ร้าน, และอัปเดตข้อมูลได้ทันที
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
                ? 'bg-emerald-950/80 text-emerald-300 border-b border-emerald-800'
                : 'bg-red-950/80 text-red-300 border-b border-red-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-[#111827] px-4 sm:px-6 py-2 border-b border-gray-800 flex gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-[#EA580C] text-white shadow-xs font-bold'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <FolderPlus className="w-4 h-4 text-[#FACC15]" />
            <span>จัดการหมวดหมู่เมนู (Categories)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dishes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'dishes'
                ? 'bg-[#EA580C] text-white shadow-xs font-bold'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Utensils className="w-4 h-4 text-[#FACC15]" />
            <span>ใส่-เปลี่ยนรูปเมนูอาหาร (Dishes & Photos)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'logo'
                ? 'bg-[#EA580C] text-white shadow-xs font-bold'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#FACC15]" />
            <span>เปลี่ยนรูปโลโก้ร้าน (Logo)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'info'
                ? 'bg-[#EA580C] text-white shadow-xs font-bold'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Store className="w-4 h-4 text-[#FACC15]" />
            <span>ข้อมูลร้าน & ลิงก์สั่งอาหาร</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-[#EA580C] text-white shadow-xs font-bold'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Lock className="w-4 h-4 text-[#FACC15]" />
            <span>รหัสผ่านเจ้าของร้าน</span>
          </button>
        </div>

        {/* Scrollable Body Content Wrapped in Error Boundary */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 bg-[#0B0F17] text-white">
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
                  <h3 className="font-serif text-xl font-bold text-white mb-1">
                    เปลี่ยนรูปภาพโลโก้ร้าน (Change Restaurant Logo)
                  </h3>
                  <p className="text-xs text-gray-400 font-sans">
                    คุณสามารถอัปโหลดไฟล์รูปภาพโลโก้ใหม่ของร้าน เพื่อแสดงที่ส่วนหัวของเว็บไซต์ (Header) และส่วนท้าย (Footer)
                  </p>
                </div>

                {/* Live Preview Section */}
                <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800">
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
                    <div className="flex-1 bg-black/60 p-4 rounded-xl border border-gray-800 flex items-center gap-4">
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
                      <div>
                        <h4 className="font-serif text-lg font-bold text-white leading-tight">
                          {safeNameTh}
                        </h4>
                        <p className="text-xs text-gray-400 font-sans">
                          {safeTaglineTh}
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
                <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white leading-tight">
                      แก้ไขข้อมูลร้านค้า & ลิงก์สั่งอาหาร
                    </h3>
                    <p className="text-xs text-gray-400 font-sans">
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      ชื่อร้าน (ภาษาไทย)
                    </label>
                    <input
                      type="text"
                      value={safeNameTh}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: { ...prev.name, th: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      ชื่อร้าน (English Name)
                    </label>
                    <input
                      type="text"
                      value={safeNameEn}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: { ...prev.name, en: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      คำโปรยร้าน (ภาษาไทย)
                    </label>
                    <input
                      type="text"
                      value={safeTaglineTh}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tagline: { ...prev.tagline, th: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Brand Tagline (English)
                    </label>
                    <input
                      type="text"
                      value={safeTaglineEn}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tagline: { ...prev.tagline, en: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Contact & Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-800">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      เบอร์โทรศัพท์ร้าน (Phone Number)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={safePhone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                            phoneRaw: e.target.value.replace(/[^0-9+]/g, ''),
                          }))
                        }
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      เวลาเปิด-ปิด (ภาษาไทย)
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={safeHoursTh}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            hours: { ...prev.hours, th: e.target.value },
                          }))
                        }
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Ordering URLs */}
                <div className="space-y-3 pt-2 border-t border-gray-800">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#FACC15]">
                    ลิงก์ช่องทางสั่งอาหาร (Ordering URLs)
                  </span>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                      ลิงก์ Web App สั่งอาหารของร้าน:
                    </label>
                    <input
                      type="url"
                      value={safeAppUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          links: { ...prev.links, app: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 text-xs bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                      ลิงก์ GrabFood:
                    </label>
                    <input
                      type="url"
                      value={safeGrabUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          links: { ...prev.links, grabFood: e.target.value },
                        }))
                      }
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
                        value={safeLineUrl}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            links: { ...prev.links, line: e.target.value },
                          }))
                        }
                        className="w-full px-3.5 py-2 text-xs bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                        LINE ID:
                      </label>
                      <input
                        type="text"
                        value={safeLineId}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            links: { ...prev.links, lineId: e.target.value },
                          }))
                        }
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
                      value={safeWhatsappUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          links: { ...prev.links, whatsapp: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 text-xs bg-black/60 border border-gray-700 text-white rounded-xl focus:border-[#EA580C] focus:outline-none"
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

            {/* TAB: SECURITY & PASSWORD */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-md mx-auto">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white mb-1">
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

        {/* Footer Actions */}
        <div className="bg-black px-6 py-4 border-t border-gray-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>โหมดเจ้าของร้านพร้อมใช้งาน (Owner Mode Active)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-gray-800 border border-gray-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง / ดูหน้าเว็บจริง
          </button>
        </div>
      </div>
    </div>
  );
};
