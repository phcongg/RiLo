import React, { useMemo, useState } from 'react';
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Search,
  Download,
  Trash2,
  Plus,
  Eye,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ExpenseCategory, Transaction, Wallet as WalletType } from '../types';

interface UnifiedExpensesViewProps {
  onOpenManualModal: () => void;
}

export const UnifiedExpensesView: React.FC<UnifiedExpensesViewProps> = ({ onOpenManualModal }) => {
  const {
    transactions,
    wallets,
    budgets,
    deleteTransaction,
    transferFunds,
    updateBudget,
    deleteWallet,
    setIsResetModalOpen,
    setIsAddAssetModalOpen,
    openTopUpModal,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWallet, setSelectedWallet] = useState<string>('all');
  const [viewingTx, setViewingTx] = useState<Transaction | null>(null);

  // Quick transfer modal/inline
  const [showTransfer, setShowTransfer] = useState(false);
  const [fromWalletId, setFromWalletId] = useState(wallets[0]?.id || '');
  const [toWalletId, setToWalletId] = useState(wallets[1]?.id || '');
  const [transferAmount, setTransferAmount] = useState(200000);
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Total metrics
  const totalBalance = useMemo(
    () => wallets.reduce((acc, w) => acc + w.balance, 0),
    [wallets]
  );

  const totalExpense = useMemo(
    () => transactions.reduce((acc, t) => acc + t.amount, 0),
    [transactions]
  );

  const totalBudgetLimit = useMemo(
    () => Object.values(budgets).reduce((acc, b) => acc + b, 0),
    [budgets]
  );

  const budgetPercent = totalBudgetLimit > 0
    ? Math.round((totalExpense / totalBudgetLimit) * 100)
    : 0;

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.items?.some((it) => it.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tx.notes?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === 'all' || tx.category === selectedCategory;
      const matchWallet = selectedWallet === 'all' || tx.walletId === selectedWallet;

      return matchSearch && matchCategory && matchWallet;
    });
  }, [transactions, searchQuery, selectedCategory, selectedWallet]);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromWalletId === toWalletId) {
      alert('Vui lòng chọn 2 ví khác nhau');
      return;
    }
    const ok = transferFunds(fromWalletId, toWalletId, transferAmount);
    if (ok) {
      setTransferSuccess(true);
      setTimeout(() => setTransferSuccess(false), 2500);
    } else {
      alert('Số dư ví gửi không đủ tiền!');
    }
  };

  const handleExportCsv = () => {
    const headers = ['Mã GD', 'Ngày', 'Đơn vị', 'Danh mục', 'Số tiền (VNĐ)', 'Ví thanh toán'];
    const rows = filteredTransactions.map((tx) => {
      const wallet = wallets.find((w) => w.id === tx.walletId);
      return [
        tx.id,
        tx.date,
        `"${tx.merchant.replace(/"/g, '""')}"`,
        tx.category,
        tx.amount,
        wallet?.name || '',
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `chi_tieu_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="p-3.5 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* 3 Physical Ledger Metric Slips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Tổng số dư ví */}
        <div className="bg-white rounded-xs p-4 border border-[#DDD6C8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7A7365]">
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Tổng Tài Sản Khả Dụng</span>
            <div className="w-6 h-6 rounded-xs bg-[#F4F1E8] text-[#191715] flex items-center justify-center border border-[#DDD6C8]">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-sans font-bold text-[#191715] tabular-nums">
            {totalBalance.toLocaleString('vi-VN')} <span className="text-xs font-mono font-bold text-red-600">₫</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#EFECE4] flex items-center justify-between text-[11px] font-mono">
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="text-[#8C8477] hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors"
              title="Đặt lại số dư về 0 hoặc định mức"
            >
              <RotateCcw className="w-3 h-3 text-red-500" />
              <span>Cài lại số dư</span>
            </button>
            <button
              onClick={() => openTopUpModal()}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              title="Nạp thêm tiền vào tài sản"
            >
              <Plus className="w-3 h-3" />
              <span>Nạp tiền</span>
            </button>
          </div>
        </div>

        {/* Card 2: Tổng chi tiêu */}
        <div className="bg-white rounded-xs p-4 border border-[#DDD6C8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7A7365]">
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Tổng Chi Kỳ Này</span>
            <div className="w-6 h-6 rounded-xs bg-[#FDF0EE] text-red-700 flex items-center justify-center border border-red-200">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-sans font-bold text-[#191715] tabular-nums">
            {totalExpense.toLocaleString('vi-VN')} <span className="text-xs font-mono font-bold text-[#7A7365]">₫</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-[#8C8477]">
            {transactions.length} chứng từ đã hạch toán
          </div>
        </div>

        {/* Card 3: Ngân sách */}
        <div className="bg-white rounded-xs p-4 border border-[#DDD6C8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7A7365]">
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Định Mức Chi Tiêu</span>
            <div className="w-6 h-6 rounded-xs bg-[#F4F1E8] text-[#191715] flex items-center justify-center border border-[#DDD6C8]">
              <PiggyBank className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-sans font-bold text-[#191715] tabular-nums">
              {budgetPercent}%
            </span>
            <span className="text-xs font-mono text-[#7A7365]">
              Hạn mức {totalBudgetLimit.toLocaleString('vi-VN')} ₫
            </span>
          </div>
          <div className="w-full bg-[#EAE5DA] h-1.5 rounded-xs mt-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                budgetPercent > 100 ? 'bg-red-600' : budgetPercent > 80 ? 'bg-amber-600' : 'bg-[#191715]'
              }`}
              style={{ width: `${Math.min(100, budgetPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Wallets Passbook Strip */}
      <div className="bg-white rounded-xs p-4 border border-[#DDD6C8] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 pb-2.5 border-b border-[#EFECE4] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[#191715] uppercase tracking-wider text-[11px]">
              Sổ Quản Lý Nguồn Tiền
            </span>
            <span className="text-[10px] font-mono bg-[#FAF8F5] text-[#7A7365] px-1.5 py-0.5 rounded-xs border border-[#DDD6C8]">
              {wallets.length} tài sản
            </span>
            {selectedWallet !== 'all' && (
              <button
                onClick={() => setSelectedWallet('all')}
                className="text-[10px] font-mono text-red-600 hover:underline cursor-pointer"
              >
                (Hủy lọc ví)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddAssetModalOpen(true)}
              className="px-2.5 py-1 bg-[#191715] hover:bg-[#2B2723] text-white text-[11px] font-sans font-bold rounded-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3 text-emerald-400" />
              <span>+ Thêm Tài Sản</span>
            </button>

            <button
              onClick={() => setIsResetModalOpen(true)}
              className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#EFECE4] text-[#191715] text-[11px] font-mono border border-[#DDD6C8] rounded-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Cài đặt lại số dư khả dụng"
            >
              <RotateCcw className="w-3 h-3 text-red-500" />
              <span>Cài Lại</span>
            </button>

            <button
              onClick={() => setShowTransfer(!showTransfer)}
              className={`px-2.5 py-1 text-[11px] font-mono border rounded-xs flex items-center gap-1 transition-colors cursor-pointer ${
                showTransfer
                  ? 'bg-[#191715] text-white border-[#191715]'
                  : 'bg-[#FAF8F5] hover:bg-[#EFECE4] text-[#191715] border-[#DDD6C8]'
              }`}
            >
              <ArrowRightLeft className="w-3 h-3 text-[#7A7365]" />
              <span>Chuyển Khoản</span>
            </button>
          </div>
        </div>

        {/* Wallets Grid with Dashed Add Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {wallets.map((w) => {
            const isSelected = selectedWallet === w.id;
            const getIcon = () => {
              if (w.type === 'cash') return <Banknote className="w-3.5 h-3.5 text-emerald-600" />;
              if (w.type === 'bank') return <CreditCard className="w-3.5 h-3.5 text-blue-600" />;
              if (w.type === 'e-wallet') return <Smartphone className="w-3.5 h-3.5 text-pink-600" />;
              return <PiggyBank className="w-3.5 h-3.5 text-teal-600" />;
            };

            return (
              <div
                key={w.id}
                className={`p-3 rounded-xs border text-left transition-all relative ${
                  isSelected
                    ? 'border-[#191715] bg-[#F7F5EE] ring-1 ring-[#191715]'
                    : 'border-[#E0D9CB] hover:border-[#BDB39E] bg-[#FAF8F5]'
                }`}
              >
                <div
                  onClick={() => setSelectedWallet(isSelected ? 'all' : w.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#7A7365] mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      {getIcon()}
                      <span className="font-bold text-[#191715] truncate" title={w.name}>
                        {w.name}
                      </span>
                    </div>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: w.color }} />
                  </div>

                  {w.accountNumber && (
                    <div className="text-[10px] font-mono text-[#8C8477] truncate mb-1">
                      {w.accountNumber}
                    </div>
                  )}

                  <div className="mt-1 text-sm font-sans font-bold text-[#191715] tabular-nums">
                    {w.balance.toLocaleString('vi-VN')} <span className="font-mono text-xs text-[#7A7365]">₫</span>
                  </div>
                </div>

                {/* Card Quick Action Buttons */}
                <div className="mt-2 pt-2 border-t border-[#EAE5DA] flex items-center justify-between text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openTopUpModal(w);
                    }}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-0.5 cursor-pointer"
                    title="Nạp thêm tiền vào ví này"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    <span>Nạp tiền</span>
                  </button>

                  {wallets.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Bạn có chắc muốn xóa nguồn tài sản "${w.name}"? Các chứng từ liên quan sẽ được chuyển sang ví còn lại.`)) {
                          deleteWallet(w.id);
                        }
                      }}
                      className="text-[#B5AC9E] hover:text-red-600 transition-colors cursor-pointer p-0.5"
                      title="Xóa nguồn tài sản này"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Dashed Add New Asset Card */}
          <button
            type="button"
            onClick={() => setIsAddAssetModalOpen(true)}
            className="p-3 rounded-xs border border-dashed border-[#C7BFAD] hover:border-[#191715] bg-[#FAF8F5]/60 hover:bg-[#F2EFE8] text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer min-h-[96px] group"
          >
            <div className="w-6 h-6 rounded-full bg-[#EAE5DA] group-hover:bg-[#191715] group-hover:text-white text-[#524B40] flex items-center justify-center transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-sans font-bold text-[#191715]">+ Thêm Tài Sản</span>
            <span className="text-[10px] font-mono text-[#8C8477]">Ngân hàng, ví, tiền mặt</span>
          </button>
        </div>

        {/* Transfer Funds inline accordion */}
        {showTransfer && (
          <form
            onSubmit={handleTransfer}
            className="mt-4 pt-3 border-t border-[#EAE5DA] grid grid-cols-1 sm:grid-cols-4 gap-3 items-end text-xs font-mono"
          >
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#6B6457] mb-1">Ví chuyển:</label>
              <select
                value={fromWalletId}
                onChange={(e) => setFromWalletId(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded-xs p-2 text-xs"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.balance.toLocaleString('vi-VN')} ₫)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#6B6457] mb-1">Ví nhận:</label>
              <select
                value={toWalletId}
                onChange={(e) => setToWalletId(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded-xs p-2 text-xs"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.balance.toLocaleString('vi-VN')} ₫)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#6B6457] mb-1">Số tiền (VNĐ):</label>
              <input
                type="number"
                step="50000"
                min="10000"
                value={transferAmount}
                onChange={(e) => setTransferAmount(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#DDD6C8] rounded-xs p-2 font-mono text-xs"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 bg-[#191715] hover:bg-[#2B2723] text-[#FAF8F5] font-semibold rounded-xs text-xs cursor-pointer"
              >
                Chuyển ngay
              </button>
            </div>
          </form>
        )}

        {transferSuccess && (
          <div className="mt-2 text-xs font-mono text-emerald-800 bg-[#EEF8F2] p-2 rounded-xs border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>ĐÃ HOÀN TẤT CHUYỂN TIỀN NỘI BỘ!</span>
          </div>
        )}
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-xs border border-[#DDD6C8] shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 border-b border-[#DDD6C8] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-sans font-bold text-base text-[#191715]">Nhật Ký Chứng Từ Thu Chi</h2>
            <span className="text-[11px] text-[#8C8477] font-mono">
              [{filteredTransactions.length} mục]
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <Search className="w-3.5 h-3.5 text-[#9E9688] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm món, quán..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1.5 bg-[#FAF8F5] border border-[#DDD6C8] rounded-xs w-full sm:w-44 sm:focus:w-56 transition-all focus:bg-white focus:outline-none text-xs"
              />
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#FAF8F5] border border-[#DDD6C8] rounded-xs px-2.5 py-1.5 text-[#2A2621] focus:outline-none text-xs"
            >
              <option value="all">Mọi danh mục</option>
              <option value="Ăn uống">Ăn uống</option>
              <option value="Mua sắm">Mua sắm</option>
              <option value="Di chuyển">Di chuyển</option>
              <option value="Hóa đơn & Tiện ích">Hóa đơn</option>
              <option value="Sức khỏe">Sức khỏe</option>
              <option value="Giải trí">Giải trí</option>
              <option value="Khác">Khác</option>
            </select>

            <button
              onClick={handleExportCsv}
              className="px-2.5 py-1.5 text-[#2A2621] hover:bg-[#F4F1E8] border border-[#DDD6C8] rounded-xs flex items-center gap-1 cursor-pointer"
              title="Xuất file CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#7A7365]" />
              <span>Xuất CSV</span>
            </button>

            <button
              onClick={onOpenManualModal}
              className="px-3 py-1.5 bg-[#191715] hover:bg-[#2B2723] text-[#FAF8F5] font-semibold rounded-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ghi chép</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#F4F1E8] border-b border-[#DDD6C8] text-[#696256] font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4 text-left">Đơn Vị & Diễn Giải</th>
                <th className="py-2.5 px-4 text-left">Danh Mục</th>
                <th className="py-2.5 px-4 text-left">Ngày Ghi</th>
                <th className="py-2.5 px-4 text-left">Tài Khoản Ví</th>
                <th className="py-2.5 px-4 text-right">Số Tiền (VNĐ)</th>
                <th className="py-2.5 px-4 text-center w-20">Chứng Từ</th>
                <th className="py-2.5 px-4 text-center w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE5DA]">
              {filteredTransactions.map((tx) => {
                const wallet = wallets.find((w) => w.id === tx.walletId);
                return (
                  <tr key={tx.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="font-sans font-semibold text-[#191715] text-xs">{tx.merchant}</div>
                      {tx.items && tx.items.length > 0 && (
                        <div className="text-[11px] text-[#8C8477] truncate max-w-xs font-mono">
                          {tx.items.map((i) => i.name).join(', ')}
                        </div>
                      )}
                    </td>

                    <td className="py-2.5 px-4 text-[#3D3831] font-mono text-[11px]">{tx.category}</td>

                    <td className="py-2.5 px-4 font-mono text-[#8C8477] text-[11px]">{tx.date}</td>

                    <td className="py-2.5 px-4 text-[#4A443B] font-medium">{wallet?.name || 'Chưa chọn'}</td>

                    <td className="py-2.5 px-4 text-right font-bold text-slate-900 font-mono tabular-nums text-xs">
                      -{tx.amount.toLocaleString('vi-VN')} ₫
                    </td>

                    <td className="py-2.5 px-4 text-center">
                      {tx.receiptImageUrl ? (
                        <button
                          onClick={() => setViewingTx(tx)}
                          className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-0.5 text-[11px]"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Xem</span>
                        </button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`Xóa giao dịch ${tx.merchant}? Số dư ví sẽ được hoàn lại.`)) {
                            deleteTransaction(tx.id);
                          }
                        }}
                        className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple View Receipt Modal */}
      {viewingTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Chi Tiết Hóa Đơn</h3>
              <button onClick={() => setViewingTx(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {viewingTx.receiptImageUrl && (
              <div className="bg-slate-50 p-2 rounded border border-slate-200 flex items-center justify-center">
                <img src={viewingTx.receiptImageUrl} alt="Bill" className="max-h-60 object-contain rounded" />
              </div>
            )}

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Đơn vị:</span>
                <span className="font-semibold text-slate-900">{viewingTx.merchant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ngày:</span>
                <span className="font-mono text-slate-800">{viewingTx.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tổng thanh toán:</span>
                <span className="font-bold text-emerald-600 font-mono text-sm">
                  {viewingTx.amount.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setViewingTx(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
