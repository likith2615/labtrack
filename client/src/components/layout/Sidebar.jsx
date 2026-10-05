import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Layers, 
  Building2, 
  Wrench, 
  Plus, 
  Palette,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react';

export default function Sidebar({ collapsed, onToggleCollapse, onOpenRegisterModal }) {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Overview Panel', icon: LayoutDashboard, exact: true },
    { to: '/equipment', label: 'Equipment Registry', icon: Layers },
    { to: '/labs', label: 'Laboratory Rooms', icon: Building2 },
    { to: '/maintenance', label: 'Service & Maintenance', icon: Wrench },
    { to: '/design-preview', label: 'Design System Spec', icon: Palette }
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)' }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border-default)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        overflowX: 'hidden'
      }}
    >
      {/* Brand & Technical Mark */}
      <div style={{
        padding: collapsed ? '1.25rem 0.75rem' : '1.25rem 1.25rem 1rem 1.25rem',
        borderBottom: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between'
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

          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
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
            </motion.div>
          )}
        </div>

        {/* Collapse toggle button */}
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            style={{
              background: 'none',
              border: '1px solid var(--color-border-default)',
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-xs)',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)'
            }}
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Primary Action Button */}
      <div style={{ padding: collapsed ? '0.75rem 0.5rem' : '1rem 1.25rem' }}>
        <button
          onClick={onOpenRegisterModal}
          className="btn btn-primary"
          title="Register Asset"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: collapsed ? '0.55rem' : '0.55rem 0.95rem'
          }}
        >
          <Plus size={16} strokeWidth={2} />
          {!collapsed && <span>Register Asset</span>}
        </button>
      </div>

      {/* Navigation Links with layoutId active indicator */}
      <nav style={{ padding: '0.5rem 0.65rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {!collapsed && (
          <div className="font-mono" style={{
            fontSize: '0.675rem',
            fontWeight: 700,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0.5rem 0.6rem 0.25rem 0.6rem'
          }}>
            NAVIGATION
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
              title={collapsed ? item.label : undefined}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: '0.75rem',
                padding: collapsed ? '0.65rem' : '0.55rem 0.75rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: 'var(--text-base)',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                backgroundColor: 'transparent',
                transition: 'color var(--duration-fast) var(--ease-technical)'
              }}
            >
              {/* Framer Motion Active Route Indicator Box & Border */}
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
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

              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapsed Expand Trigger or Bottom Facility Status */}
      {collapsed ? (
        <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--color-border-subtle)' }}>
          <button
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
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
            <ChevronRight size={14} />
          </button>
        </div>
      ) : (
        <div style={{
          padding: '0.85rem 1rem',
          margin: '0.75rem',
          backgroundColor: 'var(--color-surface-subtle)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-xs)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <Activity size={13} strokeWidth={2} color="var(--color-accent-orange)" />
            <span className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase' }}>
              CAMPUS FACILITY
            </span>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.3 }}>
            5 Laboratories • 45 Assets
          </p>
        </div>
      )}
    </motion.aside>
  );
}
