import React, { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, X } from 'lucide-react';
import { verifyOwnerPassword } from '../data/ownerStore';

interface OwnerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('กรุณากรอกรหัสผ่าน (Please enter password)');
      return;
    }

    if (verifyOwnerPassword(password)) {
      setError(null);
      onSuccess();
    } else {
      setError('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง (Incorrect password)');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="owner-auth-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-md bg-[#111827] text-white rounded-3xl shadow-2xl border border-gray-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header accent strip */}
        <div className="bg-black px-6 py-5 text-white flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EA580C] text-[#FACC15] flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 id="owner-auth-title" className="font-serif text-lg font-bold tracking-tight text-white leading-tight">
                เข้าสู่โหมดเจ้าของร้าน
              </h2>
              <span className="text-xs text-gray-400 font-sans">
                Owner Access Verification
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7">
          <div className="mb-5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-[#FACC15] border border-amber-500/40 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>กดโลโก้ครบ 5 ครั้งเพื่อเข้าสู่ระบบ</span>
            </div>
            <p className="text-sm text-gray-300 font-sans">
              กรุณาใส่รหัสผ่านสำหรับเจ้าของร้าน เพื่อเข้าไปจัดการและแก้ไขข้อมูลเว็บไซต์
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="owner-password" className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                รหัสผ่านเจ้าของร้าน (Owner Password)
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="owner-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="กรอกรหัสผ่าน..."
                  className={`w-full px-4 py-3 pr-11 text-sm bg-black/60 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    error
                      ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20'
                      : 'border-gray-700 focus:border-[#EA580C] focus:ring-2 focus:ring-orange-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="text-xs text-red-400 mt-2 font-medium flex items-center gap-1">
                  <span>⚠️</span>
                  <span>{error}</span>
                </p>
              )}

              <div className="mt-2.5 p-2.5 rounded-lg bg-black/50 border border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                <span>รหัสผ่านเริ่มต้นสำหรับครั้งแรก:</span>
                <span className="font-mono font-bold text-[#FACC15] bg-[#111827] px-2 py-0.5 rounded border border-gray-700">
                  1234
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-700 text-xs font-bold text-gray-300 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer text-center"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs hover:shadow-md cursor-pointer text-center"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
