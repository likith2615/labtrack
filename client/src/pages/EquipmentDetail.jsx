import React, { useState, useEffect } from 'react';
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
  Layers
} from 'lucide-react';
import { equipmentApi } from '../api/client';
import StatusBadge from '../components/common/StatusBadge';
import SpecTag from '../components/common/SpecTag';
import SkeletonLoader from '../components/common/SkeletonLoader';
import StatusDrawer from '../components/equipment/StatusDrawer';
import MaintenanceModal from '../components/maintenance/MaintenanceModal';

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isStatusDrawerOpen, setIsStatusDrawerOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDetail = () => {
    setLoading(true);
    equipmentApi.getById(id)
      .then(res => {
        setEquipment(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Equipment not found.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete asset [${equipment?.asset_tag}]? This action cannot be undone.`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await equipmentApi.delete(id);
      navigate('/equipment');
    } catch (err) {
      alert(err.message || 'Failed to delete equipment.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <SkeletonLoader count={4} height="70px" />
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '3rem auto',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--status-damaged-border)',
        padding: '2rem',
        textAlign: 'center',
        borderRadius: 'var(--radius-xs)'
      }}>
        <AlertCircle size={32} color="var(--status-damaged)" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
        <h3>Asset Record Not Found</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          {error || 'Unable to retrieve instrument specifications for this identifier.'}
        </p>
        <Link to="/equipment" className="btn btn-secondary">
          <ArrowLeft size={14} />
          <span>Return to Registry</span>
        </Link>
      </div>
    );
  }

  const specs = equipment.specifications && typeof equipment.specifications === 'object'
    ? equipment.specifications
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{ maxWidth: '1100px', margin: '0 auto' }}
    >
      {/* Back Link */}
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/equipment" className="btn btn-secondary btn-sm font-mono">
          <ArrowLeft size={13} />
          <span>Back to Equipment Registry</span>
        </Link>
      </div>

      {/* Main Spec Sheet Header */}
      <div className="spec-sheet-panel accent-edge" style={{ marginBottom: '1.5rem' }}>
        <div className="panel-header">
          <div className="panel-title font-mono" style={{ fontSize: '0.85rem' }}>
            <span>ASSET SPECIFICATION RECORD</span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ color: 'var(--accent-orange)' }}>{equipment.asset_tag}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setIsStatusDrawerOpen(true)}
              className="btn btn-secondary btn-sm"
            >
              <RefreshCw size={13} />
              <span>Change Status</span>
            </button>
            <button
              onClick={() => setIsMaintenanceModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <Wrench size={13} />
              <span>Log Service</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn btn-secondary btn-sm"
              title="Delete asset record"
              style={{ color: 'var(--status-damaged)' }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <div className="panel-body">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h1 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>
                {equipment.name}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
                <SpecTag label="MFG" value={equipment.manufacturer} />
                <SpecTag label="MODEL" value={equipment.model_number} />
                <SpecTag label="SERIAL" value={equipment.serial_number} />
                <SpecTag label="CAT" value={equipment.category_name} />
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>OPERATIONAL STATE</div>
              <StatusBadge status={equipment.status} />
            </div>
          </div>

          {/* Key Metric Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xs)'
          }}>
            <div>
              <div className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Assigned Facility
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>
                {equipment.lab_name}
              </div>
              <div className="font-mono" style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                {equipment.lab_location}
              </div>
            </div>

            <div>
              <div className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Lab In-Charge
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>
                {equipment.lab_in_charge || 'Department Head'}
              </div>
              <div className="font-mono" style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                {equipment.lab_contact_email || 'lab@college.edu'}
              </div>
            </div>

            <div>
              <div className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Commission / Purchase Date
              </div>
              <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>
                {equipment.purchase_date || 'N/A'}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                Warranty: {equipment.warranty_expiry || 'Standard'}
              </div>
            </div>

            <div>
              <div className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Last Service & Calibration
              </div>
              <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px', color: equipment.last_serviced ? 'var(--status-available)' : 'var(--text-muted)' }}>
                {equipment.last_serviced || 'Pending'}
              </div>
              <div className="font-mono" style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                Next due: {equipment.next_service_due || 'TBD'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Specifications & Bench Notes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Technical Instrument Specifications */}
        <div className="spec-sheet-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Cpu size={15} strokeWidth={1.75} color="var(--accent-orange)" />
              <span>Technical Parameters</span>
            </div>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            {Object.keys(specs).length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Standard OEM baseline parameters configured.
              </div>
            ) : (
              <table className="spec-table">
                <tbody>
                  {Object.entries(specs).map(([key, val]) => (
                    <tr key={key}>
                      <td style={{ width: '40%', fontWeight: 600, textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                        {key.replace(/_/g, ' ')}
                      </td>
                      <td className="font-mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {String(val)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Operational Notes & Location */}
        <div className="spec-sheet-panel">
          <div className="panel-header">
            <div className="panel-title">
              <FileText size={15} strokeWidth={1.75} color="var(--text-secondary)" />
              <span>Bench Deployment & Service Notes</span>
            </div>
          </div>
          <div className="panel-body">
            <div className="font-mono" style={{
              whiteSpace: 'pre-wrap',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-subtle)',
              padding: '0.85rem',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xs)',
              minHeight: '110px'
            }}>
              {equipment.notes || 'No operational deployment notes registered.'}
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance & Calibration History Table */}
      <div className="spec-sheet-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Wrench size={15} strokeWidth={1.75} color="var(--accent-orange)" />
            <span>Service & Calibration History ({equipment.maintenance_logs?.length || 0})</span>
          </div>

          <button
            onClick={() => setIsMaintenanceModalOpen(true)}
            className="btn btn-secondary btn-sm"
          >
            <Wrench size={12} />
            <span>Add Service Record</span>
          </button>
        </div>

        <div className="panel-body" style={{ padding: 0 }}>
          {(!equipment.maintenance_logs || equipment.maintenance_logs.length === 0) ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              No calibration or repair logs recorded for this asset yet.
            </div>
          ) : (
            <table className="spec-table">
              <thead>
                <tr>
                  <th>Service Date</th>
                  <th>Service Type</th>
                  <th>Certified Technician</th>
                  <th>Diagnostic Findings</th>
                  <th>Action Taken</th>
                  <th>Post Status</th>
                  <th>Cost ($)</th>
                </tr>
              </thead>
              <tbody>
                {equipment.maintenance_logs.map((log) => (
                  <tr key={log.id}>
                    <td className="font-mono" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {log.service_date}
                    </td>
                    <td>
                      <span className="spec-tag" style={{ textTransform: 'capitalize' }}>
                        {log.service_type?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {log.technician_name}
                    </td>
                    <td style={{ fontSize: '0.8rem', maxWidth: '240px' }}>
                      {log.findings}
                    </td>
                    <td style={{ fontSize: '0.8rem', maxWidth: '240px' }}>
                      {log.action_taken}
                    </td>
                    <td>
                      <StatusBadge status={log.status_after_service} size="sm" />
                    </td>
                    <td className="font-mono" style={{ fontWeight: 600 }}>
                      ${parseFloat(log.cost || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status Drawer */}
      <AnimatePresence>
        {isStatusDrawerOpen && (
          <StatusDrawer
            equipment={equipment}
            isOpen={isStatusDrawerOpen}
            onClose={() => setIsStatusDrawerOpen(false)}
            onSuccess={() => {
              fetchDetail();
              setIsStatusDrawerOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Maintenance Modal */}
      <AnimatePresence>
        {isMaintenanceModalOpen && (
          <MaintenanceModal
            isOpen={isMaintenanceModalOpen}
            preselectedEquipment={equipment}
            onClose={() => setIsMaintenanceModalOpen(false)}
            onSuccess={() => {
              fetchDetail();
              setIsMaintenanceModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
