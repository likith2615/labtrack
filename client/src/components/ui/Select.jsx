import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

export default function Select({
  label,
  error,
  helperText,
  options = [],
  mono = false,
  required = false,
  disabled = false,
  id,
  className = '',
  style = {},
  selectStyle = {},
  children,
  ...props
}) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.9rem', width: '100%', ...style }}>
      {label && (
        <label
          htmlFor={selectId}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: error ? 'var(--color-status-damaged)' : 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{label} {required && <strong style={{ color: 'var(--color-accent-orange)' }}>*</strong>}</span>
        </label>
      )}

      <div style={{ position: 'relative', width: '100%' }}>
        <select
          id={selectId}
          disabled={disabled}
          required={required}
          style={{
            width: '100%',
            padding: '0.55rem 2rem 0.55rem 0.75rem',
            fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
            fontSize: mono ? 'var(--text-sm)' : 'var(--text-base)',
            color: 'var(--color-text-primary)',
            backgroundColor: disabled ? 'var(--color-surface-subtle)' : 'var(--color-surface)',
            border: `1px solid ${error ? 'var(--color-status-damaged)' : 'var(--color-border-default)'}`,
            borderRadius: 'var(--radius-xs)',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            boxSizing: 'border-box',
            ...selectStyle
          }}
          className={`form-select ${mono ? 'font-mono' : ''} ${className}`}
          {...props}
        >
          {children || options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const text = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val} disabled={opt.disabled}>
                {text}
              </option>
            );
          })}
        </select>

        <ChevronDown
          size={14}
          strokeWidth={2}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {error ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-status-damaged)',
          marginTop: '0.15rem'
        }}>
          <AlertCircle size={12} strokeWidth={2} />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
