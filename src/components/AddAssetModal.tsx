import React, { useState } from 'react';
import {
  Wallet,
  CreditCard,
  Smartphone,
  PiggyBank,
  Banknote,
  Plus,
  X,
  Check,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Wallet as WalletType } from '../types';

interface PresetBank {
  name: string;
  bankName: string;
  color: string;
}

const PRESET_BANKS: PresetBank[] = [
  { name: 'Vietcombank', bankName: 'Vietcombank', color: '#059669' },
  { name: 'MB Bank', bankName: 'MB Bank', color: '#2563eb' },
  { name: 'Techcombank', bankName: 'Techcombank', color: '#dc2626' },
  { name: 'ACB', bankName: 'ACB', color: '#0284c7' },
  { name: 'BIDV', bankName: 'BIDV', color: '#0d9488' },
  { name: 'VPBank', bankName: 'VPBank', color: '#16a34a' },
  { name: 'TPBank', bankName: 'TPBank', color: '#9333ea' },
];

const PRESET_EWALLETS = [
  { name: 'Ví MoMo', color: '#d946ef' },
  { name: 'Ví ZaloPay', color: '#0284c7' },
  { name: 'Viettel Money', color: '#e11d48' },
  { name: 'ShopeePay', color: '#ea580c' },
];

const COLOR_OPTIONS = [
  '#10b981', // Emerald
  '#059669', // Dark Green
  '#2563eb', // Royal Blue
  '#0284c7', // Sky Blue
  '#dc2626', // Red
  '#ea580c', // Orange
  '#d946ef', // Pink/Magenta
  '#9333ea', // Purple
  '#0d9488', // Teal
  '#475569', // Slate
];

