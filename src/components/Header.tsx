import React from 'react';
import { Scan, Plus, Calendar, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenManualModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenManualModal }) => {
  const { activeTab, setActiveTab, setIsMobileMenuOpen } = useApp();

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'scanner':
        return 'Bàn Soát Hóa Đơn';
      case 'expenses':
        return 'Sổ Cái & Nguồn Ví';
      case 'analytics':
        return 'Thống Kê Dòng Tiền';
      default:
        return 'Sổ Kế Toán';
    }
  };

  const todayStr = new Date().toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });

  return (
    <header className="h-14 sm:h-16 bg-[#FAF8F5] border-b border-[#E8E2D5] px-3 sm:px-6 flex items-center justify-between gap-3 sm:gap-6 shrink-0 z-10">
      {/* Zone 1: Mobile Hamburger & Archival Ledger Location */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-1.5 -ml-1 text-[#2A2621] hover:bg-[#EFECE4] rounded-xs transition-colors cursor-pointer"
          aria-label="Mở menu tài sản và sổ cái"
          title="Menu tài sản"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand mark on mobile */}
        <div className="flex items-center gap-1.5 md:hidden">
          <span className="font-sans font-extrabold text-base tracking-tight text-[#161513]">
            rilo<span className="text-red-600 font-black">.</span>
          </span>
          <span className="text-[#D0C8B8]" aria-hidden="true">/</span>
          <span className="font-sans font-semibold text-xs text-[#4A443B] truncate max-w-[120px] xs:max-w-[160px]">
            {getBreadcrumb()}
          </span>
        </div>

        {/* Desktop breadcrumb */}
        <div className="hidden md:flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#9C9488] font-bold">
            SỔ CÁI
          </span>
          <span className="text-[#D0C8B8]">/</span>
          <span className="font-sans font-bold text-sm text-[#1C1A17] tracking-tight">
            {getBreadcrumb()}
          </span>
        </div>

        {/* Date badge */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono text-[#827A6D] pl-3 border-l border-[#E2DBD0]">
          <Calendar className="w-3 h-3 text-[#A8A092]" />
          <span className="capitalize">{todayStr}</span>
        </div>
      </div>

      {/* Zone 2: Quiet Precision Metadata (Zero-Pill Discipline on Large Screens) */}
      <div className="hidden lg:flex items-center gap-2.5 text-[11px] text-[#6E675B] font-mono">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
          <span>PP-OCRv4 ENGINE</span>
        </span>
        <span className="text-[#D0C8B8]" aria-hidden="true">·</span>
        <span>SVTR-LCNet</span>
        <span className="text-[#D0C8B8]" aria-hidden="true">·</span>
        <span>QWEN 2.5 ENGINE</span>
      </div>

      {/* Zone 3: Tactile Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenManualModal}
          className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-[#2E2A25] bg-[#EFECE4] hover:bg-[#E5E0D5] border border-[#DDD6C8] rounded-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#5A5348]" />
          <span className="hidden xs:inline">Ghi chép</span>
          <span className="xs:hidden">Ghi</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1A1816] hover:bg-[#2B2723] rounded-xs shadow-xs transition-all cursor-pointer border border-[#1A1816]"
        >
          <Scan className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden xs:inline">Soát hóa đơn</span>
          <span className="xs:hidden">Quét</span>
        </button>
      </div>
    </header>
  );
};
