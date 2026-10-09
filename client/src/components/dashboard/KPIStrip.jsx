import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Wrench, 
  Activity, 
  TrendingUp 
} from 'lucide-react';
import StatCounter from '../common/StatCounter';

export default function KPIStrip({ stats, loading }) {
  const {
    total = 0,
    available = 0,
    allocated = 0,
    damaged = 0,
    maintenance = 0
  } = stats || {};

  const operationalCount = available + allocated;
  const operationalRate = total > 0 ? Math.round((operationalCount / total) * 100) : 100;

  const kpis = [
    {
      id: 'total',
      label: 'TOTAL ASSETS',
      value: total,
      subtext: 'Cataloged in registry',
      icon: Layers,
      color: 'var(--color-text-primary)',
      borderAccent: 'var(--color-text-primary)'
    },
    {
      id: 'available',
      label: 'AVAILABLE UNITS',
      value: available,
      subtext: 'Ready for allocation',
      icon: CheckCircle2,
      color: 'var(--color-status-available)',
      borderAccent: 'var(--color-status-available)'
    },
    {
      id: 'allocated',
      label: 'ALLOCATED / IN USE',
      value: allocated,
      subtext: 'Active user loans',
      icon: Clock,
      color: 'var(--color-status-allocated)',
      borderAccent: 'var(--color-status-allocated)'
    },
    {
      id: 'damaged',
      label: 'DAMAGED ASSETS',
      value: damaged,
      subtext: 'Requires repair',
      icon: AlertTriangle,
      color: 'var(--color-status-damaged)',
      borderAccent: 'var(--color-status-damaged)'
    },
    {
      id: 'maintenance',
      label: 'OPEN MAINTENANCE',
      value: maintenance,
      subtext: 'In service queue',
      icon: Wrench,
      color: 'var(--color-status-maintenance)',
      borderAccent: 'var(--color-status-maintenance)'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}
    >
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: idx * 0.04 }}
            className="stat-card"
            style={{
              borderLeft: `3px solid ${kpi.borderAccent}`,
              backgroundColor: 'var(--color-surface)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div className="stat-card-label">
                <span>{kpi.label}</span>
                <Icon size={14} color={kpi.color} strokeWidth={2} />
              </div>
              <div
                className="stat-card-value font-mono"
                style={{ color: kpi.color }}
              >
                {loading ? '—' : <StatCounter value={kpi.value} />}
              </div>
            </div>

            <div className="stat-card-meta font-mono" style={{ fontSize: '0.7rem' }}>
              {kpi.subtext}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