export const AddAssetModal: React.FC = () => {
  const { isAddAssetModalOpen, setIsAddAssetModalOpen, addWallet } = useApp();

  const [assetType, setAssetType] = useState<WalletType['type']>('bank');
  const [name, setName] = useState('MB Bank Chi tiêu');
  const [bankName, setBankName] = useState('MB Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState<number>(5000000);
  const [color, setColor] = useState('#2563eb');
  const [notes, setNotes] = useState('');
  const [createdNotice, setCreatedNotice] = useState(false);

  if (!isAddAssetModalOpen) return null;

  const handleSelectType = (type: WalletType['type']) => {
    setAssetType(type);
    if (type === 'cash') {
      setName('Ví Tiền Mặt Dự Phòng');
      setColor('#10b981');
      setBankName('');
      setAccountNumber('');
    } else if (type === 'bank') {
      setName('Tài khoản Ngân hàng mới');
      setColor('#2563eb');
      setBankName('Vietcombank');
    } else if (type === 'e-wallet') {
      setName('Ví Điện Tử ZaloPay');
      setColor('#0284c7');
      setBankName('');
      setAccountNumber('');
    } else if (type === 'savings') {
      setName('Quỹ Tiết Kiệm Dự Phòng');
      setColor('#0d9488');
      setBankName('');
      setAccountNumber('');
    }
  };

  const handleApplyPresetBank = (preset: PresetBank) => {
    setName(`${preset.name} Chi tiêu`);
    setBankName(preset.bankName);
    setColor(preset.color);
  };

  const handleApplyPresetEWallet = (preset: { name: string; color: string }) => {
    setName(preset.name);
    setColor(preset.color);
  };

  const handleAddQuickBalance = (amount: number) => {
    setBalance((prev) => prev + amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addWallet({
      name: name.trim(),
      type: assetType,
      balance: Math.max(0, balance),
      color: color,
      bankName: assetType === 'bank' ? bankName : undefined,
      accountNumber: accountNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setCreatedNotice(true);
    setTimeout(() => {
      setCreatedNotice(false);
      setIsAddAssetModalOpen(false);
      // Reset form
      setName('Tài khoản mới');
      setBalance(5000000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xs max-w-lg w-full max-h-[90dvh] flex flex-col border border-[#DDD6C8] shadow-2xl overflow-hidden text-[#191715]">
        {/* Header */}
        <div className="p-4 bg-[#191715] text-[#FAF8F5] flex items-center justify-between border-b border-[#2C2824] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xs bg-[#2C2824] flex items-center justify-center text-red-500">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-white">
                Thêm Tài Sản Khả Dụng Mới
              </h3>
              <p className="text-[10px] font-mono text-[#9C9488]">
                Kết nối ví tiền mặt, tài khoản ngân hàng hoặc quỹ tiết kiệm
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddAssetModalOpen(false)}
            className="text-[#9C9488] hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Step 1: Asset Type Selection with Logical Cards */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7A7365] mb-2 font-bold">
              1. Chọn phân loại tài sản:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSelectType('cash')}
                className={`p-2.5 rounded-xs border text-center transition-all cursor-pointer ${
                  assetType === 'cash'
                    ? 'border-[#191715] bg-[#F7F5EE] ring-1 ring-[#191715]'
                    : 'border-[#DDD6C8] hover:border-[#BDB39E] bg-[#FAF8F5]'
                }`}
              >
                <Banknote className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                <div className="text-xs font-sans font-bold text-[#191715]">Tiền Mặt</div>
                <div className="text-[9px] font-mono text-[#7A7365]">Ví ví giấy / két</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectType('bank')}
                className={`p-2.5 rounded-xs border text-center transition-all cursor-pointer ${
                  assetType === 'bank'
                    ? 'border-[#191715] bg-[#F7F5EE] ring-1 ring-[#191715]'
                    : 'border-[#DDD6C8] hover:border-[#BDB39E] bg-[#FAF8F5]'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                <div className="text-xs font-sans font-bold text-[#191715]">Ngân Hàng</div>
                <div className="text-[9px] font-mono text-[#7A7365]">Thẻ & tài khoản</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectType('e-wallet')}
                className={`p-2.5 rounded-xs border text-center transition-all cursor-pointer ${
                  assetType === 'e-wallet'
                    ? 'border-[#191715] bg-[#F7F5EE] ring-1 ring-[#191715]'
                    : 'border-[#DDD6C8] hover:border-[#BDB39E] bg-[#FAF8F5]'
                }`}
              >
                <Smartphone className="w-4 h-4 mx-auto text-pink-600 mb-1" />
                <div className="text-xs font-sans font-bold text-[#191715]">Ví Điện Tử</div>
                <div className="text-[9px] font-mono text-[#7A7365]">MoMo, ZaloPay...</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectType('savings')}
                className={`p-2.5 rounded-xs border text-center transition-all cursor-pointer ${
                  assetType === 'savings'
                    ? 'border-[#191715] bg-[#F7F5EE] ring-1 ring-[#191715]'
                    : 'border-[#DDD6C8] hover:border-[#BDB39E] bg-[#FAF8F5]'
                }`}
              >
                <PiggyBank className="w-4 h-4 mx-auto text-teal-600 mb-1" />
                <div className="text-xs font-sans font-bold text-[#191715]">Tiết Kiệm</div>
                <div className="text-[9px] font-mono text-[#7A7365]">Quỹ dự phòng</div>
              </button>
            </div>
          </div>

          {/* Quick Preset Selector for Banks and E-wallets */}
          {assetType === 'bank' && (
            <div>
              <span className="block text-[10px] font-mono uppercase text-[#7A7365] mb-1.5">
                Gợi ý nhanh ngân hàng phổ biến:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_BANKS.map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => handleApplyPresetBank(b)}
                    className="px-2 py-0.5 rounded-xs text-[11px] font-mono bg-[#FAF8F5] hover:bg-[#EFECE4] border border-[#DDD6C8] text-[#191715] transition-colors cursor-pointer"
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {assetType === 'e-wallet' && (
            <div>
              <span className="block text-[10px] font-mono uppercase text-[#7A7365] mb-1.5">
                Gợi ý nhanh ví điện tử:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_EWALLETS.map((w) => (
                  <button
                    key={w.name}
                    type="button"
                    onClick={() => handleApplyPresetEWallet(w)}
                    className="px-2 py-0.5 rounded-xs text-[11px] font-mono bg-[#FAF8F5] hover:bg-[#EFECE4] border border-[#DDD6C8] text-[#191715] transition-colors cursor-pointer"
                  >
                    {w.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Information Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7A7365] mb-1 font-bold">
                Tên tài sản / nguồn tiền *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: MB Bank Lương, Tiền mặt..."
                className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded-xs p-2 text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#191715]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7A7365] mb-1 font-bold">
                Số tài khoản / Số thẻ (Tùy chọn)
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="VD: 1903****1234"
                className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded-xs p-2 text-xs font-mono focus:bg-white focus:outline-none focus:border-[#191715]"
              />
            </div>
          </div>

          {/* Balance Input with Quick Chips */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#7A7365] font-bold">
                Số dư khả dụng ban đầu (VNĐ) *
              </label>
              <span className="text-[10px] font-mono text-[#8C8477]">
                Tự động tính vào tổng tài sản
              </span>
            </div>
            <div className="relative flex items-center">
              <input
                type="number"
                min="0"
                step="50000"
                value={balance}
                onChange={(e) => setBalance(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded-xs p-2.5 text-base font-sans font-bold text-[#191715] tabular-nums focus:bg-white focus:outline-none focus:border-[#191715]"
              />
              <span className="absolute right-3 font-mono text-xs font-bold text-red-600">
                ₫
              </span>
            </div>

            {/* Quick Balance Buttons */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[11px] font-mono">
              <span className="text-[10px] text-[#7A7365]">Cộng nhanh:</span>
              {[1000000, 2000000, 5000000, 10000000, 20000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAddQuickBalance(amt)}
                  className="px-2 py-0.5 rounded-xs bg-[#FAF8F5] hover:bg-[#EFECE4] border border-[#DDD6C8] text-[#191715] cursor-pointer"
                >
                  +{amt >= 1000000 ? `${amt / 1000000}Tr` : amt.toLocaleString()}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setBalance(0)}
                className="px-2 py-0.5 rounded-xs bg-[#FAF8F5] hover:bg-red-50 text-red-700 border border-[#DDD6C8] cursor-pointer"
              >
                Đặt về 0
              </button>
            </div>
          </div>

          {/* Color Tag Selection */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7A7365] mb-1.5 font-bold">
              Màu nhận diện tài sản:
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer border ${
                    color === c ? 'scale-125 border-[#191715] ring-2 ring-black/20' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Live Card Preview */}
          <div className="p-3 bg-[#FAF8F5] border border-[#E0D9CB] rounded-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <div>
                <div className="font-sans font-bold text-xs text-[#191715]">
                  {name || 'Tài khoản chưa đặt tên'}
                </div>
                <div className="text-[10px] font-mono text-[#7A7365]">
                  {assetType === 'cash'
                    ? 'Tiền mặt'
                    : assetType === 'bank'
                    ? `${bankName || 'Ngân hàng'} ${accountNumber ? `· ${accountNumber}` : ''}`
                    : assetType === 'e-wallet'
                    ? 'Ví điện tử'
                    : 'Quỹ tiết kiệm'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#191715] tabular-nums">
                {balance.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </div>

          {/* Success notice */}
          {createdNotice && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xs text-xs text-emerald-800 font-mono flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>ĐÃ THÊM TÀI SẢN MỚI THÀNH CÔNG VÀO SỔ CÁI!</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddAssetModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-[#524B40] hover:text-[#191715] bg-[#EFECE4] hover:bg-[#E5E0D5] rounded-xs border border-[#DDD6C8] transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-sans font-bold text-white bg-[#191715] hover:bg-[#2B2723] rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tạo Tài Sản Mới</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
