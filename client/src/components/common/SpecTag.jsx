import React from 'react';

export default function SpecTag({ label, value, icon: Icon }) {
  return (
    <span className="spec-tag" title={label ? `${label}: ${value}` : value}>
      {Icon && <Icon size={12} strokeWidth={1.75} style={{ marginRight: '4px', opacity: 0.7 }} />}
      {label && <span style={{ opacity: 0.65, marginRight: '4px' }}>{label}:</span>}
      <span>{value}</span>
    </span>
  );
}
