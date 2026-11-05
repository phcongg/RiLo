import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'mark-only' | 'stamp';
  className?: string;
  theme?: 'dark' | 'light';
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  theme = 'dark',
}) => {
  const markSize = size === 'sm' ? 28 : size === 'lg' ? 40 : 32;
  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Clean Geometric Brandmark: Modern Scanner & Ledger Icon */}
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: markSize, height: markSize }}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base rounded square */}
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="8"
            fill={isDark ? '#23201D' : '#F0ECE1'}
            stroke={isDark ? '#3D3833' : '#D4CDC0'}
            strokeWidth="1.5"
          />

          {/* Scanner aperture reticle brackets */}
          <path
            d="M 9 15 L 9 9 L 15 9"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 31 15 L 31 9 L 25 9"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 9 25 L 9 31 L 15 31"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 31 25 L 31 31 L 25 31"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Clean Receipt / Currency Bar Icon */}
          <rect
            x="14"
            y="13"
            width="12"
            height="2"
            rx="1"
            fill={isDark ? '#FAF5EB' : '#1C1A17'}
          />
          <rect
            x="14"
            y="18"
            width="8"
            height="2"
            rx="1"
            fill={isDark ? '#FAF5EB' : '#1C1A17'}
          />
          <rect
            x="14"
            y="23"
            width="12"
            height="2"
            rx="1"
            fill={isDark ? '#A8A29E' : '#78716C'}
          />
        </svg>
      </div>

      {/* Typography: Simple, Modern, Clean */}
      {variant === 'full' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-sans font-bold text-xl tracking-tight leading-none ${
                isDark ? 'text-white' : 'text-stone-900'
              }`}
            >
              rilo<span className="text-red-500 font-extrabold">.</span>
            </span>
          </div>
          <span
            className={`font-mono text-[9px] uppercase tracking-wider mt-1 ${
              isDark ? 'text-stone-400' : 'text-stone-500'
            }`}
          >
            Sổ Kế Toán & Quét Hóa Đơn AI
          </span>
        </div>
      )}

      {/* Stamp variant */}
      {variant === 'stamp' && (
        <div className="flex flex-col border border-stone-300 px-2 py-0.5 rounded text-xs bg-stone-100">
          <span className="font-sans text-[10px] text-stone-700 font-medium">
            Đã Đối Soát Hóa Đơn
          </span>
        </div>
      )}
    </div>
  );
};
