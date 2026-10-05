import React from 'react';
import { Layers } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Layers,
  title = 'No Records Found',
  description = 'No matching items or sensor telemetry found in the database.',
  action,
  style = {}
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px dashed var(--color-border-default)',
        borderRadius: 'var(--radius-sm)',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '520px',
        margin: '1.5rem auto',
        ...style
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-xs)',
          backgroundColor: 'var(--color-surface-subtle)',
          border: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.85rem',
          color: 'var(--color-text-muted)'
        }}
      >
        <Icon size={22} strokeWidth={1.5} />
      </div>

      <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '0.35rem' }}>
        {title}
      </h3>

      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '380px', lineHeight: 1.45, marginBottom: action ? '1.25rem' : 0 }}>
        {description}
      </p>

      {action && <div>{action}</div>}
    </div>
  );
}
