import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Search, 
  Filter, 
  Plus, 
  DollarSign, 
  Calendar, 
  UserCheck, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { maintenanceApi } from '../api/client';
import StatusBadge from '../components/common/StatusBadge';
import SkeletonLoader from '../components/common/SkeletonLoader';
import StatCounter from '../components/common/StatCounter';
import MaintenanceModal from '../components/maintenance/MaintenanceModal';

export default function MaintenanceLogs() {
  const { refreshTrigger, triggerRefresh } = useOutletContext();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLogs = () => {
    setLoading(true);
    maintenanceApi.getAll()
      .then(res => {
        setLogs(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load maintenance logs:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, [refreshTrigger]);

  const filteredLogs = logs.filter(log => {
    if (selectedType !== 'all' && log.service_type !== selectedType) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        (log.equipment_name && log.equipment_name.toLowerCase().includes(q)) ||
        (log.asset_tag && log.asset_tag.toLowerCase().includes(q)) ||
        (log.technician_name && log.technician_name.toLowerCase().includes(q)) ||
        (log.findings && log.findings.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const totalCost = logs.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
  const calibrationCount = logs.filter(l => l.service_type === 'routine_calibration').length;
  const repairCount = logs.filter(l => l.service_type === 'repair' || l.service_type === 'emergency_fix').length;

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
            NIST CALIBRATION & SERVICE ARCHIVE
          </div>
          <h1 style={{ margin: 0 }}>Laboratory Maintenance Log</h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>
            Traceable calibration events, technician reports, repair actions, and maintenance expenditure.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={15} strokeWidth={2} />
          <span>Record Service Event</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div className="stat-card">
          <div className="stat-card-label">
            <span>TOTAL SERVICE EVENTS</span>
            <Wrench size={14} color="var(--text-muted)" />
          </div>
          <div className="stat-card-value">
            <StatCounter value={logs.length} />
          </div>
          <div className="stat-card-meta">Recorded across all college facilities</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '3px solid var(--status-available)' }}>
          <div className="stat-card-label">
            <span>NIST CALIBRATIONS</span>
            <CheckCircle2 size={14} color="var(--status-available)" />
          </div>
          <div className="stat-card-value" style={{ color: 'var(--status-available)' }}>
            <StatCounter value={calibrationCount} />
          </div>
          <div className="stat-card-meta">Scheduled accuracy verification runs</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '3px solid var(--status-damaged)' }}>
          <div className="stat-card-label">
            <span>REPAIRS & FIXES</span>
            <Wrench size={14} color="var(--status-damaged)" />
          </div>
          <div className="stat-card-value" style={{ color: 'var(--status-damaged)' }}>
            <StatCounter value={repairCount} />
          </div>
          <div className="stat-card-meta">Corrective mechanical & electrical repairs</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label">
            <span>MAINTENANCE EXPENDITURE</span>
            <DollarSign size={14} color="var(--accent-orange)" />
          </div>
          <div className="stat-card-value font-mono">
            ${totalCost.toFixed(2)}
          </div>
          <div className="stat-card-meta">Total cumulative service cost</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xs)',
        padding: '1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { id: 'all', label: 'All Records' },
            { id: 'routine_calibration', label: 'Calibration' },
            { id: 'repair', label: 'Repair' },
            { id: 'inspection', label: 'Inspection' },
            { id: 'emergency_fix', label: 'Emergency Fix' }
          ].map((type) => {
            const isActive = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className="btn btn-sm font-mono"
                style={{
                  backgroundColor: isActive ? 'var(--text-primary)' : 'var(--bg-subtle)',
                  color: isActive ? 'var(--bg-canvas)' : 'var(--text-primary)',
                  borderColor: isActive ? 'var(--text-primary)' : 'var(--border-default)',
                  fontWeight: isActive ? 700 : 500
                }}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input font-mono"
            placeholder="Search technician, asset, findings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2rem', fontSize: '0.8rem' }}
          />
        </div>
      </div>

      {/* Logs Spec Table */}
      {loading ? (
        <SkeletonLoader count={5} height="52px" />
      ) : filteredLogs.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xs)',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <Wrench size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
          <h3>No Maintenance Records Match Filter</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Try resetting search keywords or service type filter.
          </p>
        </div>
      ) : (
        <div className="spec-table-container">
          <table className="spec-table">
            <thead>
              <tr>
                <th>Service Date</th>
                <th>Asset / Tag</th>
                <th>Facility Lab</th>
                <th>Service Type</th>
                <th>Technician / Entity</th>
                <th>Diagnostic Findings</th>
                <th>Action Taken</th>
                <th>Post Status</th>
                <th style={{ textAlign: 'right' }}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {log.service_date}
                  </td>
                  <td>
                    <Link
                      to={`/equipment/${log.equipment_id}`}
                      style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                    >
                      {log.equipment_name}
                    </Link>
                    <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {log.asset_tag}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>
                    {log.lab_name}
                  </td>
                  <td>
                    <span className="spec-tag" style={{ textTransform: 'capitalize' }}>
                      {log.service_type?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>
                    {log.technician_name}
                  </td>
                  <td style={{ fontSize: '0.8rem', maxWidth: '220px' }}>
                    {log.findings}
                  </td>
                  <td style={{ fontSize: '0.8rem', maxWidth: '220px' }}>
                    {log.action_taken}
                  </td>
                  <td>
                    <StatusBadge status={log.status_after_service} size="sm" />
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 600 }}>
                    ${parseFloat(log.cost || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Service Record Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <MaintenanceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              fetchLogs();
              triggerRefresh();
              setIsModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
