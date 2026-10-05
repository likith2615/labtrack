import React from 'react';

export default function SkeletonLoader({ count = 3, height = '48px', style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', ...style }}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="skeleton"
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
