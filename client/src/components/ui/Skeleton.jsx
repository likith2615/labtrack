import React from 'react';

export default function Skeleton({
  variant = 'box',
  width = '100%',
  height = '38px',
  count = 1,
  rows = 3,
  columns = 4,
  style = {},
  className = ''
}) {
  if (variant === 'table') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', ...style }}>
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '0.75rem' }}>
            {Array.from({ length: columns }).map((_, cIdx) => (
              <div
                key={cIdx}
                className="skeleton-shimmer"
                style={{
                  height: '36px',
                  borderRadius: 'var(--radius-xs)',
                  opacity: 0.85
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width, ...style }}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="skeleton-shimmer"
            style={{
              height: height || '14px',
              width: idx === count - 1 && count > 1 ? '70%' : '100%',
              borderRadius: 'var(--radius-xs)'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width, ...style }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`skeleton-shimmer ${className}`}
          style={{
            height,
            width: '100%',
            borderRadius: 'var(--radius-xs)'
          }}
        />
      ))}
    </div>
  );
}
