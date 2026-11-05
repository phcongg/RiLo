import React, { useState } from 'react';
import { X, Plus, Calendar, Tag, WalletCards, Building } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ExpenseCategory } from '../types';

interface ManualTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualTransactionModal: React.FC<ManualTransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { wallets, addTransaction } = useApp();

  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState<number>(50000);
  const [category, setCategory] = useState<ExpenseCategory>('Ăn uống');
  const [walletId, setWalletId] = useState(wallets[0]?.id || 'w-cash');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim() || amount <= 0) return;

    addTransaction({
      merchant: merchant.trim(),
      amount,
      category,
      walletId,
      date,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141210]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] rounded-xs max-w-md w-full max-h-[90dvh] flex flex-col border border-[#DDD6C8] shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-[#E8E2D5] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base text-[#191715]">Ghi Chép Chứng Từ Mới</span>
            <span className="stamp-seal px-1.5 py-0.2 text-[8px] font-bold">THỦ CÔNG</span>
          </div>
          <button onClick={onClose} className="p-1 text-[#8C8477] hover:text-[#191715] rounded-xs cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs font-mono overflow-y-auto flex-1">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B6457] mb-1">
              Tên Địa Điểm / Đơn Vị Thu Nhận
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Cơm trưa văn phòng, Tiệm tạp hóa..."
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full bg-white border border-[#DDD6C8] rounded-xs px-3 py-2 text-xs font-serif font-bold text-[#191715] focus:outline-none focus:border-[#191715]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B6457] mb-1">
              Số Tiền Chi (VNĐ)
            </label>
            <input
              type="number"
              required
              step="5000"
              min="1000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-white border border-[#DDD6C8] rounded-xs px-3 py-2 font-mono text-[#191715] text-base font-bold focus:outline-none focus:border-[#191715] tabular-nums"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B6457] mb-1">
                Danh Mục Kế Toán
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-white border border-[#DDD6C8] rounded-xs px-3 py-2 text-xs text-[#2A2621] focus:outline-none focus:border-[#191715]"
              >
                <option value="Ăn uống">Ăn uống & Cà phê</option>
                <option value="Mua sắm">Mua sắm & Tiêu dùng</option>
                <option value="Di chuyển">Di chuyển & Xăng xe</option>
                <option value="Hóa đơn & Tiện ích">Hóa đơn & Điện nước</option>
                <option value="Sức khỏe">Y tế & Sức khỏe</option>
                <option value="Giải trí">Giải trí & Du lịch</option>
                <option value="Khác">Khoản chi khác</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B6457] mb-1">
                Nguồn Ví Thanh Toán
              </label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full bg-white border border-[#DDD6C8] rounded-xs px-3 py-2 text-xs text-[#2A2621] focus:outline-none focus:border-[#191715]"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B6457] mb-1">
              Ngày Ghi Nhận
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border border-[#DDD6C8] rounded-xs px-3 py-2 font-mono text-xs text-[#2A2621] focus:outline-none focus:border-[#191715]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6B6457] mb-1">
              Ghi Chú Diễn Giải
            </label>
            <input
              type="text"
              placeholder="Chi tiết nội dung chi tiêu..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-[#DDD6C8] rounded-xs px-3 py-2 text-xs text-[#2A2621] focus:outline-none focus:border-[#191715]"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#EAE5DA]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-[#7A7365] hover:text-[#191715] font-semibold text-xs cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#191715] hover:bg-[#2B2723] text-[#FAF8F5] font-semibold text-xs rounded-xs shadow-xs transition-colors cursor-pointer"
            >
              Lưu Vào Sổ Cái
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
