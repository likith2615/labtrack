import React from 'react';
import { motion } from 'framer-motion';

const statusMap = {
  available: {
    label: 'AVAILABLE',
    color: 'var(--color-status-available)',
    bg: 'var(--color-status-available-bg)',
    border: 'var(--color-status-available-border)',
    pulse: true
  },
  allocated: {
    label: 'ALLOCATED',
    color: 'var(--color-status-allocated)',
    bg: 'var(--color-status-allocated-bg)',
    border: 'var(--color-status-allocated-border)',
    pulse: false
  },
  in_use: {
    label: 'IN USE',
    color: 'var(--color-status-allocated)',
    bg: 'var(--color-status-allocated-bg)',
    border: 'var(--color-status-allocated-border)',
    pulse: false
  },
  under_maintenance: {
    label: 'IN SERVICE',
    color: 'var(--color-status-maintenance)',
    bg: 'var(--color-status-maintenance-bg)',
    border: 'var(--color-status-maintenance-border)',
    pulse: true
  },
  damaged: {
    label: 'DAMAGED',
    color: 'var(--color-status-damaged)',
    bg: 'var(--color-status-damaged-bg)',
    border: 'var(--color-status-damaged-border)',
    pulse: false
  },
  retired: {
    label: 'RETIRED',
    color: 'var(--color-status-retired)',
    bg: 'var(--color-status-retired-bg)',
    border: 'var(--color-status-retired-border)',
    pulse: false
  }
};

export default function Badge({
  children,
  status,
  variant = 'default',
  size = 'md',
  icon: Icon,
  style = {},
  className = ''
}) {
  // If status is provided, render strict status badge
  if (status) {
    const config = statusMap[status.toLowerCase()] || statusMap.available;
    const isSm = size === 'sm';

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: isSm ? '0.15rem 0.45rem' : '0.22rem 0.6rem',
          fontFamily: 'var(--font-mono)',
          fontSize: isSm ? '0.675rem' : '0.725rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          borderRadius: 'var(--radius-xs)',
          border: `1px solid ${config.border}`,
          backgroundColor: config.bg,
          color: config.color,
          lineHeight: 1.2,
          ...style
        }}
        className={className}
      >
        <span
          className={config.pulse ? 'status-pulse-dot' : ''}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: config.color,
            flexShrink: 0
          }}
        />
        <span>{children || config.label}</span>
      </span>
    );
  }

  // General Spec / Category Badge Variants
  const isSm = size === 'sm';
  let badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: isSm ? '0.15rem 0.45rem' : '0.25rem 0.55rem',
    fontFamily: 'var(--font-mono)',
    fontSize: isSm ? '0.7rem' : '0.75rem',
    borderRadius: 'var(--radius-xs)',
    lineHeight: 1.2,
    border: '1px solid var(--color-border-default)',
    backgroundColor: 'var(--color-surface-subtle)',
    color: 'var(--color-text-primary)',
    ...style
  };

  if (variant === 'orange') {
    badgeStyle = {
      ...badgeStyle,
      backgroundColor: 'var(--color-accent-orange-subtle)',
      borderColor: 'var(--color-accent-orange-border)',
      color: 'var(--color-accent-orange)',
      fontWeight: 600
    };
  } else if (variant === 'dark') {
    badgeStyle = {
      ...badgeStyle,
      backgroundColor: 'var(--color-surface-dark)',
      borderColor: 'var(--color-surface-dark)',
      color: 'var(--color-text-inverse)'
    };
  }

  return (
    <span style={badgeStyle} className={className}>
      {Icon && <Icon size={isSm ? 11 : 13} strokeWidth={1.75} style={{ opacity: 0.75 }} />}
      <span>{children}</span>
    </span>
  );
}
