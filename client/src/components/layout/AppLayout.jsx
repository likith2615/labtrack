import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import EquipmentModal from '../equipment/EquipmentModal';
import { ToastProvider } from '../ui/Toast';

export default function AppLayout() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const location = useLocation();

  const handleAssetRegistered = () => {
    setIsRegisterModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ToastProvider>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-canvas)' }}>
        <Sidebar
          collapsed={collapsedSidebar}
          onToggleCollapse={() => setCollapsedSidebar(p => !p)}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Header />

          <main style={{ flex: 1, padding: '1.75rem 2rem', position: 'relative' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet context={{ refreshTrigger, triggerRefresh: () => setRefreshTrigger(prev => prev + 1) }} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Global Register Modal Portal */}
        <AnimatePresence>
          {isRegisterModalOpen && (
            <EquipmentModal
              isOpen={isRegisterModalOpen}
              onClose={() => setIsRegisterModalOpen(false)}
              onSuccess={handleAssetRegistered}
            />
          )}
        </AnimatePresence>
      </div>
    </ToastProvider>
  );
}
