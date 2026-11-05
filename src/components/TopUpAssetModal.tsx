import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Check, X, Wallet, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TopUpAssetModal: React.FC = () => {
  const {
    wallets,
    isTopUpModalOpen,
    setIsTopUpModalOpen,
    targetWalletForAction,
    topUpWallet,
  } = useApp();

  const [selectedWalletId, setSelectedWalletId] = useState<string>('');
  const [amount, setAmount] = useState<number>(2000000);
  const [note, setNote] = useState<string>('Nạp thu nhập định kỳ');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (targetWalletForAction) {
      setSelectedWalletId(targetWalletForAction.id);
    } else if (wallets.length > 0) {
      setSelectedWalletId(wallets[0].id);
    }
  }, [targetWalletForAction, wallets]);

  if (!isTopUpModalOpen) return null;

  const currentWallet = wallets.find((w) => w.id === selectedWalletId) || wallets[0];
  const currentBalance = currentWallet ? currentWallet.balance : 0;
  const newBalance = currentBalance + (amount || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWallet || amount <= 0) return;

    topUpWallet(currentWallet.id, amount, note);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsTopUpModalOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xs max-w-md w-full max-h-[90dvh] flex flex-col border border-[#DDD6C8] shadow-2xl overflow-hidden text-[#191715]">
        {/* Header */}
        <div className="p-4 bg-[#191715] text-[#FAF8F5] flex items-center justify-between border-b border-[#2C2824] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xs bg-[#2C2824] flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-white">
                Nạp Thêm Tiền Vào Tài Sản
              </h3>
              <p className="text-[10px] font-mono text-[#9C9488]">
                Ghi nhận thu nhập & tăng số dư khả dụng
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTopUpModalOpen(false)}
            className="text-[#9C9488] hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto flex-1">
          {/* Wallet Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7A7365] mb-1 font-bold">
              Chọn tài sản / ví nhận tiền:
            </label>
            <select
              value={selectedWalletId}
              onChange={(e) => setSelectedWalletId(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded-xs p-2.5 font-medium text-xs text-[#191715] focus:bg-white focus:outline-none focus:border-[#191715]"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} — [Số dư hiện tại: {w.balance.toLocaleString('vi-VN')} ₫]
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7A7365] mb-1 font-bold">
              Số tiền nạp thêm (VNĐ) *
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                min="10000"
                step="50000"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded-xs p-2.5 text-base font-sans font-bold text-emerald-800 tabular-nums focus:bg-white focus:outline-none focus:border-[#191715]"
              />
              <span className="absolute right-3 font-mono text-xs font-bold text-emerald-700">
                ₫
              </span>
            </div>

            {/* Quick Chips */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap font-mono text-[11px]">
              <span className="text-[10px] text-[#7A7365]">Nhanh:</span>
              {[500000, 1000000, 2000000, 5000000, 10000000, 20000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`px-2 py-0.5 rounded-xs border cursor-pointer ${
                    amount === val
                      ? 'bg-[#191715] text-white border-[#191715]'
                      : 'bg-[#FAF8F5] hover:bg-[#EFECE4] border-[#DDD6C8] text-[#191715]'
                  }`}
                >
                  +{val >= 1000000 ? `${val / 1000000}Tr` : `${val / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* Reason / Note */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7A7365] mb-1 font-bold">
              Nguồn tiền / Ghi chú thu nhập:
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Nhận lương tháng 10, Thu hồi nợ, Rút tiền ATM..."
              className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded-xs p-2 text-xs focus:bg-white focus:outline-none focus:border-[#191715]"
            />
          </div>

          {/* Calculation Live Preview */}
          <div className="p-3 bg-[#FAF8F5] border border-[#E0D9CB] rounded-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#7A7365] block uppercase">
                Số dư hiện tại
              </span>
              <span className="font-mono text-xs text-[#191715] tabular-nums">
                {currentBalance.toLocaleString('vi-VN')} ₫
              </span>
            </div>
            <div className="text-center font-bold text-emerald-600 font-mono text-sm">
              + {amount.toLocaleString('vi-VN')} ₫
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#7A7365] block uppercase">
                Số dư sau nạp
              </span>
              <span className="font-sans font-bold text-sm text-emerald-800 tabular-nums">
                {newBalance.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </div>

          {/* Success notice */}
          {success && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xs text-xs text-emerald-800 font-mono flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>ĐÃ NẠP THÀNH CÔNG VÀO TÀI SẢN!</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsTopUpModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-[#524B40] hover:text-[#191715] bg-[#EFECE4] hover:bg-[#E5E0D5] rounded-xs border border-[#DDD6C8] transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-sans font-bold text-white bg-[#191715] hover:bg-[#2B2723] rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>Xác Nhận Nạp Tiền</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
