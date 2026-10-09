import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Wrench,
  RefreshCw,
  Trash2,
  Building2,
  Calendar,
  ShieldCheck,
  Tag,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Cpu,
  Layers,
  MapPin,
  User,
  Barcode,
  ExternalLink
} from 'lucide-react';
import { equipmentApi, maintenanceApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal';
import EquipmentFormModal from '../components/dashboard/EquipmentFormModal';
import EquipmentCardMedia from '../components/equipment/EquipmentCardMedia';

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isStaff, isAdmin, isStudent, user } = useAuth();
  const toast = useToast();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Damage report state
  const [reportText, setReportText] = useState('');
  const [reportSeverity, setReportSeverity] = useState('medium');
  const [submittingReport, setSubmittingReport] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await equipmentApi.getById(id);
      setEquipment(res.data);
    } catch (err) {
      setError(err.message || 'Equipment item not found.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleReportDamage = async (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    setSubmittingReport(true);
    try {
      await maintenanceApi.report({
        equipment_id: Number(id),
        reported_by: user?.id || null,
        issue_description: reportText.trim(),
        severity: reportSeverity
      });
      toast.success('Damage report submitted. Equipment flagged as Damaged.', 'Report Logged');
      setIsReportModalOpen(false);
      setReportText('');
      fetchDetail();
    } catch (err) {
      toast.error(err.message || 'Failed to submit report.', 'Error');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Skeleton width="180px" height="32px" />
        <div className="spec-sheet-panel" style={{ padding: '1.5rem' }}>
          <Skeleton width="50%" height="28px" />
          <div style={{ margin: '1rem 0' }}><Skeleton width="70%" height="16px" /></div>
          <Skeleton height="90px" />
        </div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div
        style={{
          maxWidth: '600px',
          margin: '3rem auto',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-status-damaged-border)',
          padding: '2.5rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-panel)'
        }}
      >
        <AlertCircle size={32} color="var(--color-status-damaged)" style={{ margin: '0 auto 0.75rem auto', display: 'block' }} />
        <h2 style={{ margin: '0 0 0.5rem 0' }}>Asset Record Not Found</h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          {error || 'Unable to retrieve instrument specifications for this asset identifier.'}
        </p>
        <Link to="/equipment">
          <Button variant="secondary" icon={ArrowLeft}>
            Return to Equipment Registry
          </Button>
        </Link>
      </div>
    );
  }

  const allocations = equipment.allocations || [];
  const maintenance = equipment.maintenance || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {/* Top Back & Quick Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link to="/equipment">
          <Button variant="secondary" size="sm" icon={ArrowLeft}>
            Back to Registry
          </Button>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={Wrench}
            onClick={() => setIsReportModalOpen(true)}
          >
            Report Fault / Service
          </Button>

          {isStaff && (
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Specs
            </Button>
          )}

          {isAdmin && (
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Asset
            </Button>
          )}
        </div>
      </div>

      {/* Main Spec Sheet Panel */}
      <div className="spec-sheet-panel accent-edge">
        <div className="panel-header">
          <div className="panel-title font-mono" style={{ fontSize: 'var(--text-xs)' }}>
            <Barcode size={15} color="var(--color-accent-orange)" />
            <span>ASSET SPECIFICATION RECORD</span>
            <span style={{ color: 'var(--color-text-muted)' }}>•</span>
            <span style={{ color: 'var(--color-accent-orange)', fontWeight: 800 }}>{equipment.asset_tag}</span>
          </div>

          <Badge status={equipment.status} />
        </div>

        <div className="panel-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem',
              alignItems: 'stretch'
            }}
          >
            {/* Left: Risograph Illustration / Duotone Photo */}
            <div
              style={{
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                backgroundColor: 'var(--color-surface-subtle)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                className="font-mono"
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: 'var(--color-surface)',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>HARDWARE SPECIMEN VISUAL</span>
                <span style={{ color: 'var(--color-accent-orange)' }}>
                  {equipment.image_url ? 'DUOTONE_ATTACHED' : 'RISOGRAPH_VECTOR'}
                </span>
              </div>
              <EquipmentCardMedia
                equipment={equipment}
                height="220px"
                style={{ borderBottom: 'none' }}
              />
            </div>

            {/* Right: Asset Title & Key Metrics Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: 'var(--text-2xl)', margin: '0 0 0.5rem 0', fontWeight: 800 }}>
                  {equipment.name}
                </h1>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                  <Badge variant="orange">{equipment.category_name}</Badge>
                  <Badge variant="default">SN: {equipment.serial_no || 'N/A'}</Badge>
                  <Badge variant="default">Room: {equipment.lab_name}</Badge>
                </div>
              </div>

              {/* Key Metric Info Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                  padding: '0.85rem',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-xs)'
                }}
              >
                <div>
                  <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Assigned Laboratory
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginTop: '2px' }}>
                    {equipment.lab_name}
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                    {equipment.lab_location}
                  </div>
                </div>

                <div>
                  <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Faculty In-Charge
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginTop: '2px' }}>
                    {equipment.lab_incharge_name || 'Assigned Staff'}
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                    {equipment.lab_incharge_email || 'lab@college.edu'}
                  </div>
                </div>

                <div>
                  <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Commission Date
                  </div>
                  <div className="font-mono" style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginTop: '2px' }}>
                    {equipment.purchase_date ? String(equipment.purchase_date).slice(0, 10) : 'Not Specified'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                    ID: #{equipment.id}
                  </div>
                </div>

                <div>
                  <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Category Class
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginTop: '2px' }}>
                    {equipment.category_name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                    {equipment.category_description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Technical Bench Notes */}
      {equipment.description && (
        <div className="spec-sheet-panel">
          <div className="panel-header">
            <div className="panel-title">
              <FileText size={15} strokeWidth={1.75} color="var(--color-accent-orange)" />
              <span>Bench Location & Calibration Notes</span>
            </div>
          </div>
          <div className="panel-body">
            <div
              className="font-mono"
              style={{
                whiteSpace: 'pre-wrap',
                fontSize: 'var(--text-sm)',
                lineHeight: 1.6,
                backgroundColor: 'var(--color-surface-subtle)',
                padding: '0.85rem 1rem',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-xs)'
              }}
            >
              {equipment.description}
            </div>
          </div>
        </div>
      )}

      {/* Loan & Allocation History Table */}
      <div className="spec-sheet-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Clock size={15} strokeWidth={1.75} color="var(--color-accent-orange)" />
            <span>Allocation & Circulation History ({allocations.length})</span>
          </div>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          {allocations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
              No previous allocation checkouts recorded for this instrument.
            </div>
          ) : (
            <div className="spec-table-container" style={{ border: 'none' }}>
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>LOAN ID</th>
                    <th>BORROWER (RECIPIENT)</th>
                    <th>ROLE</th>
                    <th>CHECKOUT DATE</th>
                    <th>DUE DATE</th>
                    <th>RETURN DATE</th>
                    <th>PURPOSE</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((a) => (
                    <tr key={a.id}>
                      <td className="font-mono" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                        #{a.id}
                      </td>
                      <td style={{ fontWeight: 600 }}>{a.user_name}</td>
                      <td className="font-mono" style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>
                        {a.user_role || 'student'}
                      </td>
                      <td className="font-mono" style={{ fontSize: 'var(--text-xs)' }}>
                        {a.allocated_on ? String(a.allocated_on).slice(0, 10) : '—'}
                      </td>
                      <td className="font-mono" style={{ fontSize: 'var(--text-xs)' }}>
                        {a.due_date ? String(a.due_date).slice(0, 10) : '—'}
                      </td>
                      <td>
                        {a.returned_on ? (
                          <span className="font-mono" style={{ color: 'var(--color-status-available)', fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                            Returned ({String(a.returned_on).slice(0, 10)})
                          </span>
                        ) : (
                          <span className="font-mono" style={{ color: 'var(--color-status-allocated)', fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                            ACTIVE LOAN
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: 'var(--text-xs)', maxWidth: '200px' }}>{a.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Maintenance & Repair History Table */}
      <div className="spec-sheet-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Wrench size={15} strokeWidth={1.75} color="var(--color-accent-orange)" />
            <span>Service & Fault Tickets ({maintenance.length})</span>
          </div>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          {maintenance.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
              No maintenance fault reports recorded. Instrument operates at nominal baseline.
            </div>
          ) : (
            <div className="spec-table-container" style={{ border: 'none' }}>
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>TICKET</th>
                    <th>FAULT DESCRIPTION</th>
                    <th>SEVERITY</th>
                    <th>REPORTED BY</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>TECHNICIAN NOTES</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenance.map((m) => (
                    <tr key={m.id}>
                      <td className="font-mono" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                        #MNT-{String(m.id).padStart(3, '0')}
                      </td>
                      <td style={{ fontSize: 'var(--text-xs)', fontWeight: 500, maxWidth: '240px' }}>
                        {m.issue_description}
                      </td>
                      <td className="font-mono" style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', fontWeight: 700 }}>
                        {m.severity}
                      </td>
                      <td style={{ fontSize: 'var(--text-xs)' }}>{m.reporter_name || 'Staff'}</td>
                      <td className="font-mono" style={{ fontSize: 'var(--text-xs)' }}>
                        {m.reported_on ? String(m.reported_on).slice(0, 10) : 'Recent'}
                      </td>
                      <td>
                        <Badge
                          status={m.status === 'resolved' ? 'available' : m.status === 'in_progress' ? 'under_maintenance' : 'damaged'}
                          size="sm"
                        >
                          {m.status?.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="font-mono" style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
                        {m.technician_notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Equipment Modal */}
      <EquipmentFormModal
        isOpen={isEditModalOpen}
        initialData={equipment}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          fetchDetail();
          setIsEditModalOpen(false);
        }}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        equipment={equipment}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={() => {
          navigate('/equipment');
        }}
      />

      {/* Report Damage Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Equipment Fault"
        subtitle={`TARGET: ${equipment.asset_tag} • ${equipment.name}`}
        icon={Wrench}
        accentEdge
        maxWidth="500px"
      >
        <form onSubmit={handleReportDamage} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Fault Severity Level
            </label>
            <select
              value={reportSeverity}
              onChange={(e) => setReportSeverity(e.target.value)}
              className="form-select font-mono"
            >
              <option value="low">Low (Minor calibration offset / cosmetic)</option>
              <option value="medium">Medium (Faulty channel / intermittent connection)</option>
              <option value="high">High (Complete unit shutdown / power hazard)</option>
            </select>
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Fault Description *
            </label>
            <textarea
              required
              rows={3}
              className="form-textarea"
              placeholder="Describe observed hardware symptom..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-subtle)' }}>
            <Button variant="secondary" type="button" onClick={() => setIsReportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submittingReport}>
              Submit Damage Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
