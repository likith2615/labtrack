import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Database, User, Menu } from 'lucide-react';
import { healthApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onToggleMobileMenu }) {
  const [timeString, setTimeString] = useState('');
  const [dbStatus, setDbStatus] = useState({ driver: 'Connecting...', active: false });
  const [searchVal, setSearchVal] = useState('');
  const { user, role, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
        ' UTC' + (now.getTimezoneOffset() <= 0 ? '+' : '-') +
        String(Math.abs(Math.floor(now.getTimezoneOffset() / 60))).padStart(2, '0')
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    healthApi.check()
      .then(res => {
        setDbStatus({
          driver: res.database?.driver || 'MySQL Pool',
          active: true
        });
      })
      .catch(() => {
        setDbStatus({ driver: 'Standalone Engine', active: false });
      });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/equipment?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    switchDemoRole(newRole);
  };

  return (
    <header style={{
      height: 'var(--header-height)',
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 clamp(0.75rem, 2vw, 1.5rem)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Left System Status & Mobile Menu Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Mobile Burger Button */}
        <button
          onClick={onToggleMobileMenu}
          className="mobile-only"
          aria-label="Open Navigation Menu"
          style={{
            background: 'none',
            border: '1px solid var(--color-border-default)',
            backgroundColor: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-xs)',
            width: '32px',
            height: '32px',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-text-primary)'
          }}
        >
          <Menu size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{
            width: '7px',
            height: '7px',
            backgroundColor: 'var(--color-status-available)',
            borderRadius: '50%',
            display: 'inline-block'
          }} />
          <span className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
            <span className="desktop-only" style={{ display: 'inline' }}>LAB TELEMETRY </span>ONLINE
          </span>
        </div>

        <div className="desktop-only" style={{
          height: '16px',
          width: '1px',
          backgroundColor: 'var(--color-border-default)'
        }} />

        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
          <Database size={13} strokeWidth={1.75} style={{ opacity: 0.7 }} />
          <span className="font-mono" style={{ fontSize: '0.725rem' }}>{dbStatus.driver}</span>
        </div>
      </div>

      {/* Right Controls: Search, Clock, and Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
          <Search size={13} strokeWidth={1.75} style={{
            position: 'absolute',
            left: '0.65rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            className="form-input font-mono"
            placeholder="Search assets..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            style={{
              paddingLeft: '1.9rem',
              paddingTop: '0.3rem',
              paddingBottom: '0.3rem',
              fontSize: '0.75rem',
              width: 'clamp(120px, 18vw, 220px)',
              backgroundColor: 'var(--color-canvas)',
              borderRadius: 'var(--radius-xs)'
            }}
          />
        </form>

        <div className="desktop-only" style={{
          height: '16px',
          width: '1px',
          backgroundColor: 'var(--color-border-default)'
        }} />

        {/* User Role Switcher Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div
            className="font-mono"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.2rem 0.45rem',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--text-xs)'
            }}
          >
            <User size={13} color="var(--color-accent-orange)" />
            <select
              value={role || 'admin'}
              onChange={handleRoleChange}
              className="font-mono"
              style={{
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                fontSize: '0.725rem',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                outline: 'none'
              }}
              title="Switch user role to test permissions"
              aria-label="Active User Role Switcher"
            >
              <option value="admin">ADMIN</option>
              <option value="staff">STAFF</option>
              <option value="student">STUDENT</option>
            </select>
          </div>
        </div>

        {/* Technical UTC Clock */}
        <div className="font-mono desktop-only" style={{
          fontSize: '0.725rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          backgroundColor: 'var(--color-surface-subtle)',
          padding: '0.25rem 0.55rem',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-xs)',
          whiteSpace: 'nowrap'
        }}>
          {timeString || '00:00:00'}
        </div>
      </div>
    </header>
  );
}
