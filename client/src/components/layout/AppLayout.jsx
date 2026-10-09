import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import EquipmentFormModal from '../dashboard/EquipmentFormModal';
import { labsApi, categoriesApi } from '../../api/client';

export default function AppLayout() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [labs, setLabs] = useState([]);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    Promise.all([labsApi.getAll(), categoriesApi.getAll()])
      .then(([labsRes, catsRes]) => {
        setLabs(labsRes.data || []);
        setCategories(catsRes.data || []);
      })
      .catch(console.error);
  }, [refreshTrigger]);

  const handleAssetRegistered = () => {
    setIsRegisterModalOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-canvas)' }}>
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        collapsed={collapsedSidebar}
        onToggleCollapse={() => setCollapsedSidebar((p) => !p)}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, paddingBottom: '56px' }} className="main-content-column">
        <Header onToggleMobileMenu={() => setMobileNavOpen((p) => !p)} />

        <main id="main-content" tabIndex={-1} style={{ flex: 1, padding: 'clamp(1rem, 2.5vw, 1.75rem)', position: 'relative', outline: 'none' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: shouldReduceMotion ? 0.05 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet context={{ refreshTrigger, triggerRefresh: () => setRefreshTrigger((prev) => prev + 1) }} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav onOpenDrawer={() => setMobileNavOpen(true)} />

      {/* Global Register Modal Portal */}
      <EquipmentFormModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={handleAssetRegistered}
        labs={labs}
        categories={categories}
      />
    </div>
  );
}
