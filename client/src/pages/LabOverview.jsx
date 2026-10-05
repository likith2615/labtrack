import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  Mail, 
  MapPin, 
  Plus, 
  ArrowRight,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { labsApi, equipmentApi } from '../api/client';
import SkeletonLoader from '../components/common/SkeletonLoader';
import StatCounter from '../components/common/StatCounter';

export default function LabOverview() {
  const { refreshTrigger, triggerRefresh } = useOutletContext();
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddLabModalOpen, setIsAddLabModalOpen] = useState(false);
  const [newLabData, setNewLabData] = useState({
    name: '',
    code: '',
    department: 'Electrical Engineering',
    location: '',
    in_charge: '',
    contact_email: '',
    capacity: 30
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchLabs = () => {
    setLoading(true);
    labsApi.getAll()
      .then(res => {
        setLabs(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load labs:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLabs();
  }, [refreshTrigger]);

  const handleCreateLab = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);

    try {
      await labsApi.create(newLabData);
      setSubmitting(false);
      setIsAddLabModalOpen(false);
      setNewLabData({
        name: '',
        code: '',
        department: 'Electrical Engineering',
        location: '',
        in_charge: '',
        contact_email: '',
        capacity: 30
      });
      fetchLabs();
      triggerRefresh();
    } catch (err) {
      setSubmitting(false);
      setModalError(err.message || 'Failed to create laboratory room.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '1.75rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-default)'
      }}>
        <div>
          <div className="font-mono" style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            CAMPUS FACILITY DIRECTORY
          </div>
          <h1 style={{ margin: 0 }}>Laboratory Rooms & Workspaces</h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>
            Departmental lab allocations, bench capacity, and facility managers.
          </p>
        </div>

        <button
          onClick={() => setIsAddLabModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={15} strokeWidth={2} />
          <span>Add Lab Facility</span>
        </button>
      </div>

      {loading ? (
        <SkeletonLoader count={3} height="140px" />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.25rem'
        }}>
          {labs.map((lab) => {
            const total = Number(lab.total_equipment || 0);
            const avail = Number(lab.available_count || 0);
            const inUse = Number(lab.in_use_count || 0);
            const damaged = Number(lab.damaged_count || 0);
            const usagePct = total > 0 ? Math.round((inUse / total) * 100) : 0;

            return (
              <motion.div
                key={lab.id}
                className="spec-sheet-panel"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div className="panel-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={15} color="var(--accent-orange)" strokeWidth={1.75} />
                    <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {lab.code}
                    </span>
                  </div>
                  <span className="spec-tag" style={{ fontSize: '0.7rem' }}>
                    {lab.department}
                  </span>
                </div>

                <div className="panel-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                    {lab.name}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem', fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={13} style={{ opacity: 0.7 }} />
                      <span>{lab.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <User size={13} style={{ opacity: 0.7 }} />
                      <span>In-Charge: <strong>{lab.in_charge}</strong></span>
                    </div>
                    {lab.contact_email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Mail size={13} style={{ opacity: 0.7 }} />
                        <span className="font-mono" style={{ fontSize: '0.725rem' }}>{lab.contact_email}</span>
                      </div>
                    )}
                  </div>

                  {/* Lab Equipment Metric Strip */}
                  <div style={{
                    marginTop: 'auto',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-xs)',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="font-mono" style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        Asset Allocation
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        {total} Instruments
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.35rem', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                        <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--status-available)' }}>
                          {avail}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>AVAILABLE</div>
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.35rem', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                        <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--status-inuse)' }}>
                          {inUse}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>IN USE</div>
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.35rem', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
                        <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--status-damaged)' }}>
                          {damaged}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>DAMAGED</div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/equipment?lab_id=${lab.id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'space-between' }}
                  >
                    <span>Inspect Lab Inventory</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Lab Modal */}
      <AnimatePresence>
        {isAddLabModalOpen && (
          <div className="modal-backdrop" onClick={() => setIsAddLabModalOpen(false)}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="panel-header">
                <div className="panel-title">
                  <Building2 size={16} color="var(--accent-orange)" />
                  <span>Register Laboratory Facility</span>
                </div>
                <button
                  onClick={() => setIsAddLabModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.2rem 0.4rem' }}
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleCreateLab} className="panel-body">
                {modalError && (
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--status-damaged-bg)',
                    border: '1px solid var(--status-damaged-border)',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--status-damaged)',
                    fontSize: '0.8rem',
                    marginBottom: '1rem'
                  }}>
                    {modalError}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Facility Code *</label>
                    <input
                      type="text"
                      className="form-input font-mono"
                      placeholder="e.g. LAB-PHY-06"
                      required
                      value={newLabData.code}
                      onChange={(e) => setNewLabData(p => ({ ...p, code: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Physics & Optics"
                      required
                      value={newLabData.department}
                      onChange={(e) => setNewLabData(p => ({ ...p, department: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Laboratory Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Applied Optics & Laser Systems Lab"
                    required
                    value={newLabData.name}
                    onChange={(e) => setNewLabData(p => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Campus Location / Room *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Room 410, North Science Tower"
                    required
                    value={newLabData.location}
                    onChange={(e) => setNewLabData(p => ({ ...p, location: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Faculty In-Charge *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Dr. Robert Lang"
                      required
                      value={newLabData.in_charge}
                      onChange={(e) => setNewLabData(p => ({ ...p, in_charge: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Email</label>
                    <input
                      type="email"
                      className="form-input font-mono"
                      placeholder="e.g. r.lang@college.edu"
                      value={newLabData.contact_email}
                      onChange={(e) => setNewLabData(p => ({ ...p, contact_email: e.target.value }))}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <button
                    type="button"
                    onClick={() => setIsAddLabModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                  >
                    <Check size={16} />
                    <span>{submitting ? 'Registering...' : 'Register Laboratory'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
