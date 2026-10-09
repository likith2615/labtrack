import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, CheckCircle2, AlertCircle, ShieldAlert, Clock, ChevronDown } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { maintenanceApi } from '../../api/client';
import { useToast } from '../ui/Toast';

const SEVERITY_CONFIG = {
  high: { color: 'var(--color-status-damaged)', bg: 'var(--color-status-damaged-bg)', border: 'var(--color-status-damaged-border)', label: 'HIGH' },
  medium: { color: 'var(--color-status-allocated)', bg: 'var(--color-status-allocated-bg)', border: 'var(--color-status-allocated-border)', label: 'MEDIUM' },
  low: { color: 'var(--color-text-secondary)', bg: 'var(--color-surface-subtle)', border: 'var(--color-border-default)', label: 'LOW' }
};

export default function MaintenanceQueue({ tickets = [], onTicketUpdated }) {
  const [updatingId, setUpdatingId] = useState(null);
  const toast = useToast();

  const handleInlineStatusChange = async (ticketId, newStatus, assetTag) => {
    setUpdatingId(ticketId);
    try {
      await maintenanceApi.updateStatus(ticketId, newStatus);
      toast.success(
        `Ticket #${ticketId} status updated to ${newStatus.toUpperCase()}.${newStatus === 'resolved' ? ' Equipment restored to Available.' : ''}`,
        'Maintenance Queue Updated'
      );
      if (onTicketUpdated) {
        onTicketUpdated();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update maintenance ticket.', 'Update Error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="spec-sheet-panel" style={{ marginBottom: '1.75rem' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Wrench size={16} strokeWidth={1.75} color="var(--color-accent-orange)" />
          <span>Active Maintenance & Calibration Queue ({tickets.length})</span>
        </div>
        <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          INLINE STATUS DISPATCH
        </span>
      </div>

      <div className="panel-body" style={{ padding: 0 }}>
        {tickets.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
            <CheckCircle2 size={24} color="var(--color-status-available)" strokeWidth={1.75} style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Maintenance Queue Clear</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              No open fault reports or pending calibration tickets logged.
            </div>
          </div>
        ) : (
          <div className="spec-table-container" style={{ border: 'none' }}>
            <table className="spec-table">
              <thead>
                <tr>
                  <th>TICKET</th>
                  <th>EQUIPMENT</th>
                  <th>ISSUE DESCRIPTION</th>
                  <th>SEVERITY</th>
                  <th>REPORTED BY</th>
                  <th>REPORTED DATE</th>
                  <th style={{ textAlign: 'right' }}>INLINE DISPATCH STATUS</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {tickets.map((ticket) => {
                    const sev = SEVERITY_CONFIG[ticket.severity] || SEVERITY_CONFIG.medium;
                    const isUpdating = updatingId === ticket.id;

                    return (
                      <motion.tr
                        key={ticket.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {/* Ticket ID */}
                        <td className="font-mono" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                          #MNT-{String(ticket.id).padStart(3, '0')}
                        </td>

                        {/* Equipment Tag & Name */}
                        <td>
                          <Link
                            to={`/equipment/${ticket.equipment_id}`}
                            className="font-mono"
                            style={{
                              fontWeight: 700,
                              color: 'var(--color-text-primary)',
                              textDecoration: 'underline',
                              textDecorationColor: 'var(--color-accent-orange)'
                            }}
                          >
                            {ticket.asset_tag}
                          </Link>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '1px' }}>
                            {ticket.equipment_name}
                          </div>
                        </td>

                        {/* Issue Description */}
                        <td>
                          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, maxWidth: '240px' }}>
                            {ticket.issue_description}
                          </div>
                          {ticket.technician_notes && (
                            <div className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                              Note: {ticket.technician_notes}
                            </div>
                          )}
                        </td>

                        {/* Severity Badge */}
                        <td>
                          <span
                            className="font-mono"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0.15rem 0.45rem',
                              fontSize: '0.675rem',
                              fontWeight: 700,
                              borderRadius: 'var(--radius-xs)',
                              backgroundColor: sev.bg,
                              color: sev.color,
                              border: `1px solid ${sev.border}`
                            }}
                          >
                            {sev.label}
                          </span>
                        </td>

                        {/* Reported By */}
                        <td>
                          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                            {ticket.reporter_name || 'Lab Staff'}
                          </div>
                          <div className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)' }}>
                            {ticket.lab_name || 'Lab Facility'}
                          </div>
                        </td>

                        {/* Reported Date */}
                        <td className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                          {ticket.reported_on ? String(ticket.reported_on).slice(0, 10) : 'Recent'}
                        </td>

                        {/* Inline Status Selector */}
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <select
                              value={ticket.status}
                              disabled={isUpdating}
                              onChange={(e) => handleInlineStatusChange(ticket.id, e.target.value, ticket.asset_tag)}
                              className="font-mono"
                              style={{
                                padding: '0.3rem 1.8rem 0.3rem 0.55rem',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 700,
                                borderRadius: 'var(--radius-xs)',
                                border: '1px solid var(--color-border-default)',
                                backgroundColor:
                                  ticket.status === 'resolved'
                                    ? 'var(--color-status-available-bg)'
                                    : ticket.status === 'in_progress'
                                    ? 'var(--color-status-maintenance-bg)'
                                    : 'var(--color-status-damaged-bg)',
                                color:
                                  ticket.status === 'resolved'
                                    ? 'var(--color-status-available)'
                                    : ticket.status === 'in_progress'
                                    ? 'var(--color-status-maintenance)'
                                    : 'var(--color-status-damaged)',
                                cursor: isUpdating ? 'wait' : 'pointer'
                              }}
                            >
                              <option value="reported">REPORTED</option>
                              <option value="in_progress">IN PROGRESS</option>
                              <option value="resolved">RESOLVED</option>
                            </select>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
