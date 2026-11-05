import React from 'react';
import {
  FileSpreadsheet,
  Scan,
  TrendingUp,
  RotateCcw,
  Plus,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppLogo } from './AppLogo';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    wallets,
    resetToSampleData,
    setIsResetModalOpen,
    setIsAddAssetModalOpen,
    openTopUpModal,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useApp();

  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);

  interface NavItem {
    id: 'scanner' | 'expenses' | 'analytics';
    index: string;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  const navItems: NavItem[] = [
    {
      id: 'scanner',
      index: '01',
      label: 'Bàn Soát Hóa Đơn',
      sublabel: 'PaddleOCR PP-OCRv4',
      icon: Scan,
    },
    {
      id: 'expenses',
      index: '02',
      label: 'Sổ Cái Kế Toán',
      sublabel: 'Thu Chi & Nguồn Ví',
      icon: FileSpreadsheet,
    },
    {
      id: 'analytics',
      index: '03',
      label: 'Thống Kê Dòng Tiền',
      sublabel: 'Biểu Đồ & Xu Hướng',
      icon: TrendingUp,
    },
  ];

  const handleNavClick = (tabId: 'scanner' | 'expenses' | 'analytics') => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full select-none">
      {/* Brand Header with rilo. Logo */}
      <div className="p-4 sm:p-5 border-b border-[#262421]">
        <div className="flex items-center justify-between">
          <AppLogo size="md" variant="full" theme="dark" />
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 text-[#9C9488] hover:text-white hover:bg-[#23201D] rounded-xs transition-colors"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Master Ledger Balance Section */}
        <div className="mt-4 pt-3 border-t border-[#262421]">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#9C9488] uppercase">
            <span>Tài sản khả dụng</span>
            <span className="text-red-500 font-bold">KỲ 10/2026</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-sans font-bold text-[#FAF8F5] tracking-tight tabular-nums">
              {totalBalance.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs font-mono font-bold text-red-500">₫</span>
          </div>

          {/* Quick Asset Actions */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <button
              onClick={() => {
                if (isMobile) setIsMobileMenuOpen(false);
                setIsAddAssetModalOpen(true);
              }}
              className="flex-1 py-1 px-2 bg-[#23201D] hover:bg-[#2F2B27] text-[#EDE8DF] hover:text-white border border-[#3A352F] rounded-xs text-[10px] font-mono flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Thêm nguồn tài sản mới"
            >
              <Plus className="w-2.5 h-2.5 text-emerald-400" />
              <span>+ Thêm</span>
            </button>
            <button
              onClick={() => {
                if (isMobile) setIsMobileMenuOpen(false);
                openTopUpModal();
              }}
              className="flex-1 py-1 px-2 bg-[#23201D] hover:bg-[#2F2B27] text-[#EDE8DF] hover:text-white border border-[#3A352F] rounded-xs text-[10px] font-mono flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Nạp thêm tiền vào tài sản"
            >
              <span>Nạp tiền</span>
            </button>
            <button
              onClick={() => {
                if (isMobile) setIsMobileMenuOpen(false);
                setIsResetModalOpen(true);
              }}
              className="py-1 px-2 bg-[#23201D] hover:bg-red-950/40 text-[#9C9488] hover:text-red-400 border border-[#3A352F] rounded-xs text-[10px] font-mono flex items-center justify-center transition-colors cursor-pointer"
              title="Cài đặt lại số dư khả dụng (Reset)"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation: Physical Index Tab Aesthetics */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-2 pb-2 text-[10px] font-mono uppercase tracking-widest text-[#787268]">
          Mục Lục Sổ Cái
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full group text-left px-3 py-2.5 rounded-sm transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-[#23201D] text-[#FAF8F5] border border-[#3A352F] shadow-xs'
                  : 'text-[#ABA396] hover:text-[#FAF8F5] hover:bg-[#1C1A18] border border-transparent'
              }`}
            >
              {/* Active Left Bookmark Notch */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-red-600 rounded-r-xs" />
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`font-mono text-[10px] transition-colors ${
                      isActive ? 'text-red-500 font-bold' : 'text-[#6C665D] group-hover:text-[#968E82]'
                    }`}
                  >
                    {item.index}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold tracking-wide">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-mono text-[#787268]">
                      {item.sublabel}
                    </span>
                  </div>
                </div>

                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive ? 'text-red-500' : 'text-[#645F56] group-hover:text-[#ABA396]'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-3.5 border-t border-[#262421] flex items-center justify-between text-xs text-[#6A645B] font-mono shrink-0">
        <span className="text-[10px] tracking-wider">rilo. CORE v2.5</span>
        <button
          onClick={() => {
            if (confirm('Khôi phục toàn bộ sổ thu chi và hóa đơn mẫu ban đầu?')) {
              if (isMobile) setIsMobileMenuOpen(false);
              resetToSampleData();
            }
          }}
          title="Khôi phục sổ kế toán mẫu"
          className="flex items-center gap-1 text-[10px] text-[#8C8477] hover:text-[#EDE8DF] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>Đặt lại</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-68 bg-[#151413] text-[#EDE8DF] flex-col shrink-0 border-r border-[#262421] z-20 h-full">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer sheet */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#151413] text-[#EDE8DF] flex flex-col z-50 shadow-2xl border-r border-[#262421] transition-transform duration-200">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
