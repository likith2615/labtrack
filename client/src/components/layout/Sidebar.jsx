import React, { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Layers, 
  Building2, 
  Wrench, 
  Plus, 
  Palette,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  User,
  Shield,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  onOpenRegisterModal,
  mobileOpen = false,
  onCloseMobile
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, isAdmin, isStaff, isStudent, logout } = useAuth();
  const toast = useToast();

  // Close mobile drawer on route change
  useEffect(() => {
    if (mobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  }, [location.pathname]);

  // Handle ESC to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen && onCloseMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  const handleLogout = () => {
    logout();
    toast.info('Signed out of LabTrack session.', 'Session Terminated');
    navigate('/login', { replace: true });
  };

  // Role-specific navigation items
  const navItems = [
    ...(isAdmin || isStaff ? [{ to: '/', label: 'Overview Panel', icon: LayoutDashboard, exact: true }] : []),
    { to: '/equipment', label: isStudent ? 'Equipment Catalog' : 'Equipment Registry', icon: Layers, exact: isStudent },
    { to: '/labs', label: 'Laboratory Rooms', icon: Building2 },
    { to: '/maintenance', label: isStudent ? 'Report Issue / Service' : 'Service & Maintenance', icon: Wrench },
    { to: '/design-preview', label: 'Design System Spec', icon: Palette }
  ];

  const roleColor =
    role === 'admin'
      ? 'var(--color-accent-orange)'
      : role === 'staff'
      ? 'var(--color-status-maintenance)'
      : 'var(--color-status-available)';

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '100%',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border-default)',
        overflowX: 'hidden'
      }}
    >
      {/* Brand & Technical Mark */}
      <div style={{
        padding: collapsed && !mobileOpen ? '1.25rem 0.75rem' : '1.25rem 1.25rem 1rem 1.25rem',
        borderBottom: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed && !mobileOpen ? 'center' : 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '30px',
            height: '30px',
            backgroundColor: 'var(--color-accent-orange)',
            borderRadius: 'var(--radius-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.9rem',
            fontFamily: 'var(--font-mono)',
            flexShrink: 0
          }}>
            LT
          </div>

          {(!collapsed || mobileOpen) && (
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.1rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: 'var(--color-text-primary)'
              }}>
                LabTrack
              </div>
              <div className="font-mono" style={{
                fontSize: '0.65rem',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                INST. PANEL v2.4
              </div>
            </div>
          )}
        </div>

        {/* Desktop collapse or Mobile Close button */}
        {mobileOpen ? (
          <button
            onClick={onCloseMobile}
            aria-label="Close navigation drawer"
            style={{
              background: 'none',
              border: '1px solid var(--color-border-default)',
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-xs)',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)'
            }}
          >
            <X size={16} />
          </button>
        ) : !collapsed ? (
          <button
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            className="desktop-only"
            style={{
              background: 'none',
              border: '1px solid var(--color-border-default)',
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-xs)',
              width: '24px',
              height: '24px',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)'
            }}
          >
            <ChevronLeft size={14} />
          </button>
        ) : null}
      </div>

      {/* Primary Action Button */}
      <div style={{ padding: collapsed && !mobileOpen ? '0.75rem 0.5rem' : '1rem 1.25rem' }}>
        {isAdmin || isStaff ? (
          <button
            onClick={() => {
              if (mobileOpen && onCloseMobile) onCloseMobile();
              onOpenRegisterModal();
            }}
            className="btn btn-primary"
            title="Register Asset"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: collapsed && !mobileOpen ? '0.55rem' : '0.55rem 0.95rem',
              backgroundColor: 'var(--color-accent-orange)',
              color: '#FFFFFF',
              border: '1px solid var(--color-accent-orange)',
              borderRadius: 'var(--radius-xs)',
              fontWeight: 700,
              fontSize: 'var(--text-base)',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} strokeWidth={2} />
            {(!collapsed || mobileOpen) && <span>Register Asset</span>}
          </button>
        ) : (
          <button
            onClick={() => {
              if (mobileOpen && onCloseMobile) onCloseMobile();
              navigate('/maintenance');
            }}
            className="btn btn-secondary"
            title="Report Equipment Fault"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: collapsed && !mobileOpen ? '0.55rem' : '0.55rem 0.95rem',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-xs)',
              fontWeight: 600,
              fontSize: 'var(--text-base)',
              cursor: 'pointer'
            }}
          >
            <Wrench size={15} strokeWidth={1.75} />
            {(!collapsed || mobileOpen) && <span>Report Fault</span>}
          </button>
        )}
      </div>

      {/* Navigation Links with layoutId active indicator */}
      <nav
        aria-label="Sidebar Menu"
        style={{ padding: '0.5rem 0.65rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
      >
        {(!collapsed || mobileOpen) && (
          <div className="font-mono" style={{
            fontSize: '0.675rem',
            fontWeight: 700,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0.5rem 0.6rem 0.25rem 0.6rem'
          }}>
            {role.toUpperCase()} NAVIGATION
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              title={collapsed && !mobileOpen ? item.label : undefined}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed && !mobileOpen ? 'center' : 'flex-start',
                gap: '0.75rem',
                padding: collapsed && !mobileOpen ? '0.65rem' : '0.55rem 0.75rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: 'var(--text-base)',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                backgroundColor: 'transparent',
                transition: 'color var(--duration-fast) var(--ease-technical)'
              }}
            >
              {isActive && (
                <motion.div
                  layoutId={mobileOpen ? "active-nav-indicator-mobile" : "active-nav-indicator"}
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'var(--color-surface-subtle)',
                    borderLeft: '3px solid var(--color-accent-orange)',
                    borderRadius: 'var(--radius-xs)',
                    zIndex: -1
                  }}
                />
              )}

              <Icon size={17} strokeWidth={isActive ? 2 : 1.75} color={isActive ? 'var(--color-accent-orange)' : 'currentColor'} />

              {(!collapsed || mobileOpen) && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Session Profile & Logout Footer */}
      <div style={{
        padding: collapsed && !mobileOpen ? '0.75rem 0.5rem' : '0.85rem 1rem',
        borderTop: '1px solid var(--color-border-subtle)',
        backgroundColor: 'var(--color-surface-subtle)'
      }}>
        {collapsed && !mobileOpen ? (
          <button
            onClick={handleLogout}
            title={`Sign Out (${user?.name || 'User'})`}
            aria-label="Sign Out"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '0.5rem 0'
            }}
          >
            <LogOut size={16} />
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--color-canvas)',
                    border: '1px solid var(--color-border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    flexShrink: 0
                  }}
                >
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                </div>

                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {user?.name || 'Authorized User'}
                  </div>
                  <div className="font-mono" style={{
                    fontSize: '0.65rem',
                    color: roleColor,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    {role.toUpperCase()}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Log Out"
                aria-label="Log out of session"
                style={{
                  background: 'none',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <LogOut size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent / Collapsible Sidebar */}
      <motion.aside
        className="desktop-only"
        animate={{ width: collapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)' }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{
          minHeight: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Off-Canvas Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              display: 'flex'
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(22, 24, 29, 0.6)',
                backdropFilter: 'blur(2px)'
              }}
            />

            {/* Sliding Drawer Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                width: '280px',
                maxWidth: '85vw',
                height: '100%',
                zIndex: 1001,
                boxShadow: 'var(--shadow-panel)'
              }}
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
