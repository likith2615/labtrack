import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Wrench, 
  Building2, 
  ArrowRight, 
  Plus, 
  Activity, 
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { equipmentApi, labsApi, maintenanceApi, activityApi } from '../api/client';
import StatCounter from '../components/common/StatCounter';
import StatusBadge from '../components/common/StatusBadge';
import SkeletonLoader from '../components/common/SkeletonLoader';
import MaintenanceModal from '../components/maintenance/MaintenanceModal';

export default function Dashboard() {
  const { refreshTrigger, triggerRefresh } = useOutletContext();
  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]);
  const [recentMaintenance, setRecentMaintenance] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      equipmentApi.getAll(),
      labsApi.getAll(),
      maintenanceApi.getAll(),
      activityApi.getAll({ limit: 6 })
    ])
      .then(([eqRes, labsRes, maintRes, actRes]) => {
        setEquipment(eqRes.data || []);
        setLabs(labsRes.data || []);
        setRecentMaintenance(maintRes.data || []);
        setActivities(actRes.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Dashboard data load error:', err);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const totalCount = equipment.length;
  const availableCount = equipment.filter(e => e.status === 'available').length;
  const inUseCount = equipment.filter(e => e.status === 'in_use').length;
  const damagedCount = equipment.filter(e => e.status === 'damaged').length;
  const retiredCount = equipment.filter(e => e.status === 'retired').length;

  const operationalCount = availableCount + inUseCount;
  const healthRate = totalCount > 0 ? Math.round((operationalCount / totalCount) * 100) : 100;

  // Equipment requiring attention (damaged or past due service)
  const alertEquipment = equipment.filter(e => e.status === 'damaged');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Page Title & Instrument Subtitle */}
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
            OPERATIONAL TELEMETRY & FACILITY OVERVIEW
          </div>
          <h1 style={{ margin: 0 }}>Laboratory Instrument Panel</h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>
            Real-time status of university research benches, calibration cycles, and lab hardware.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setIsMaintenanceModalOpen(true)}
            className="btn btn-secondary"
          >
            <Wrench size={15} strokeWidth={1.75} />
            <span>Record Service</span>
          </button>
          <button
            onClick={() => navigate('/equipment')}
            className="btn btn-primary"
          >
            <Layers size={15} strokeWidth={2} />
            <span>View All Assets</span>
          </button>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader count={4} height="90px" />
      ) : (
        <>
          {/* Key Metric Instrument Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem'
          }}>
            {/* Total Registered Assets */}
            <div className="stat-card">
              <div className="stat-card-label">
                <span>TOTAL ASSETS</span>
                <Layers size={14} color="var(--text-muted)" strokeWidth={1.75} />
              </div>
              <div className="stat-card-value">
                <StatCounter value={totalCount} />
              </div>
              <div className="stat-card-meta">
                Cataloged across {labs.length} laboratory rooms
              </div>
            </div>

            {/* Available In Service */}
            <div className="stat-card" style={{ borderLeft: '3px solid var(--status-available)' }}>
              <div className="stat-card-label">
                <span>AVAILABLE NOW</span>
                <CheckCircle2 size={14} color="var(--status-available)" strokeWidth={2} />
              </div>
              <div className="stat-card-value" style={{ color: 'var(--status-available)' }}>
                <StatCounter value={availableCount} />
              </div>
              <div className="stat-card-meta">
                Ready for immediate student allocation
              </div>
            </div>

            {/* In Use / Allocated */}
            <div className="stat-card" style={{ borderLeft: '3px solid var(--status-inuse)' }}>
              <div className="stat-card-label">
                <span>IN USE / ACTIVE</span>
                <Clock size={14} color="var(--status-inuse)" strokeWidth={2} />
              </div>
              <div className="stat-card-value" style={{ color: 'var(--status-inuse)' }}>
                <StatCounter value={inUseCount} />
              </div>
              <div className="stat-card-meta">
                Assigned to ongoing projects & lab sessions
              </div>
            </div>

            {/* Damaged / Needs Attention */}
            <div className="stat-card" style={{ borderLeft: '3px solid var(--status-damaged)' }}>
              <div className="stat-card-label">
                <span>SERVICE REQUIRED</span>
                <AlertTriangle size={14} color="var(--status-damaged)" strokeWidth={2} />
              </div>
              <div className="stat-card-value" style={{ color: 'var(--status-damaged)' }}>
                <StatCounter value={damagedCount} />
              </div>
              <div className="stat-card-meta">
                Flagged for repair or calibration
              </div>
            </div>

            {/* Overall Fleet Health */}
            <div className="stat-card">
              <div className="stat-card-label">
                <span>FACILITY HEALTH</span>
                <Activity size={14} color="var(--accent-orange)" strokeWidth={2} />
              </div>
              <div className="stat-card-value">
                <StatCounter value={healthRate} suffix="%" />
              </div>
              <div className="stat-card-meta">
                {operationalCount} of {totalCount} units operational
              </div>
            </div>
          </div>

          {/* Main Dashboard Split Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
            {/* Laboratory Room Allocation Matrix */}
            <div className="spec-sheet-panel accent-edge">
              <div className="panel-header">
                <div className="panel-title">
                  <Building2 size={15} strokeWidth={1.75} color="var(--accent-orange)" />
                  <span>Laboratory Facility Utilization</span>
                </div>
                <Link to="/labs" className="btn btn-secondary btn-sm">
                  <span>Manage Labs</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
              <div className="panel-body" style={{ padding: 0 }}>
                <table className="spec-table">
                  <thead>
                    <tr>
                      <th>Lab Room</th>
                      <th>Dept</th>
                      <th>Assigned Units</th>
                      <th>Available</th>
                      <th>In Use</th>
                      <th>Status Load</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labs.map((lab) => {
                      const labEq = equipment.filter(e => e.lab_id === lab.id);
                      const avail = labEq.filter(e => e.status === 'available').length;
                      const inuse = labEq.filter(e => e.status === 'in_use').length;
                      const total = labEq.length;
                      const usagePct = total > 0 ? Math.round((inuse / total) * 100) : 0;

                      return (
                        <tr key={lab.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{lab.name}</div>
                            <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {lab.code} • {lab.location}
                            </div>
                          </td>
                          <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {lab.department}
                          </td>
                          <td className="font-mono" style={{ fontWeight: 600 }}>
                            {total} units
                          </td>
                          <td>
                            <span className="font-mono" style={{ color: 'var(--status-available)', fontWeight: 600 }}>
                              {avail}
                            </span>
                          </td>
                          <td>
                            <span className="font-mono" style={{ color: 'var(--status-inuse)', fontWeight: 600 }}>
                              {inuse}
                            </span>
                          </td>
                          <td style={{ width: '130px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{
                                flex: 1,
                                height: '6px',
                                backgroundColor: 'var(--bg-muted)',
                                borderRadius: '1px',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  width: `${usagePct}%`,
                                  height: '100%',
                                  backgroundColor: usagePct > 70 ? 'var(--status-inuse)' : 'var(--accent-orange)'
                                }} />
                              </div>
                              <span className="font-mono" style={{ fontSize: '0.7rem', minWidth: '28px' }}>
                                {usagePct}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Maintenance & Action Required */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Critical Attention Panel */}
              <div className="spec-sheet-panel">
                <div className="panel-header" style={{ backgroundColor: alertEquipment.length > 0 ? 'var(--status-damaged-bg)' : 'var(--bg-subtle)' }}>
                  <div className="panel-title" style={{ color: alertEquipment.length > 0 ? 'var(--status-damaged)' : 'var(--text-primary)' }}>
                    <ShieldAlert size={15} strokeWidth={2} />
                    <span>Attention Required ({alertEquipment.length})</span>
                  </div>
                </div>
                <div className="panel-body">
                  {alertEquipment.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <CheckCircle2 size={24} color="var(--status-available)" strokeWidth={1.75} style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
                      All instruments calibrated and within operational parameters.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {alertEquipment.map((eq) => (
                        <div
                          key={eq.id}
                          style={{
                            padding: '0.75rem',
                            border: '1px solid var(--status-damaged-border)',
                            backgroundColor: 'var(--bg-surface)',
                            borderRadius: 'var(--radius-xs)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div className="font-mono" style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                              {eq.asset_tag} • {eq.lab_name}
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>
                              {eq.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--status-damaged)', marginTop: '2px' }}>
                              {eq.notes || 'Damage flagged during operation.'}
                            </div>
                          </div>
                          <Link to={`/equipment/${eq.id}`} className="btn btn-secondary btn-sm font-mono">
                            Spec & Log
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Audit & Activity Log */}
              <div className="spec-sheet-panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <Activity size={15} strokeWidth={1.75} color="var(--text-secondary)" />
                    <span>System Audit Trail</span>
                  </div>
                </div>
                <div className="panel-body" style={{ padding: '0.5rem 1rem' }}>
                  {activities.length === 0 ? (
                    <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      No recent activity records found.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {activities.map((act, index) => (
                        <div
                          key={act.id}
                          style={{
                            padding: '0.65rem 0',
                            borderBottom: index < activities.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.65rem'
                          }}
                        >
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-orange)',
                            marginTop: '6px',
                            flexShrink: 0
                          }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.775rem', color: 'var(--text-primary)', lineHeight: 1.35 }}>
                              {act.details}
                            </div>
                            <div className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {act.created_at ? new Date(act.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <MaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        onSuccess={() => {
          triggerRefresh();
          setIsMaintenanceModalOpen(false);
        }}
      />
    </motion.div>
  );
}
