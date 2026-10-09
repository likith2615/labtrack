import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Calendar,
  User,
  Layers,
  PlusCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { allocationsApi, equipmentApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';

export default function AllocationsPanel({
  allocations = [],
  availableEquipment = [],
  onAllocationChange
}) {
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'checkout'
  const [returningId, setReturningId] = useState(null);
  const [submittingCheckout, setSubmittingCheckout] = useState(false);
  const { availableUsers } = useAuth();
  const toast = useToast();

  // Form State for New Checkout
  const [formData, setFormData] = useState({
    equipment_id: '',
    user_id: availableUsers[2]?.id || 3, // Student default
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    purpose: 'Undergraduate Laboratory Practicum experiment'
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (availableEquipment.length > 0 && !formData.equipment_id) {
      setFormData((prev) => ({ ...prev, equipment_id: availableEquipment[0].id }));
    }
  }, [availableEquipment, formData.equipment_id]);

  const activeLoans = allocations.filter((a) => a.returned_on === null);

  const handleReturn = async (allocationId, assetTag) => {
    setReturningId(allocationId);
    try {
      await allocationsApi.returnItem(allocationId);
      toast.success(
        `Equipment [${assetTag}] returned successfully to laboratory inventory.`,
        'Loan Checked In'
      );
      if (onAllocationChange) onAllocationChange();
    } catch (err) {
      toast.error(err.message || 'Failed to process return.', 'Return Error');
    } finally {
      setReturningId(null);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.equipment_id) {
      setFormError('Please select an available equipment item.');
      return;
    }

    setSubmittingCheckout(true);
    try {
      await allocationsApi.create({
        equipment_id: Number(formData.equipment_id),
        user_id: Number(formData.user_id),
        due_date: formData.due_date,
        purpose: formData.purpose.trim()
      });

      toast.success(
        `Equipment checked out and status set to Allocated.`,
        'Allocation Successful'
      );
      setSubmittingCheckout(false);
      setActiveTab('active');
      if (onAllocationChange) onAllocationChange();
    } catch (err) {
      setSubmittingCheckout(false);
      setFormError(err.message || 'Checkout failed. Verify equipment availability.');
      toast.error(err.message || 'Failed to allocate equipment.', 'Checkout Error');
    }
  };

  return (
    <div className="spec-sheet-panel" style={{ marginBottom: '1.75rem' }}>
      {/* Header & Tabs */}
      <div
        className="panel-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div className="panel-title">
          <Clock size={16} strokeWidth={1.75} color="var(--color-accent-orange)" />
          <span>Equipment Allocation & Circulation Desk</span>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-xs)',
            overflow: 'hidden'
          }}
        >
          <button
            onClick={() => setActiveTab('active')}
            className="font-mono"
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: 'var(--text-xs)',
              fontWeight: activeTab === 'active' ? 700 : 500,
              backgroundColor: activeTab === 'active' ? 'var(--color-text-primary)' : 'transparent',
              color: activeTab === 'active' ? 'var(--color-canvas)' : 'var(--color-text-secondary)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>Active Loans</span>
            <span
              style={{
                backgroundColor: activeTab === 'active' ? 'rgba(255,255,255,0.25)' : 'var(--color-surface-subtle)',
                padding: '0.05rem 0.35rem',
                borderRadius: '2px',
                fontSize: '0.675rem'
              }}
            >
              {activeLoans.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('checkout')}
            className="font-mono"
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: 'var(--text-xs)',
              fontWeight: activeTab === 'checkout' ? 700 : 500,
              backgroundColor: activeTab === 'checkout' ? 'var(--color-text-primary)' : 'transparent',
              color: activeTab === 'checkout' ? 'var(--color-canvas)' : 'var(--color-text-secondary)',
              border: 'none',
              borderLeft: '1px solid var(--color-border-default)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <PlusCircle size={13} />
            <span>New Checkout</span>
          </button>
        </div>
      </div>

      <div className="panel-body">
        {activeTab === 'active' ? (
          /* Active Loans Ledger */
          activeLoans.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
              <CheckCircle2 size={24} color="var(--color-status-available)" strokeWidth={1.75} style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>No Equipment Currently Checked Out</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                All lab hardware is present in designated laboratory rooms.
              </div>
            </div>
          ) : (
            <div className="spec-table-container" style={{ border: 'none' }}>
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>ASSET TAG</th>
                    <th>EQUIPMENT NAME</th>
                    <th>BORROWER (USER)</th>
                    <th>LAB LOCATION</th>
                    <th>ALLOCATED ON</th>
                    <th>SCHEDULED DUE</th>
                    <th>PURPOSE</th>
                    <th style={{ textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {activeLoans.map((loan) => {
                      const isOverdue = new Date(loan.due_date) < new Date();
                      return (
                        <motion.tr
                          key={loan.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <td className="font-mono" style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {loan.asset_tag}
                          </td>

                          <td style={{ fontWeight: 600 }}>{loan.equipment_name}</td>

                          <td>
                            <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>{loan.user_name}</div>
                            <div className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)' }}>
                              {loan.user_email} • [{loan.user_role || 'student'}]
                            </div>
                          </td>

                          <td style={{ fontSize: 'var(--text-xs)' }}>{loan.lab_name}</td>

                          <td className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                            {loan.allocated_on ? String(loan.allocated_on).slice(0, 10) : 'Recent'}
                          </td>

                          <td>
                            <div
                              className="font-mono"
                              style={{
                                fontSize: 'var(--text-xs)',
                                fontWeight: 700,
                                color: isOverdue ? 'var(--color-status-damaged)' : 'var(--color-text-primary)'
                              }}
                            >
                              {loan.due_date ? String(loan.due_date).slice(0, 10) : 'N/A'}
                            </div>
                            {isOverdue && (
                              <span
                                className="font-mono"
                                style={{
                                  display: 'inline-block',
                                  fontSize: '0.65rem',
                                  color: 'var(--color-status-damaged)',
                                  fontWeight: 700
                                }}
                              >
                                OVERDUE
                              </span>
                            )}
                          </td>

                          <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', maxWidth: '160px' }}>
                            {loan.purpose}
                          </td>

                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={ArrowDownLeft}
                              loading={returningId === loan.id}
                              onClick={() => handleReturn(loan.id, loan.asset_tag)}
                              style={{ padding: '0.25rem 0.55rem' }}
                            >
                              Return
                            </Button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* New Checkout Form */
          <form onSubmit={handleCheckoutSubmit} style={{ maxWidth: '620px', margin: '0 auto' }}>
            {formError && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--color-status-damaged-bg)',
                  border: '1px solid var(--color-status-damaged-border)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--color-status-damaged)',
                  fontSize: 'var(--text-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}
              >
                <AlertCircle size={15} strokeWidth={2} />
                <span>{formError}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
              {/* Equipment Selector */}
              <Select
                label="Select Available Instrument *"
                value={formData.equipment_id}
                onChange={(e) => setFormData((p) => ({ ...p, equipment_id: e.target.value }))}
                required
                mono
              >
                {availableEquipment.length === 0 ? (
                  <option value="">No units currently available for loan</option>
                ) : (
                  availableEquipment.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      [{eq.asset_tag}] {eq.name} ({eq.lab_name})
                    </option>
                  ))
                )}
              </Select>

              {/* Borrower User Selector */}
              <Select
                label="Borrower Identity *"
                value={formData.user_id}
                onChange={(e) => setFormData((p) => ({ ...p, user_id: e.target.value }))}
                required
              >
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role.toUpperCase()})
                  </option>
                ))}
              </Select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                type="date"
                label="Return Due Date *"
                mono
                required
                value={formData.due_date}
                onChange={(e) => setFormData((p) => ({ ...p, due_date: e.target.value }))}
              />

              {/* Quick Due Date Presets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                  Quick Preset
                </label>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {[
                    { label: '+3 Days', days: 3 },
                    { label: '+7 Days', days: 7 },
                    { label: '+14 Days', days: 14 }
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => {
                        const d = new Date(Date.now() + preset.days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
                        setFormData((p) => ({ ...p, due_date: d }));
                      }}
                      className="font-mono"
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        fontSize: 'var(--text-xs)',
                        border: '1px solid var(--color-border-default)',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--color-surface-subtle)',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Input
              label="Purpose of Allocation / Project Ref"
              placeholder="e.g. Senior Capstone Project / Microwave Antenna Practicum"
              value={formData.purpose}
              onChange={(e) => setFormData((p) => ({ ...p, purpose: e.target.value }))}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="secondary" type="button" onClick={() => setActiveTab('active')}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                icon={ArrowUpRight}
                loading={submittingCheckout}
                disabled={availableEquipment.length === 0}
              >
                Checkout Allocation
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
