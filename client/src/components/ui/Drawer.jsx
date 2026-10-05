import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  maxWidth = '460px'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(22, 24, 29, 0.6)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 1050
          }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '100%',
              maxWidth,
              height: '100%',
              backgroundColor: 'var(--color-surface)',
              borderLeft: '1px solid var(--color-border-strong)',
              boxShadow: 'var(--shadow-panel)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Drawer Header */}
            <div style={{
              padding: '1rem 1.25rem',
              backgroundColor: 'var(--color-surface-subtle)',
              borderBottom: '1px solid var(--color-border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {Icon && <Icon size={17} strokeWidth={1.75} color="var(--color-accent-orange)" />}
                <div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-md)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--color-text-primary)'
                  }}>
                    {title}
                  </div>
                  {subtitle && (
                    <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {subtitle}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close drawer"
                style={{
                  background: 'none',
                  border: '1px solid var(--color-border-default)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)',
                  borderRadius: 'var(--radius-xs)',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
              {children}
            </div>

            {/* Drawer Footer */}
            {footer && (
              <div style={{
                padding: '1rem 1.25rem',
                borderTop: '1px solid var(--color-border-default)',
                backgroundColor: 'var(--color-surface-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem'
              }}>
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
