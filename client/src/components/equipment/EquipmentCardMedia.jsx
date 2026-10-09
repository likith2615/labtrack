import React, { useState } from 'react';
import { getCategoryIllustration } from '../../assets';

/**
 * EquipmentCardMedia:
 * Displays the real uploaded photo with .duotone and .halftone retro printmaking treatment
 * when image_url exists; otherwise falls back to the hand-crafted risograph SVG category illustration.
 */
export default function EquipmentCardMedia({
  equipment,
  aspectRatio = '16/9',
  height = '140px',
  className = '',
  style = {}
}) {
  const [imgError, setImgError] = useState(false);

  const hasPhoto = Boolean(equipment?.image_url) && !imgError;
  const categoryIdentifier = equipment?.category_id || equipment?.category_name || 1;

  if (hasPhoto) {
    return (
      <div
        className={`retro-media-frame duotone halftone ${className}`}
        style={{
          width: '100%',
          height,
          aspectRatio,
          backgroundColor: 'var(--color-surface-subtle)',
          ...style
        }}
      >
        <img
          src={equipment.image_url}
          alt={equipment.name || 'Laboratory Hardware Asset'}
          onError={() => setImgError(true)}
          loading="lazy"
        />
        {/* Technical Asset Tag watermark in corner */}
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            bottom: '6px',
            right: '8px',
            backgroundColor: 'rgba(22, 24, 29, 0.85)',
            color: '#FFFFFF',
            fontSize: '0.625rem',
            fontWeight: 700,
            padding: '2px 5px',
            borderRadius: '2px',
            zIndex: 4,
            letterSpacing: '0.04em'
          }}
        >
          {equipment.asset_tag || 'IMG_ATTACHED'}
        </div>
      </div>
    );
  }

  // Risograph Vector SVG Illustration fallback
  return (
    <div
      className={`retro-media-frame ${className}`}
      style={{
        width: '100%',
        height,
        backgroundColor: 'var(--color-surface-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)',
        padding: '0.5rem',
        ...style
      }}
    >
      {getCategoryIllustration(categoryIdentifier, {
        width: '100%',
        height: '100%',
        style: { maxHeight: height }
      })}
    </div>
  );
}
