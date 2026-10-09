import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Trash2, ShieldAlert, Check } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { equipmentApi } from '../../api/client';
import { useToast } from '../ui/Toast';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  equipment,
  onSuccess
}) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!equipment) return null;

  const isAllocated = equipment.status === 'allocated' || equipment.status === 'in_use';

  const handleDelete = async () => {
    setLoading(true);
    try {
      await equipmentApi.delete(equipment.id);
      toast.success(
        `Equipment [${equipment.asset_tag}] permanently decommissioned and deleted.`,
        'Asset Deleted'
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to delete equipment record.', 'Deletion Blocked');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      title="Confirm Asset Decommission & Deletion"
      subtitle={`INVENTORY TARGET: ${equipment.asset_tag}`}
      icon={AlertTriangle}
      accentEdge
      maxWidth="500px"
      footer={
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            loading={loading}
            disabled={isAllocated}
            onClick={handleDelete}
          >
            Confirm Permanent Delete
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          You are about to permanently delete laboratory instrument <strong>{equipment.name}</strong> from the system database.
        </p>

        {/* Spec Overview Box */}
        <div
          style={{
            padding: '0.85rem',
            backgroundColor: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xs)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          <div className="font-mono" style={{ fontSize: 'var(--text-xs)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>ASSET TAG:</span>
            <strong>{equipment.asset_tag}</strong>
          </div>
          <div className="font-mono" style={{ fontSize: 'var(--text-xs)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>SERIAL NO:</span>
            <strong>{equipment.serial_no || 'N/A'}</strong>
          </div>
          <div className="font-mono" style={{ fontSize: 'var(--text-xs)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>LAB LOCATION:</span>
            <strong>{equipment.lab_name || 'Assigned Facility'}</strong>
          </div>
        </div>

        {/* Safeguard Warning */}
        {isAllocated ? (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--color-status-damaged-bg)',
              border: '1px solid var(--color-status-damaged-border)',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem'
            }}
          >
            <ShieldAlert size={18} color="var(--color-status-damaged)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-status-damaged)', lineHeight: 1.4 }}>
              <strong>Deletion Blocked:</strong> This instrument currently has an active student or staff checkout. Return the item before removing it from inventory.
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.4
            }}
          >
            ⚠️ <em>All historical maintenance records and specifications associated with this equipment will be removed. This action cannot be reversed.</em>
          </div>
        )}
      </div>
    </Modal>
  );
}
