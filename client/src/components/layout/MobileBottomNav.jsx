import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Building2,
  Wrench,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MobileBottomNav({ onOpenDrawer }) {
  const { isAdmin, isStaff, isStudent } = useAuth();
  const location = useLocation();

  const navItems = [
    ...(isAdmin || isStaff
      ? [{ to: '/', label: 'Overview', icon: LayoutDashboard, exact: true }]
      : []),
    { to: '/equipment', label: isStudent ? 'Catalog' : 'Registry', icon: Layers, exact: isStudent },
    { to: '/labs', label: 'Labs', icon: Building2 },
    { to: '/maintenance', label: isStudent ? 'Faults' : 'Service', icon: Wrench }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '56px',
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border-default)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 900,
        boxShadow: '0 -2px 10px rgba(22, 24, 29, 0.08)'
      }}
      className="mobile-only"
    >
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
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              padding: '0.35rem 0.65rem',
              color: isActive ? 'var(--color-accent-orange)' : 'var(--color-text-secondary)',
              fontFamily: 'var(--font-display)',
              fontSize: '0.65rem',
              fontWeight: isActive ? 700 : 500,
              textDecoration: 'none',
              transition: 'color 0.15s ease'
            }}
          >
            <Icon size={18} strokeWidth={isActive ? 2.2 : 1.75} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      <button
        type="button"
        onClick={onOpenDrawer}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          padding: '0.35rem 0.65rem',
          background: 'none',
          border: 'none',
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-display)',
          fontSize: '0.65rem',
          fontWeight: 500,
          cursor: 'pointer'
        }}
        aria-label="Open more navigation options"
      >
        <Menu size={18} strokeWidth={1.75} />
        <span>Menu</span>
      </button>
    </nav>
  );
}
