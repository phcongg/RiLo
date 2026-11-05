import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { ReceiptScannerView } from './components/ReceiptScannerView';
import { UnifiedExpensesView } from './components/UnifiedExpensesView';
import { AnalyticsView } from './components/AnalyticsView';
import { ManualTransactionModal } from './components/ManualTransactionModal';
import { ResetAssetModal } from './components/ResetAssetModal';
import { AddAssetModal } from './components/AddAssetModal';
import { TopUpAssetModal } from './components/TopUpAssetModal';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  return (
    <div className="flex h-screen h-[100dvh] w-screen overflow-hidden bg-[#F6F4EE] text-[#161513]">
      {/* Left Obsidian Ledger Sidebar (Docked on desktop, off-canvas drawer on mobile) */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <Header onOpenManualModal={() => setIsManualModalOpen(true)} />

        {/* Dynamic View Scroll Area with padding for bottom nav on mobile */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-6">
          {activeTab === 'scanner' && <ReceiptScannerView />}
          {activeTab === 'expenses' && (
            <UnifiedExpensesView onOpenManualModal={() => setIsManualModalOpen(true)} />
          )}
          {activeTab === 'analytics' && <AnalyticsView />}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNavBar />
      </div>

      {/* Manual Entry Modal */}
      <ManualTransactionModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />

      {/* Visual Asset Management Modals */}
      <ResetAssetModal />
      <AddAssetModal />
      <TopUpAssetModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
