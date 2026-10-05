import React from 'react';
import { motion } from 'framer-motion';

const statusConfig = {
  available: {
    label: 'AVAILABLE',
    className: 'status-available',
    pulse: true
  },
  in_use: {
    label: 'IN USE',
    className: 'status-inuse',
    pulse: false
  },
  damaged: {
    label: 'DAMAGED',
    className: 'status-damaged',
    pulse: false
  },
  retired: {
    label: 'RETIRED',
    className: 'status-retired',
    pulse: false
  }
};

export default function StatusBadge({ status, size = 'md' }) {
  const normalized = (status || 'available').toLowerCase();
  const config = statusConfig[normalized] || statusConfig.available;

  return (
    <motion.span
      className={`status-badge ${config.className} ${size === 'sm' ? 'text-xs' : ''}`}
      layout
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="indicator-dot" />
      <span>{config.label}</span>
    </motion.span>
  );
}
