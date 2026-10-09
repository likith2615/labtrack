import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Search,
  Plus,
  Calendar,
  CheckCircle2,
  Layers,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileText,
  User,
  AlertCircle
} from 'lucide-react';
import { maintenanceApi, equipmentApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import StatCounter from '../components/common/StatCounter';
import { OutOfOrderIllustration } from '../assets';

const SEVERITY_CONFIG = {
  high: { color: 'var(--color-status-damaged)', bg: 'var(--color-status-damaged-bg)', border: 'var(--color-status-damaged-border)', label: 'HIGH SEVERITY' },
  medium: { color: 'var(--color-status-allocated)', bg: 'var(--color-status-allocated-bg)', border: 'var(--color-status-allocated-border)', label: 'MEDIUM SEVERITY' },
  low: { color: 'var(--color-text-secondary)', bg: 'var(--color-surface-subtle)', border: 'var(--color-border-default)', label: 'LOW SEVERITY' }
};

export default function MaintenanceLogs() {
  const { user, isStudent, isStaff, isAdmin } = useAuth();
  const toast = useToast();

  const [logs, setLogs] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for Damage / Service Report
  const [reportData, setReportData] = useState({
    equipment_id: '',
    issue_description: '',
    severity: 'medium',
    technician_notes: ''
  });
  const [submittingReport, setSubmittingReport] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const [maintRes, eqRes] = await Promise.all([
        maintenanceApi.getAll(),
        equipmentApi.getAll({ limit: 100 })
      ]);
      setLogs(maintRes.data || []);
      setEquipmentList(eqRes.data || []);
      if (eqRes.data?.length > 0 && !reportData.equipment_id) {
        setReportData(prev => ({ ...prev, equipment_id: eqRes.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load maintenance records:', err);
      toast.error('Unable to fetch maintenance logs from server.', 'Connection Error');
    } finally {
      setLoading(false);
    }
  }, [toast, reportData.equipment_id]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await maintenanceApi.updateStatus(id, newStatus);
      toast.success(`Ticket #${id} status updated to ${newStatus.toUpperCase()}.`, 'Status Updated');
      fetchLogs();
    } catch (err) {
      toast.error(err.message || 'Failed to update ticket status.', 'Update Error');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!reportData.equipment_id || !reportData.issue_description.trim()) {
      setFormError('Equipment selection and fault description are required.');
      return;
    }

    setSubmittingReport(true);
    try {
      await maintenanceApi.report({
        equipment_id: Number(reportData.equipment_id),
        reported_by: user?.id || null,
        issue_description: reportData.issue_description.trim(),
        severity: reportData.severity,
        technician_notes: reportData.technician_notes.trim() || null
      });

      toast.success('Equipment damage report registered. Status set to Damaged.', 'Report Logged');
      setSubmittingReport(false);
      setIsModalOpen(false);
      setReportData({
        equipment_id: equipmentList[0]?.id || '',
        issue_description: '',
        severity: 'medium',
        technician_notes: ''
      });
      fetchLogs();
    } catch (err) {
      setSubmittingReport(false);
      setFormError(err.message || 'Failed to submit report.');
      toast.error(err.message || 'Failed to log damage report.', 'Submission Error');
    }
  };

  const filteredLogs = logs.filter(log => {
    if (selectedStatus !== 'all' && log.status !== selectedStatus) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        (log.equipment_name && log.equipment_name.toLowerCase().includes(q)) ||
        (log.asset_tag && log.asset_tag.toLowerCase().includes(q)) ||
        (log.reporter_name && log.reporter_name.toLowerCase().includes(q)) ||
        (log.issue_description && log.issue_description.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const reportedCount = logs.filter(l => l.status === 'reported').length;
  const inProgressCount = logs.filter(l => l.status === 'in_progress').length;
  const resolvedCount = logs.filter(l => l.status === 'resolved').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--color-border-default)'
        }}
      >
        <div>
          <div
            className="font-mono"
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              color: 'var(--color-accent-orange)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Wrench size={14} />
            <span>NIST CALIBRATION & SERVICE ARCHIVE</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>Laboratory Maintenance & Fault Logs</h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Traceable calibration events, diagnostic reports, equipment damage tickets, and technician dispatch queues.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          >
            {isStudent ? 'Report Equipment Fault' : 'Log Maintenance Event'}
          </Button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}
      >
        <div className="stat-card">
          <div className="stat-card-label">
            <span>TOTAL TICKETS</span>
            <FileText size={14} color="var(--color-text-muted)" />
          </div>
          <div className="stat-card-value font-mono">
            {loading ? '—' : <StatCounter value={logs.length} />}
          </div>
          <div className="stat-card-meta font-mono">Recorded across all facilities</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '3px solid var(--color-status-damaged)' }}>
          <div className="stat-card-label">
            <span>UNRESOLVED / REPORTED</span>
            <AlertTriangle size={14} color="var(--color-status-damaged)" />
          </div>
          <div className="stat-card-value font-mono" style={{ color: 'var(--color-status-damaged)' }}>
            {loading ? '—' : <StatCounter value={reportedCount} />}
          </div>
          <div className="stat-card-meta font-mono">Awaiting inspection</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '3px solid var(--color-status-maintenance)' }}>
          <div className="stat-card-label">
            <span>IN SERVICE / CALIBRATION</span>
            <Wrench size={14} color="var(--color-status-maintenance)" />
          </div>
          <div className="stat-card-value font-mono" style={{ color: 'var(--color-status-maintenance)' }}>
            {loading ? '—' : <StatCounter value={inProgressCount} />}
          </div>
          <div className="stat-card-meta font-mono">Technician actively servicing</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '3px solid var(--color-status-available)' }}>
          <div className="stat-card-label">
            <span>RESOLVED & RESTORED</span>
            <CheckCircle2 size={14} color="var(--color-status-available)" />
          </div>
          <div className="stat-card-value font-mono" style={{ color: 'var(--color-status-available)' }}>
            {loading ? '—' : <StatCounter value={resolvedCount} />}
          </div>
          <div className="stat-card-meta font-mono">Operational baseline confirmed</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="spec-sheet-panel"
        style={{
          padding: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {[
            { id: 'all', label: 'ALL TICKETS', count: logs.length },
            { id: 'reported', label: 'REPORTED', count: reportedCount },
            { id: 'in_progress', label: 'IN PROGRESS', count: inProgressCount },
            { id: 'resolved', label: 'RESOLVED', count: resolvedCount }
          ].map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className="font-mono"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.65rem',
                  fontSize: 'var(--text-xs)',
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: 'var(--radius-xs)',
                  border: `1px solid ${isActive ? 'var(--color-text-primary)' : 'var(--color-border-default)'}`,
                  backgroundColor: isActive ? 'var(--color-text-primary)' : 'var(--color-surface)',
                  color: isActive ? 'var(--color-canvas)' : 'var(--color-text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.22)' : 'var(--color-surface-muted)',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                    padding: '0.05rem 0.35rem',
                    borderRadius: '2px',
                    fontSize: '0.675rem',
                    fontWeight: 700
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            className="form-input font-mono"
            placeholder="Search ticket, asset, reporter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2rem', fontSize: 'var(--text-xs)', width: '100%' }}
          />
        </div>
      </div>

      {/* Logs Spec Table */}
      {loading ? (
        <Skeleton variant="table" rows={6} columns={7} />
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          illustration={<OutOfOrderIllustration width="180px" height="180px" />}
          title="No Maintenance Records Match Filter"
          description="No diagnostic tickets match your active status or search query."
          action={
            <Button variant="secondary" size="sm" onClick={() => { setSelectedStatus('all'); setSearchTerm(''); }}>
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="spec-table-container">
          <table className="spec-table">
            <thead>
              <tr>
                <th>TICKET</th>
                <th>ASSET / TAG</th>
                <th>FACILITY LAB</th>
                <th>FAULT / ISSUE DESCRIPTION</th>
                <th>SEVERITY</th>
                <th>REPORTED BY & DATE</th>
                <th>DISPATCH STATUS</th>
                {isStaff && <th style={{ textAlign: 'right' }}>STAFF ACTION</th>}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredLogs.map((log) => {
                  const sev = SEVERITY_CONFIG[log.severity] || SEVERITY_CONFIG.medium;

                  return (
                    <motion.tr
                      key={log.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td className="font-mono" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                        #MNT-{String(log.id).padStart(3, '0')}
                      </td>

                      <td>
                        <Link
                          to={`/equipment/${log.equipment_id}`}
                          className="font-mono"
                          style={{
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            textDecoration: 'underline',
                            textDecorationColor: 'var(--color-accent-orange)'
                          }}
                        >
                          {log.asset_tag}
                        </Link>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '1px' }}>
                          {log.equipment_name}
                        </div>
                      </td>

                      <td style={{ fontSize: 'var(--text-xs)', fontWeight: 500 }}>
                        {log.lab_name}
                      </td>

                      <td>
                        <div style={{ fontSize: 'var(--text-xs)', maxWidth: '280px', lineHeight: 1.4 }}>
                          {log.issue_description}
                        </div>
                        {log.technician_notes && (
                          <div className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)', marginTop: '3px' }}>
                            Notes: {log.technician_notes}
                          </div>
                        )}
                      </td>

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

                      <td>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                          {log.reporter_name || 'Campus Operator'}
                        </div>
                        <div className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)' }}>
                          {log.reported_on ? String(log.reported_on).slice(0, 10) : 'Recent'}
                        </div>
                      </td>

                      <td>
                        <Badge
                          status={
                            log.status === 'resolved'
                              ? 'available'
                              : log.status === 'in_progress'
                              ? 'under_maintenance'
                              : 'damaged'
                          }
                          size="sm"
                        >
                          {log.status?.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>

                      {isStaff && (
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <select
                            value={log.status}
                            onChange={(e) => handleStatusUpdate(log.id, e.target.value)}
                            className="font-mono"
                            style={{
                              padding: '0.25rem 1.6rem 0.25rem 0.45rem',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 700,
                              borderRadius: 'var(--radius-xs)',
                              border: '1px solid var(--color-border-default)',
                              backgroundColor: 'var(--color-surface)',
                              color: 'var(--color-text-primary)',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="reported">REPORTED</option>
                            <option value="in_progress">IN PROGRESS</option>
                            <option value="resolved">RESOLVED</option>
                          </select>
                        </td>
                      )}
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Report Damage / Maintenance Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Report Laboratory Equipment Damage"
        subtitle="Submit diagnostic ticket for hardware inspection & repair"
        icon={Wrench}
        accentEdge
        maxWidth="560px"
      >
        <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={15} strokeWidth={2} />
              <span>{formError}</span>
            </div>
          )}

          <Select
            label="Select Faulty Equipment *"
            value={reportData.equipment_id}
            onChange={(e) => setReportData(p => ({ ...p, equipment_id: e.target.value }))}
            required
            mono
          >
            {equipmentList.map((eq) => (
              <option key={eq.id} value={eq.id}>
                [{eq.asset_tag}] {eq.name} ({eq.lab_name})
              </option>
            ))}
          </Select>

          <Select
            label="Estimated Severity Level *"
            value={reportData.severity}
            onChange={(e) => setReportData(p => ({ ...p, severity: e.target.value }))}
            required
            mono
          >
            <option value="low">Low (Cosmetic / minor calibration drift)</option>
            <option value="medium">Medium (Partial function lost / faulty port)</option>
            <option value="high">High (Complete unit failure / safety hazard)</option>
          </Select>

          <div>
            <label style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Observed Symptom / Issue Description *
            </label>
            <textarea
              required
              rows={3}
              className="form-textarea"
              placeholder="Detail observed issue (e.g. Channel 2 DC offset drift, broken connector, screen flicker...)"
              value={reportData.issue_description}
              onChange={(e) => setReportData(p => ({ ...p, issue_description: e.target.value }))}
            />
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Technician Notes / Bench Location (Optional)
            </label>
            <textarea
              rows={2}
              className="form-textarea font-mono"
              placeholder="e.g. Bench #3, North wall. NIST Traceable Calibration cert #9921."
              value={reportData.technician_notes}
              onChange={(e) => setReportData(p => ({ ...p, technician_notes: e.target.value }))}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-subtle)' }}>
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submittingReport}>
              Submit Damage Report
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
