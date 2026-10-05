import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  maxWidth = '580px',
  accentEdge = false
}) {
  // Handle ESC key press
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
            backgroundColor: 'rgba(22, 24, 29, 0.65)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '100%',
              maxWidth,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-strong)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-panel)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top accent line */}
            <div style={{
              height: '3px',
              width: '100%',
              backgroundColor: accentEdge ? 'var(--color-accent-orange)' : 'var(--color-border-strong)'
            }} />

            {/* Header */}
            <div style={{
              padding: '0.85rem 1.15rem',
              backgroundColor: 'var(--color-surface-subtle)',
              borderBottom: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {Icon && <Icon size={16} strokeWidth={1.75} color="var(--color-accent-orange)" />}
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
                    <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '1px' }}>
                      {subtitle}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
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
                <X size={14} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div style={{
                padding: '0.85rem 1.25rem',
                borderTop: '1px solid var(--color-border-subtle)',
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
