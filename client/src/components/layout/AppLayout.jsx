import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import EquipmentModal from '../equipment/EquipmentModal';

export default function AppLayout() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAssetRegistered = () => {
    setIsRegisterModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onOpenRegisterModal={() => setIsRegisterModalOpen(true)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header />

        <main style={{ flex: 1, padding: '1.75rem 2rem' }}>
          <Outlet context={{ refreshTrigger, triggerRefresh: () => setRefreshTrigger(prev => prev + 1) }} />
        </main>
      </div>

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
  );
}
