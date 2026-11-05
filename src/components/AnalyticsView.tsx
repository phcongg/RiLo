import React, { useMemo, useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  BarChart3,
  Calendar,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle2,
  Receipt,
  ScanLine,
  Wallet,
  ArrowUpRight,
  Sparkles,
  PieChart as PieIcon,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ExpenseCategory, Transaction } from '../types';

export const AnalyticsView: React.FC = () => {
  const { transactions, wallets, budgets, setActiveTab } = useApp();

  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d' | 'all'>('7d');
  const [hoveredBar, setHoveredBar] = useState<{
    date: string;
    label: string;
    spent: number;
    txCount: number;
  } | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Determine latest transaction date to anchor the timeline (resilient to any client system clock)
  const referenceDate = useMemo(() => {
    if (transactions.length > 0) {
      const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
      return new Date(sorted[0].date);
    }
    return new Date();
  }, [transactions]);

  // Filter transactions based on timeRange relative to referenceDate
  const filteredTxs = useMemo(() => {
    if (transactions.length === 0) return [];
    if (timeRange === 'all') return transactions;

    const days = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
    const cutoff = new Date(referenceDate);
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    const matched = transactions.filter((t) => t.date >= cutoffStr);
    // Fallback to all transactions if range happens to be outside
    return matched.length > 0 ? matched : transactions;
  }, [transactions, timeRange, referenceDate]);

  // Overall calculations
  const totalSpent = useMemo(
    () => filteredTxs.reduce((sum, t) => sum + (t.amount || 0), 0),
    [filteredTxs]
  );

  const totalBudget = useMemo(
    () => Object.values(budgets).reduce((sum, b) => sum + (b || 0), 0),
    [budgets]
  );

  const activeDaysCount = useMemo(() => {
    const dates = new Set(filteredTxs.map((t) => t.date));
    return Math.max(dates.size, 1);
  }, [filteredTxs]);

  const dailyBurnRate = Math.round(totalSpent / activeDaysCount);

  // Month-end projection
  const projectedMonthTotal = dailyBurnRate * 30;
  const projectedSurplusOrDeficit = totalBudget - projectedMonthTotal;

  // Average ticket size
  const avgTicket = filteredTxs.length > 0 ? Math.round(totalSpent / filteredTxs.length) : 0;

  // OCR Verified Ratio
  const ocrTxs = filteredTxs.filter((t) => t.receiptImageUrl || t.ocrRawText);
  const ocrAmount = ocrTxs.reduce((sum, t) => sum + (t.amount || 0), 0);
  const ocrPercent = totalSpent > 0 ? Math.round((ocrAmount / totalSpent) * 100) : 0;

  // Category Colors
  const categoryColors: Record<ExpenseCategory, string> = {
    'Ăn uống': '#f97316', // Orange
    'Mua sắm': '#8b5cf6', // Violet
    'Di chuyển': '#0ea5e9', // Sky
    'Hóa đơn & Tiện ích': '#ef4444', // Red
    'Sức khỏe': '#10b981', // Emerald
    'Giải trí': '#f59e0b', // Amber
    'Khác': '#64748b', // Slate
  };

  // Category Breakdown with Percentages
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const tx of filteredTxs) {
      map[tx.category] = (map[tx.category] || 0) + (tx.amount || 0);
    }
    const categories: ExpenseCategory[] = [
      'Ăn uống',
      'Mua sắm',
      'Di chuyển',
      'Hóa đơn & Tiện ích',
      'Sức khỏe',
      'Giải trí',
      'Khác',
    ];

    const activeList = categories
      .map((cat) => {
        const spent = map[cat] || 0;
        const budget = budgets[cat] || 0;
        const percent = totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0;
        const budgetUsage = budget > 0 ? Math.round((spent / budget) * 100) : 0;
        return {
          category: cat,
          spent,
          budget,
          percent,
          budgetUsage,
          color: categoryColors[cat] || '#64748b',
        };
      })
      .filter((c) => c.spent > 0)
      .sort((a, b) => b.spent - a.spent);

    return activeList.length > 0
      ? activeList
      : [
          {
            category: 'Ăn uống' as ExpenseCategory,
            spent: 0,
            budget: budgets['Ăn uống'] || 6000000,
            percent: 0,
            budgetUsage: 0,
            color: categoryColors['Ăn uống'],
          },
        ];
  }, [filteredTxs, budgets, totalSpent]);

  // Payment method (Wallet) Breakdown
  const walletBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const tx of filteredTxs) {
      map[tx.walletId] = (map[tx.walletId] || 0) + (tx.amount || 0);
    }
    const list = wallets
      .map((w) => {
        const spent = map[w.id] || 0;
        const percent = totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0;
        return {
          ...w,
          spent,
          percent,
        };
      })
      .filter((w) => w.spent > 0)
      .sort((a, b) => b.spent - a.spent);

    return list.length > 0
      ? list
      : wallets.map((w) => ({ ...w, spent: 0, percent: 0 }));
  }, [wallets, filteredTxs, totalSpent]);

  // Daily trend data for Cashflow Chart anchored on referenceDate
  const daysTrend = useMemo(() => {
    const daysToShow = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 20;
    const list: Array<{ date: string; label: string; spent: number; txCount: number }> = [];

    const dateMap: Record<string, { spent: number; txCount: number }> = {};
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(referenceDate);
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      const [, m, day] = str.split('-');
      dateMap[str] = { spent: 0, txCount: 0 };
      list.push({ date: str, label: `${day}/${m}`, spent: 0, txCount: 0 });
    }

    for (const tx of filteredTxs) {
      if (dateMap[tx.date]) {
        dateMap[tx.date].spent += tx.amount || 0;
        dateMap[tx.date].txCount += 1;
      }
    }

    const maxVal = Math.max(...Object.values(dateMap).map((v) => v.spent), 100000);

    return list.map((item) => {
      const data = dateMap[item.date] || { spent: 0, txCount: 0 };
      const heightPercent = maxVal > 0 ? Math.min(100, Math.round((data.spent / maxVal) * 100)) : 5;
      return {
        ...item,
        spent: data.spent,
        txCount: data.txCount,
        heightPercent: Math.max(heightPercent, 6),
        isMax: data.spent === maxVal && maxVal > 0,
      };
    });
  }, [filteredTxs, timeRange, referenceDate]);

  // Top 5 largest expenses
  const topExpenses = useMemo(() => {
    return [...filteredTxs].sort((a, b) => (b.amount || 0) - (a.amount || 0)).slice(0, 5);
  }, [filteredTxs]);

  // Time-of-day spending breakdown
  const timeOfDayBreakdown = useMemo(() => {
    let morning = 0; // 06:00 - 11:30
    let noon = 0; // 11:30 - 17:00
    let evening = 0; // 17:00 - 24:00

    for (const tx of filteredTxs) {
      const hour = tx.time ? parseInt(tx.time.split(':')[0], 10) : 12;
      const amt = tx.amount || 0;
      if (hour >= 6 && hour < 12) morning += amt;
      else if (hour >= 12 && hour < 17) noon += amt;
      else evening += amt;
    }

    const sum = morning + noon + evening || 1;
    return [
      {
        label: 'Sáng (06:00 - 11:30)',
        desc: 'Cà phê, ăn sáng, đổ xăng',
        amount: morning,
        percent: Math.round((morning / sum) * 100),
        color: '#3b82f6',
      },
      {
        label: 'Trưa & Chiều (11:30 - 17:00)',
        desc: 'Cơm trưa văn phòng, siêu thị',
        amount: noon,
        percent: Math.round((noon / sum) * 100),
        color: '#10b981',
      },
      {
        label: 'Tối & Đêm (17:00 - 24:00)',
        desc: 'Ăn tối, giải trí, mua sắm, hóa đơn',
        amount: evening,
        percent: Math.round((evening / sum) * 100),
        color: '#8b5cf6',
      },
    ];
  }, [filteredTxs]);

  // SVG Donut Slices calculation (Radius = 40, Circumference = 2 * PI * 40 = 251.327)
  const donutCircumference = 2 * Math.PI * 40;
  let cumulativeOffset = 0;
  const donutSlices = categoryBreakdown.map((cat) => {
    const fraction = (cat.spent || 0) / (totalSpent || 1);
    const strokeLength = fraction * donutCircumference;
    const strokeDasharray = `${strokeLength} ${donutCircumference}`;
    const strokeDashoffset = -cumulativeOffset;
    cumulativeOffset += strokeLength;
    return {
      category: cat.category,
      color: cat.color,
      percent: cat.percent,
      spent: cat.spent,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  // Empty state handling
  if (transactions.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Chưa có giao dịch để phân tích</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Hãy quét hóa đơn đầu tiên bằng PaddleOCR hoặc tạo giao dịch thủ công để hệ thống phân tích dòng tiền và lập biểu đồ.
        </p>
        <button
          onClick={() => setActiveTab('scanner')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
        >
          Quét Hóa Đơn Ngay
        </button>
      </div>
    );
  }

  return (
    <div className="p-3.5 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Header & Time Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DBD0]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#8A8274] uppercase mb-1">
            <span>BÁO CÁO THỐNG KÊ KẾ TOÁN</span>
            <span aria-hidden="true">·</span>
            <span>KỲ 10/2026</span>
          </div>
          <h1 className="text-2xl font-sans font-bold text-[#191715] tracking-tight">
            Thống Kê Dòng Tiền & Cân Đối Ngân Sách
          </h1>
          <p className="text-xs text-[#6B6457] mt-0.5 max-w-xl leading-relaxed">
            Phân tích tốc độ chi tiêu theo ngày, cơ cấu mặt hàng và tỷ lệ chứng từ xác thực qua PaddleOCR PP-OCRv4.
          </p>
        </div>

        {/* Time Segmented Buttons */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xs border border-[#DDD6C8] shadow-xs text-xs font-mono self-start sm:self-auto overflow-x-auto max-w-full">
          {(
            [
              { id: '7d', label: '7 ngày' },
              { id: '14d', label: '14 ngày' },
              { id: '30d', label: 'Tháng này (30d)' },
              { id: 'all', label: 'Tất cả' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeRange(tab.id)}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
                timeRange === tab.id
                  ? 'bg-[#191715] text-[#FAF8F5] font-bold'
                  : 'text-[#6A6357] hover:text-[#191715] hover:bg-[#F2EFE8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Financial Intelligence KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Tổng Chi Tiêu */}
        <div className="bg-white rounded-xs p-4 border border-[#DDD6C8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7A7365]">
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Tổng Chi Trong Kỳ</span>
            <div className="w-6 h-6 rounded-xs bg-[#FDF0EE] text-red-700 flex items-center justify-center border border-red-200">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-sans font-bold text-[#191715] tabular-nums">
            {totalSpent.toLocaleString('vi-VN')} <span className="text-xs font-mono font-bold text-[#7A7365]">₫</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-[#8C8477]">
            {filteredTxs.length} giao dịch ghi nhận
          </div>
        </div>

        {/* KPI 2: Burn Rate & Dự Báo Cuối Tháng */}
        <div className="bg-white rounded-xs p-4 border border-[#DDD6C8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7A7365]">
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Tốc Độ Chi / Ngày</span>
            <div className="w-6 h-6 rounded-xs bg-[#FAF5EB] text-amber-800 flex items-center justify-center border border-amber-200">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-sans font-bold text-amber-800 tabular-nums">
            {dailyBurnRate.toLocaleString('vi-VN')} <span className="text-xs font-mono font-bold text-[#7A7365]">₫</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-[#8C8477]">
            Dự báo cả tháng: <strong className="font-mono text-[#191715]">{projectedMonthTotal.toLocaleString('vi-VN')} ₫</strong>
          </div>
        </div>

        {/* KPI 3: Giá trị Hóa đơn TB */}
        <div className="bg-white rounded-xs p-4 border border-[#DDD6C8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#7A7365]">
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Trung Bình / Giao Dịch</span>
            <div className="w-6 h-6 rounded-xs bg-[#F4F1E8] text-[#191715] flex items-center justify-center border border-[#DDD6C8]">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-sans font-bold text-[#191715] tabular-nums">
            {avgTicket.toLocaleString('vi-VN')} <span className="text-xs font-mono font-bold text-[#7A7365]">₫</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-[#8C8477]">
            Đơn giá chi tiêu bình quân
          </div>
        </div>

        {/* KPI 4: Tỷ lệ Hóa đơn OCR */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Xác thực qua PaddleOCR</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ScanLine className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 font-mono tabular-nums">
            {ocrPercent}%
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium">
            {ocrTxs.length} hóa đơn quét ảnh gốc
          </div>
        </div>
      </div>

      {/* Main Charts Row 1: Daily Cashflow Trend & Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (7 Cols): Daily Cashflow Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Biểu Đồ Xu Hướng Chi Tiêu Hằng Ngày</h3>
                <p className="text-xs text-slate-400 mt-0.5">Dòng tiền chi ra theo từng ngày trong giai đoạn chọn</p>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-200/60">
                Đơn vị: VNĐ
              </span>
            </div>

            {/* Interactive Bar Chart */}
            <div className="h-52 flex items-end justify-between gap-1.5 pt-6 pb-2 border-b border-slate-100 relative">
              {daysTrend.map((item) => (
                <div
                  key={item.date}
                  onMouseEnter={() => setHoveredBar(item)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="flex-1 flex flex-col items-center gap-1.5 group relative cursor-pointer"
                >
                  {/* Bar */}
                  <div className="w-full max-w-[26px] bg-slate-100 rounded-t-md h-36 flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 group-hover:brightness-110 ${
                        item.isMax
                          ? 'bg-rose-500'
                          : item.spent > 200000
                          ? 'bg-indigo-600'
                          : item.spent > 0
                          ? 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                      style={{ height: `${item.heightPercent}%` }}
                    />
                  </div>
                  {/* Day Label */}
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-800">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tooltip detail bar */}
            <div className="mt-3 p-2 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
              {hoveredBar && hoveredBar.spent !== undefined ? (
                <>
                  <span className="font-semibold text-slate-800">
                    Ngày {hoveredBar.date}: <strong className="font-mono text-emerald-600">{hoveredBar.spent.toLocaleString('vi-VN')} ₫</strong>
                  </span>
                  <span className="text-slate-500">{hoveredBar.txCount} giao dịch</span>
                </>
              ) : (
                <span className="text-slate-400 text-[11px]">
                  Rê chuột vào từng cột để xem chi tiết số tiền chi tiêu trong ngày
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block">Dự báo ngân sách cả tháng:</span>
              <span className={`font-bold font-mono ${projectedSurplusOrDeficit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {projectedSurplusOrDeficit >= 0 ? 'Thặng dư: +' : 'Bội chi: '}
                {Math.abs(projectedSurplusOrDeficit).toLocaleString('vi-VN')} ₫
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Số ngày có phát sinh chi tiêu:</span>
              <span className="font-bold font-mono text-slate-800">{activeDaysCount} ngày</span>
            </div>
          </div>
        </div>

        {/* Right (5 Cols): Interactive Vector Donut Chart & Category Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                <span>Biểu Đồ Tròn Cơ Cấu Chi Tiêu</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Tỷ lệ %</span>
            </div>

            {/* SVG Donut Chart in Center */}
            <div className="flex items-center justify-center my-3">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="14"
                  />
                  {donutSlices.map((slice) => (
                    <circle
                      key={slice.category}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth="14"
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                      onMouseEnter={() => setHoveredCategory(slice.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    />
                  ))}
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {hoveredCategory || 'Tổng chi'}
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-900">
                    {hoveredCategory
                      ? `${(categoryBreakdown.find((c) => c.category === hoveredCategory)?.percent || 0)}%`
                      : `${totalSpent.toLocaleString('vi-VN')} ₫`}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Detailed List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {categoryBreakdown.map((c) => (
                <div
                  key={c.category}
                  onMouseEnter={() => setHoveredCategory(c.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`p-1.5 rounded-lg transition-colors text-xs ${
                    hoveredCategory === c.category ? 'bg-slate-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5 font-medium text-slate-800">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="truncate">{c.category}</span>
                    </span>
                    <div className="font-mono text-slate-900 shrink-0">
                      <strong className="font-bold">{c.spent.toLocaleString('vi-VN')} ₫</strong>
                      <span className="text-slate-400 ml-1.5 text-[11px]">({c.percent}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, c.budget > 0 ? (c.spent / c.budget) * 100 : c.percent)}%`,
                        backgroundColor: c.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Chi nhiều nhất: <strong className="text-slate-800">{categoryBreakdown[0]?.category || 'N/A'}</strong></span>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              <span>Vào sổ chi tiêu</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Payment Method Breakdown & Time-of-Day Pattern */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Payment Methods (Wallets) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>Phân Bổ Theo Nguồn Ví Thanh Toán</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Ví tiền</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Dòng tiền được rút từ tài khoản ngân hàng, ví MoMo hay tiền mặt cá nhân:
          </p>

          <div className="space-y-3">
            {walletBreakdown.map((w) => (
              <div key={w.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: w.color }} />
                    <span>{w.name}</span>
                  </span>
                  <div className="font-mono font-bold text-slate-900">
                    {w.spent.toLocaleString('vi-VN')} ₫ <span className="text-slate-400 font-normal">({w.percent}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${w.percent}%`, backgroundColor: w.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time-of-Day Spending Heat */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Phân Tích Thói Quen Tiêu Dùng Theo Khung Giờ</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Giờ trong ngày</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Khung giờ nào bạn thường phát sinh các khoản chi tiêu lớn nhất:
          </p>

          <div className="space-y-3">
            {timeOfDayBreakdown.map((tod) => (
              <div key={tod.label} className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="font-semibold text-slate-800 block">{tod.label}</span>
                    <span className="text-[11px] text-slate-400">{tod.desc}</span>
                  </div>
                  <div className="font-mono text-right">
                    <div className="font-bold text-slate-900">{tod.amount.toLocaleString('vi-VN')} ₫</div>
                    <div className="text-slate-400 text-[11px]">{tod.percent}% tổng chi</div>
                  </div>
                </div>
                <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${tod.percent}%`, backgroundColor: tod.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Top 5 Largest Expenses List */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Top 5 Khoản Chi Lớn Nhất Trong Kỳ</h3>
            <p className="text-xs text-slate-500 mt-0.5">Các khoản chi tiêu chiếm tỷ trọng lớn trong ngân sách của bạn</p>
          </div>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
            Chi tiêu đáng chú ý
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {topExpenses.map((tx, idx) => {
            const wallet = wallets.find((w) => w.id === tx.walletId);
            const percentOfTotal = totalSpent > 0 ? (((tx.amount || 0) / totalSpent) * 100).toFixed(1) : 0;
            return (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 font-bold text-slate-600 flex items-center justify-center text-[11px]">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">{tx.merchant}</span>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{tx.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{tx.date}</span>
                      {wallet && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{wallet.name}</span>
                        </>
                      )}
                      {tx.receiptImageUrl && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-600 font-medium">Có hóa đơn OCR</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900 font-mono text-sm tabular-nums">
                    -{(tx.amount || 0).toLocaleString('vi-VN')} ₫
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Chiếm {percentOfTotal}% tổng chi
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
