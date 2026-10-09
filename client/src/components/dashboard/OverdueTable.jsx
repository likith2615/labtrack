import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, ArrowDownLeft, CheckCircle2, User } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { allocationsApi } from '../../api/client';
import { useToast } from '../ui/Toast';

export default function OverdueTable({ overdueItems = [], onAllocationReturned }) {
  const [returningId, setReturningId] = useState(null);
  const toast = useToast();

  const handleReturn = async (allocationId, assetTag) => {
    setReturningId(allocationId);
    try {
      await allocationsApi.returnItem(allocationId);
      toast.success(
        `Equipment [${assetTag}] checked in and marked Available.`,
        'Loan Returned'
      );
      if (onAllocationReturned) {
        onAllocationReturned();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to process return.', 'Return Error');
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="spec-sheet-panel accent-edge" style={{ marginBottom: '1.75rem' }}>
      <div className="panel-header" style={{ backgroundColor: overdueItems.length > 0 ? 'var(--color-status-damaged-bg)' : 'var(--color-surface-subtle)' }}>
        <div className="panel-title" style={{ color: overdueItems.length > 0 ? 'var(--color-status-damaged)' : 'var(--color-text-primary)' }}>
          <AlertTriangle size={16} strokeWidth={2} />
          <span>Overdue Allocation Checkouts ({overdueItems.length})</span>
        </div>
        <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          DUE DATE PAST COMMISSION PERIOD
        </span>
      </div>

      <div className="panel-body" style={{ padding: 0 }}>
        {overdueItems.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
            <CheckCircle2 size={24} color="var(--color-status-available)" strokeWidth={1.75} style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>No Overdue Checkouts</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              All borrowed student and staff hardware items are within scheduled due periods.
            </div>
          </div>
        ) : (
          <div className="spec-table-container" style={{ border: 'none' }}>
            <table className="spec-table">
              <thead>
                <tr>
                  <th>ASSET TAG</th>
                  <th>INSTRUMENT NAME</th>
                  <th>BORROWER / RECIPIENT</th>
                  <th>LAB FACILITY</th>
                  <th>DUE DATE & OVERDUE</th>
                  <th>PURPOSE</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {overdueItems.map((item) => (
                    <motion.tr
                      key={item.allocation_id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <Link
                          to={`/equipment/${item.equipment_id}`}
                          className="font-mono"
                          style={{
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            textDecoration: 'underline',
                            textDecorationColor: 'var(--color-accent-orange)'
                          }}
                        >
                          {item.asset_tag}
                        </Link>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{item.equipment_name}</div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <User size={13} color="var(--color-text-muted)" />
                          <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>{item.borrower_name}</span>
                        </div>
                        <div className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)', marginTop: '1px' }}>
                          {item.borrower_email} • [{item.borrower_role || 'student'}]
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500 }}>{item.lab_name}</div>
                      </td>

                      <td>
                        <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-status-damaged)' }}>
                          {item.due_date ? String(item.due_date).slice(0, 10) : 'N/A'}
                        </div>
                        <div
                          className="font-mono"
                          style={{
                            display: 'inline-block',
                            backgroundColor: 'var(--color-status-damaged-bg)',
                            border: '1px solid var(--color-status-damaged-border)',
                            color: 'var(--color-status-damaged)',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '2px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            marginTop: '2px'
                          }}
                        >
                          +{item.days_overdue || 1} DAYS OVERDUE
                        </div>
                      </td>

                      <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', maxWidth: '180px' }}>
                        {item.purpose || 'Laboratory experiment loan'}
                      </td>

                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={ArrowDownLeft}
                          loading={returningId === item.allocation_id}
                          onClick={() => handleReturn(item.allocation_id, item.asset_tag)}
                          style={{ padding: '0.3rem 0.6rem' }}
                        >
                          Return Asset
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
