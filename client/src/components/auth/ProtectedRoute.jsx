import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, UserCheck, ArrowRight, Lock, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function ProtectedRoute({ children, requiredRole = null, fallback }) {
  const { user, role, isAuthenticated, loading, switchDemoRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
          <span className="status-pulse-dot" style={{ backgroundColor: 'var(--color-accent-orange)' }} />
          <span>VERIFYING SECURITY AUTHORIZATION TOKEN...</span>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to /login keeping the current route as origin
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role or array of roles is required, verify permission
  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole.includes(role) : role === requiredRole;

    if (!allowed) {
      if (fallback) return fallback;

      return (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: '580px',
            margin: '3rem auto',
            padding: '2.25rem',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            borderLeft: '4px solid var(--color-status-damaged)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-panel)',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--color-status-damaged-bg)',
              border: '1px solid var(--color-status-damaged-border)',
              color: 'var(--color-status-damaged)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}
          >
            <Lock size={24} strokeWidth={2} />
          </div>

          <div
            className="font-mono"
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              color: 'var(--color-status-damaged)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.35rem'
            }}
          >
            SECURITY ENFORCEMENT & ROLE PRIVILEGE
          </div>

          <h2 style={{ fontSize: 'var(--text-xl)', margin: '0 0 0.5rem 0' }}>
            Restricted Administrative Operation
          </h2>

          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            You are signed in as <strong>{user?.name}</strong> with role{' '}
            <span className="font-mono" style={{ textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              [{role}]
            </span>
            . This laboratory module requires <strong>{Array.isArray(requiredRole) ? requiredRole.join(' / ').toUpperCase() : requiredRole.toUpperCase()}</strong> authority.
          </p>

          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              textAlign: 'left'
            }}
          >
            <div>
              <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                QUICK ELEVATE (DEVELOPMENT)
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Auto-switch to Dr. Arthur Vance (Admin) to test full management authority.
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={UserCheck}
              onClick={() => switchDemoRole('admin')}
            >
              Elevate
            </Button>
          </div>
        </motion.div>
      );
    }
  }

  return children;
}
