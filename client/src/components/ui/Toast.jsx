import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const typeConfig = {
  success: {
    icon: CheckCircle2,
    color: 'var(--color-status-available)',
    borderColor: 'var(--color-status-available-border)',
    bgColor: 'var(--color-surface)'
  },
  error: {
    icon: AlertCircle,
    color: 'var(--color-status-damaged)',
    borderColor: 'var(--color-status-damaged-border)',
    bgColor: 'var(--color-surface)'
  },
  warning: {
    icon: AlertTriangle,
    color: 'var(--color-status-allocated)',
    borderColor: 'var(--color-status-allocated-border)',
    bgColor: 'var(--color-surface)'
  },
  info: {
    icon: Info,
    color: 'var(--color-accent-orange)',
    borderColor: 'var(--color-accent-orange-border)',
    bgColor: 'var(--color-surface)'
  }
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, type, title, message };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    show: addToast,
    success: (message, title = 'Success') => addToast({ type: 'success', title, message }),
    error: (message, title = 'Error') => addToast({ type: 'error', title, message }),
    warning: (message, title = 'Warning') => addToast({ type: 'warning', title, message }),
    info: (message, title = 'Notice') => addToast({ type: 'info', title, message })
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Floating Toast Notification Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          right: '1.25rem',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          maxWidth: '380px',
          width: '100%',
          pointerEvents: 'none'
        }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => {
            const config = typeConfig[item.type] || typeConfig.info;
            const Icon = config.icon;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  pointerEvents: 'auto',
                  backgroundColor: config.bgColor,
                  border: `1px solid ${config.borderColor}`,
                  borderLeft: `4px solid ${config.color}`,
                  borderRadius: 'var(--radius-xs)',
                  boxShadow: 'var(--shadow-panel)',
                  padding: '0.75rem 0.95rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem'
                }}
              >
                <Icon size={16} strokeWidth={2} color={config.color} style={{ marginTop: '2px', flexShrink: 0 }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  {item.title && (
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: 'var(--text-xs)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: 'var(--color-text-primary)',
                      lineHeight: 1.2
                    }}>
                      {item.title}
                    </div>
                  )}
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    marginTop: item.title ? '2px' : '0',
                    lineHeight: 1.35
                  }}>
                    {item.message}
                  </div>
                </div>

                <button
                  onClick={() => removeToast(item.id)}
                  aria-label="Dismiss toast"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={13} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastProvider;
