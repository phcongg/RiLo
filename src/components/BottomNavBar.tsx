import React from 'react';
import { Scan, FileSpreadsheet, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    {
      id: 'scanner' as const,
      label: 'Soát đơn',
      icon: Scan,
    },
    {
      id: 'expenses' as const,
      label: 'Sổ cái',
      icon: FileSpreadsheet,
    },
    {
      id: 'analytics' as const,
      label: 'Thống kê',
      icon: TrendingUp,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#151413] border-t border-[#2B2824] px-2 py-1.5 flex items-center justify-around shadow-lg safe-area-pb"
      aria-label="Điều hướng chính di động"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xs transition-colors cursor-pointer relative ${
              isActive
                ? 'text-[#FAF8F5]'
                : 'text-[#8A8376] hover:text-[#EDE8DF]'
            }`}
          >
            {isActive && (
              <span className="absolute top-0 w-8 h-0.5 bg-red-600 rounded-full" />
            )}
            <Icon
              className={`w-4 h-4 mb-0.5 transition-colors ${
                isActive ? 'text-red-500' : 'text-[#7A7365]'
              }`}
            />
            <span
              className={`text-[10px] font-mono tracking-tight leading-none ${
                isActive ? 'font-bold text-white' : 'font-medium'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
