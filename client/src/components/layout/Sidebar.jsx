import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  Building2, 
  Wrench, 
  Plus, 
  FileText,
  Activity
} from 'lucide-react';

export default function Sidebar({ onOpenRegisterModal }) {
  const navItems = [
    { to: '/', label: 'Overview Panel', icon: LayoutDashboard, exact: true },
    { to: '/equipment', label: 'Equipment Registry', icon: Layers },
    { to: '/labs', label: 'Laboratory Rooms', icon: Building2 },
    { to: '/maintenance', label: 'Calibration & Service', icon: Wrench },
  ];

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-default)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'sticky',
      top: 0
    }}>
      {/* Brand & Technical Badge */}
      <div style={{
        padding: '1.25rem 1.25rem 1rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            backgroundColor: 'var(--accent-orange)',
            borderRadius: 'var(--radius-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.9rem',
            fontFamily: 'var(--font-mono)'
          }}>
            LT
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.05rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              LabTrack
            </div>
            <div className="font-mono" style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              INST. MGMT v2.4
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div style={{ padding: '1rem 1.25rem' }}>
        <button
          onClick={onOpenRegisterModal}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Plus size={15} strokeWidth={2} />
          <span>Register Asset</span>
        </button>
      </div>

      {/* Nav Menu */}
      <nav style={{ padding: '0.5rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div className="font-mono" style={{
          fontSize: '0.675rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '0.5rem 0.6rem 0.25rem 0.6rem'
        }}>
          NAVIGATION
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-subtle)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-orange)' : '3px solid transparent',
                transition: 'all var(--duration-fast) var(--ease-technical)'
              })}
            >
              <Icon size={16} strokeWidth={1.75} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Facility Information Box */}
      <div style={{
        padding: '1rem',
        margin: '0.75rem',
        backgroundColor: 'var(--bg-subtle)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
          <Activity size={13} strokeWidth={1.75} color="var(--accent-orange)" />
          <span className="font-mono" style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
            CAMPUS FACILITY
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
          Central Laboratory Complex
        </p>
        <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          5 Active Lab Hubs • 32 Benches
        </div>
      </div>
    </aside>
  );
}
