import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, Check, X, ShieldAlert, Sparkles, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ResetAssetModal: React.FC = () => {
  const {
    wallets,
    isResetModalOpen,
    setIsResetModalOpen,
    resetAllBalances,
    resetWalletsToDefault,
    setWalletBalance,
  } = useApp();

  const [mode, setMode] = useState<'zero' | 'default' | 'custom'>('default');
  const [customBalances, setCustomBalances] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    wallets.forEach((w) => {
      init[w.id] = w.balance;
    });
    return init;
  });
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isResetModalOpen) return null;

  const currentTotal = wallets.reduce((s, w) => s + w.balance, 0);

  const calculateTargetTotal = () => {
    if (mode === 'zero') return 0;
    if (mode === 'default') return 66800000;
    return Object.values(customBalances).reduce((s, v) => s + (v || 0), 0);
  };

  const targetTotal = calculateTargetTotal();

  const handleApplyReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'zero') {
      resetAllBalances(0);
    } else if (mode === 'default') {
      resetWalletsToDefault();
    } else {
      wallets.forEach((w) => {
        const val = customBalances[w.id] ?? w.balance;
        setWalletBalance(w.id, val);
      });
    }

    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      setIsResetModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xs max-w-lg w-full max-h-[90dvh] flex flex-col border border-[#DDD6C8] shadow-2xl overflow-hidden text-[#191715]">
        {/* Header */}
        <div className="p-4 bg-[#191715] text-[#FAF8F5] flex items-center justify-between border-b border-[#2C2824] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xs bg-[#2C2824] flex items-center justify-center text-red-500">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-white">
                Cài Đặt Lại Tài Sản Khả Dụng
              </h3>
              <p className="text-[10px] font-mono text-[#9C9488]">
                Đặt lại số dư nguồn tiền & điều chỉnh kế toán
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsResetModalOpen(false)}
            className="text-[#9C9488] hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleApplyReset} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Mode Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7A7365] mb-2 font-bold">
              Chọn phương thức đặt lại số dư:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMode('default')}
                className={`p-3 rounded-xs border text-left transition-all cursor-pointer ${
                  mode === 'default'
                    ? 'border-[#191715] bg-[#F7F5EE] ring-1 ring-[#191715]'
                    : 'border-[#DDD6C8] hover:border-[#BDB39E] bg-[#FAF8F5]'
                }`}
              >
                <div className="text-xs font-sans font-bold text-[#191715]">
                  Định Mức Ban Đầu
                </div>
                <div className="text-[10px] font-mono text-[#7A7365] mt-0.5">
                  66.800.000 ₫
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('zero')}
                className={`p-3 rounded-xs border text-left transition-all cursor-pointer ${
                  mode === 'zero'
                    ? 'border-red-600 bg-red-50/50 ring-1 ring-red-600'
                    : 'border-[#DDD6C8] hover:border-[#BDB39E] bg-[#FAF8F5]'
                }`}
              >
                <div className="text-xs font-sans font-bold text-red-700">
                  Đặt Về 0 ₫
                </div>
                <div className="text-[10px] font-mono text-[#7A7365] mt-0.5">
                  Xóa sạch số dư
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('custom')}
                className={`p-3 rounded-xs border text-left transition-all cursor-pointer ${
                  mode === 'custom'
                    ? 'border-[#191715] bg-[#F7F5EE] ring-1 ring-[#191715]'
                    : 'border-[#DDD6C8] hover:border-[#BDB39E] bg-[#FAF8F5]'
                }`}
              >
                <div className="text-xs font-sans font-bold text-[#191715]">
                  Tự Điền Số Dư
                </div>
                <div className="text-[10px] font-mono text-[#7A7365] mt-0.5">
                  Tùy chỉnh từng ví
                </div>
              </button>
            </div>
          </div>

          {/* Mode-specific detail / fields */}
          {mode === 'custom' ? (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 border border-[#DDD6C8] rounded-xs p-3 bg-[#FAF8F5]">
              <div className="text-[10px] font-mono uppercase text-[#7A7365] font-bold">
                Điền số dư mong muốn cho từng tài sản:
              </div>
              {wallets.map((w) => (
                <div key={w.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: w.color }} />
                    <span className="font-medium text-[#191715] truncate">{w.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      min="0"
                      step="50000"
                      value={customBalances[w.id] ?? w.balance}
                      onChange={(e) =>
                        setCustomBalances({
                          ...customBalances,
                          [w.id]: Math.max(0, parseInt(e.target.value, 10) || 0),
                        })
                      }
                      className="w-32 bg-white border border-[#DDD6C8] rounded-xs p-1.5 text-right font-mono font-bold text-xs"
                    />
                    <span className="text-xs font-mono text-[#7A7365]">₫</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-[#FAF8F5] border border-[#E0D9CB] rounded-xs text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-[#191715]">
                {mode === 'zero' ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    <span>Lưu ý: Toàn bộ số dư của {wallets.length} nguồn tiền sẽ đưa về 0 ₫.</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Khôi phục các tài sản về mức định mức khả dụng ban đầu.</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#7A7365] leading-relaxed">
                {mode === 'zero'
                  ? 'Chứng từ hóa đơn chi tiêu đã quét sẽ không bị xóa, bạn có thể nạp thêm tiền bất cứ lúc nào.'
                  : 'Tiền mặt: 2.450.000 ₫ | Techcombank: 18.650.000 ₫ | MoMo: 3.200.000 ₫ | Vietcombank: 42.500.000 ₫.'}
              </p>
            </div>
          )}

          {/* Comparison summary card */}
          <div className="p-3.5 bg-[#F2EFE8] rounded-xs border border-[#DDD6C8] flex items-center justify-between text-xs">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#7A7365] block">
                Tổng tài sản hiện tại
              </span>
              <span className="font-sans font-bold text-[#191715] text-base tabular-nums">
                {currentTotal.toLocaleString('vi-VN')} ₫
              </span>
            </div>

            <div className="text-right">
              <span className="font-mono text-[10px] uppercase text-[#7A7365] block">
                Sau khi đặt lại
              </span>
              <span
                className={`font-sans font-bold text-base tabular-nums ${
                  targetTotal === 0 ? 'text-red-600' : 'text-emerald-700'
                }`}
              >
                {targetTotal.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </div>

          {/* Success feedback */}
          {successNotice && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xs text-xs text-emerald-800 font-mono flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>ĐÃ CẬP NHẬT LẠI TỔNG TÀI SẢN KHẢ DỤNG THÀNH CÔNG!</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsResetModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-[#524B40] hover:text-[#191715] bg-[#EFECE4] hover:bg-[#E5E0D5] rounded-xs border border-[#DDD6C8] transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-sans font-bold text-white bg-[#191715] hover:bg-[#2B2723] rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-500" />
              <span>Xác Nhận Đặt Lại</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
