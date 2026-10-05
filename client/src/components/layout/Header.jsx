import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Search, Activity, ShieldCheck, Database } from 'lucide-react';
import { healthApi } from '../../api/client';

export default function Header({ onQuickSearch }) {
  const [timeString, setTimeString] = useState('');
  const [dbStatus, setDbStatus] = useState({ driver: 'Connecting...', active: false });
  const [searchVal, setSearchVal] = useState('');
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
          driver: res.database?.driver || 'Active',
          active: true
        });
      })
      .catch(() => {
        setDbStatus({ driver: 'Offline / Standalone', active: false });
      });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/equipment?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <header style={{
      height: 'var(--header-height)',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--status-available)',
            borderRadius: '50%',
            display: 'inline-block'
          }} />
          <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            SYSTEM ONLINE
          </span>
        </div>

        <div style={{
          height: '16px',
          width: '1px',
          backgroundColor: 'var(--border-default)'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <Database size={13} strokeWidth={1.75} style={{ opacity: 0.7 }} />
          <span className="font-mono" style={{ fontSize: '0.725rem' }}>{dbStatus.driver}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
          <Search size={14} strokeWidth={1.75} style={{
            position: 'absolute',
            left: '0.65rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            className="form-input font-mono"
            placeholder="Search asset ID, model, SN..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            style={{
              paddingLeft: '2rem',
              paddingTop: '0.35rem',
              paddingBottom: '0.35rem',
              fontSize: '0.775rem',
              width: '260px',
              backgroundColor: 'var(--bg-canvas)'
            }}
          />
        </form>

        <div style={{
          height: '16px',
          width: '1px',
          backgroundColor: 'var(--border-default)'
        }} />

        <div className="font-mono" style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          backgroundColor: 'var(--bg-subtle)',
          padding: '0.25rem 0.6rem',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xs)'
        }}>
          {timeString || '00:00:00'}
        </div>
      </div>
    </header>
  );
}
