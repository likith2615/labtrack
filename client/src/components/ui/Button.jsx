import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variantStyles = {
  primary: {
    backgroundColor: 'var(--color-accent-orange)',
    color: '#FFFFFF',
    borderColor: 'var(--color-accent-orange)',
    hoverBg: 'var(--color-accent-orange-hover)',
    hoverBorder: 'var(--color-accent-orange-hover)'
  },
  secondary: {
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    borderColor: 'var(--color-border-default)',
    hoverBg: 'var(--color-surface-subtle)',
    hoverBorder: 'var(--color-text-primary)'
  },
  dark: {
    backgroundColor: 'var(--color-text-primary)',
    color: 'var(--color-canvas)',
    borderColor: 'var(--color-text-primary)',
    hoverBg: 'var(--color-border-dark)',
    hoverBorder: 'var(--color-border-dark)'
  },
  danger: {
    backgroundColor: 'var(--color-status-damaged)',
    color: '#FFFFFF',
    borderColor: 'var(--color-status-damaged)',
    hoverBg: '#B91C1C',
    hoverBorder: '#B91C1C'
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    borderColor: 'transparent',
    hoverBg: 'var(--color-surface-subtle)',
    hoverBorder: 'var(--color-border-subtle)'
  }
};

const sizeStyles = {
  sm: {
    padding: '0.35rem 0.65rem',
    fontSize: 'var(--text-xs)',
    gap: '0.35rem'
  },
  md: {
    padding: '0.55rem 0.95rem',
    fontSize: 'var(--text-base)',
    gap: '0.5rem'
  },
  lg: {
    padding: '0.75rem 1.25rem',
    fontSize: 'var(--text-md)',
    gap: '0.65rem'
  }
};

export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  style = {},
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) {
  const currentVariant = variantStyles[variant] || variantStyles.secondary;
  const currentSize = sizeStyles[size] || sizeStyles.md;
  const shouldReduceMotion = useReducedMotion();

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled || shouldReduceMotion ? {} : { y: -1, transition: { duration: 0.15 } }}
      whileTap={isDisabled || shouldReduceMotion ? {} : { y: 1, transition: { duration: 0.08 } }}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: fullWidth ? '100%' : 'auto',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        borderRadius: 'var(--radius-xs)',
        border: `1px solid ${currentVariant.borderColor}`,
        backgroundColor: currentVariant.backgroundColor,
        color: currentVariant.color,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.55 : 1,
        transition: 'background-color var(--duration-fast) var(--ease-technical), border-color var(--duration-fast) var(--ease-technical), box-shadow var(--duration-fast) var(--ease-technical)',
        lineHeight: 1.2,
        userSelect: 'none',
        ...currentSize,
        ...style
      }}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 12 : 15} className="animate-spin" style={{ animation: shouldReduceMotion ? 'none' : 'spin 1s linear infinite' }} />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 13 : 15} strokeWidth={1.75} />
      )}

      {children && <span>{children}</span>}

      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={size === 'sm' ? 13 : 15} strokeWidth={1.75} />
      )}
    </motion.button>
  );
}
