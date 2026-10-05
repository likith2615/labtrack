import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Clock, AlertTriangle, Archive, FileText } from 'lucide-react';
import { equipmentApi } from '../../api/client';
import StatusBadge from '../common/StatusBadge';

export default function StatusDrawer({ equipment, isOpen, onClose, onSuccess }) {
  const [selectedStatus, setSelectedStatus] = useState(equipment?.status || 'available');
  const [statusNote, setStatusNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !equipment) return null;

  const statuses = [
    {
      id: 'available',
      label: 'Available (In Service)',
      desc: 'Calibrated, inspected, and ready for lab bench deployment or student sessions.',
      icon: CheckCircle,
      color: 'var(--status-available)'
    },
    {
      id: 'in_use',
      label: 'In Use (Allocated)',
      desc: 'Currently allocated to an ongoing experiment, course module, or research team.',
      icon: Clock,
      color: 'var(--status-inuse)'
    },
    {
      id: 'damaged',
      label: 'Damaged / Needs Service',
      desc: 'Defective channel, broken mechanical part, optical misalignment, or failed calibration.',
      icon: AlertTriangle,
      color: 'var(--status-damaged)'
    },
    {
      id: 'retired',
      label: 'Retired / Decommissioned',
      desc: 'Obsolete, scrapped for parts, or replaced by newer revision.',
      icon: Archive,
      color: 'var(--status-retired)'
    }
  ];

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      await equipmentApi.updateStatus(equipment.id, selectedStatus, statusNote.trim());
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to update status.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <motion.div
        className="drawer-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Drawer Header */}
        <div className="panel-header" style={{ padding: '1rem 1.25rem' }}>
          <div>
            <div className="panel-title" style={{ fontSize: '0.95rem' }}>
              Operational Status Transition
            </div>
            <div className="font-mono" style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              TAG: {equipment.asset_tag}
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.45rem' }}>
            <X size={16} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ padding: '1.25rem', flex: 1, overflowY: 'auto' }}>
          {/* Target Equipment Summary Box */}
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xs)',
            padding: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {equipment.name}
            </div>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Model: {equipment.model_number} • SN: {equipment.serial_number}
            </div>
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current:</span>
              <StatusBadge status={equipment.status} />
            </div>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'var(--status-damaged-bg)',
              border: '1px solid var(--status-damaged-border)',
              borderRadius: 'var(--radius-xs)',
              color: 'var(--status-damaged)',
              fontSize: '0.8rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <div className="form-label" style={{ marginBottom: '0.5rem' }}>
            Select Target Status
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
            {statuses.map((s) => {
              const Icon = s.icon;
              const isSelected = selectedStatus === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id)}
                  style={{
                    padding: '0.75rem 0.85rem',
                    border: `1px solid ${isSelected ? 'var(--text-primary)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: isSelected ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    transition: 'all var(--duration-fast) var(--ease-technical)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--text-primary)' : 'var(--border-default)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px',
                    backgroundColor: isSelected ? 'var(--text-primary)' : 'transparent'
                  }}>
                    {isSelected && <span style={{ width: '6px', height: '6px', backgroundColor: '#FFFFFF', borderRadius: '50%' }} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Icon size={14} color={s.color} strokeWidth={2} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {s.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', lineHeight: 1.35 }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="form-group">
            <label className="form-label">
              Transition Rationale / Audit Log Note
            </label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Assigned to EE301 Lab section B, bench 4"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Drawer Footer */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem'
        }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading || selectedStatus === equipment.status}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : 'Apply Status Change'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
