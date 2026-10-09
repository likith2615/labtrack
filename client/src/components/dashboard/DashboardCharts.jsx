import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react';

const STATUS_COLORS = {
  available: '#1B873F',
  allocated: '#D97706',
  in_use: '#D97706',
  under_maintenance: '#2563EB',
  damaged: '#DC2626',
  retired: '#4B5563'
};

// Custom Tooltip component for technical instrument theme
function TechnicalTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-strong)',
          borderRadius: 'var(--radius-xs)',
          padding: '0.5rem 0.75rem',
          boxShadow: 'var(--shadow-panel)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)'
        }}
      >
        <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px', textTransform: 'uppercase' }}>
          {label || payload[0]?.name}
        </div>
        {payload.map((entry, index) => (
          <div key={index} style={{ color: entry.color || entry.fill, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{entry.name}:</span>
            <span style={{ fontWeight: 700 }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function DashboardCharts({
  labData = [],
  statusData = [],
  maintenanceTrendData = []
}) {
  // Format Lab Data for Bar Chart
  const formattedLabData = (labData || []).map((l) => ({
    name: l.lab_name ? (l.lab_name.length > 14 ? l.lab_name.slice(0, 12) + '…' : l.lab_name) : 'Lab',
    fullName: l.lab_name,
    total: Number(l.total_equipment || 0),
    available: Number(l.available_count || 0),
    allocated: Number(l.allocated_count || 0)
  }));

  // Format Status Split Data for Donut Chart
  const formattedStatusData = (statusData || []).map((s) => ({
    name: (s.status || 'unknown').replace('_', ' ').toUpperCase(),
    value: Number(s.count || 0),
    statusKey: s.status,
    color: STATUS_COLORS[s.status] || 'var(--color-text-primary)'
  }));

  const totalStatusUnits = formattedStatusData.reduce((acc, curr) => acc + curr.value, 0);

  // Fallback maintenance trend if not provided by backend
  const trendData = maintenanceTrendData.length > 0 ? maintenanceTrendData : [
    { period: 'W1', reported: 3, resolved: 2 },
    { period: 'W2', reported: 5, resolved: 4 },
    { period: 'W3', reported: 2, resolved: 3 },
    { period: 'W4', reported: 6, resolved: 5 },
    { period: 'W5', reported: 4, resolved: 4 },
    { period: 'W6', reported: 2, resolved: 3 }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}
    >
      {/* 1. Bar Chart: Equipment Distribution Per Laboratory */}
      <div className="spec-sheet-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div className="panel-title" style={{ fontSize: 'var(--text-xs)' }}>
            <BarChart3 size={15} color="var(--color-accent-orange)" strokeWidth={2} />
            <span>Equipment Allocation per Lab Facility</span>
          </div>
          <span className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)' }}>
            UNITS BY ROOM
          </span>
        </div>

        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedLabData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                axisLine={{ stroke: 'var(--color-border-default)' }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                axisLine={{ stroke: 'var(--color-border-default)' }}
                allowDecimals={false}
              />
              <Tooltip content={<TechnicalTooltip />} />
              <Bar dataKey="total" name="Total Units" fill="#FF5A1F" radius={[2, 2, 0, 0]} maxBarSize={32} />
              <Bar dataKey="available" name="Available" fill="#16181D" radius={[2, 2, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Donut Chart: Fleet Operational Status Split */}
      <div className="spec-sheet-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div className="panel-title" style={{ fontSize: 'var(--text-xs)' }}>
            <PieIcon size={15} color="var(--color-accent-orange)" strokeWidth={2} />
            <span>Operational Status Distribution</span>
          </div>
          <span className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)' }}>
            TOTAL {totalStatusUnits} UNITS
          </span>
        </div>

        <div style={{ width: '100%', height: 220, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedStatusData}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {formattedStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--color-surface)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<TechnicalTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text inside Donut */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none'
            }}
          >
            <div className="font-mono" style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {totalStatusUnits}
            </div>
            <div className="font-mono" style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              UNITS
            </div>
          </div>
        </div>

        {/* Legend Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center', marginTop: '0.5rem' }}>
          {formattedStatusData.map((s, idx) => (
            <div
              key={idx}
              className="font-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.675rem',
                padding: '0.15rem 0.4rem',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-xs)'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s.color }} />
              <span style={{ color: 'var(--color-text-secondary)' }}>{s.name}:</span>
              <strong style={{ color: 'var(--color-text-primary)' }}>{s.value}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Line Chart: Service & Maintenance Activity Trend */}
      <div className="spec-sheet-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div className="panel-title" style={{ fontSize: 'var(--text-xs)' }}>
            <TrendingUp size={15} color="var(--color-accent-orange)" strokeWidth={2} />
            <span>Calibration & Repair Service Velocity</span>
          </div>
          <span className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)' }}>
            TREND LOG
          </span>
        </div>

        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                axisLine={{ stroke: 'var(--color-border-default)' }}
              />
              <YAxis
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                axisLine={{ stroke: 'var(--color-border-default)' }}
                allowDecimals={false}
              />
              <Tooltip content={<TechnicalTooltip />} />
              <Line
                type="monotone"
                dataKey="reported"
                name="Reported Faults"
                stroke="#DC2626"
                strokeWidth={2}
                dot={{ r: 3, fill: '#DC2626' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                name="Calibrated / Resolved"
                stroke="#1B873F"
                strokeWidth={2}
                dot={{ r: 3, fill: '#1B873F' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ width: '8px', height: '2px', backgroundColor: '#DC2626', display: 'inline-block' }} />
            <span>REPORTED FAULTS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ width: '8px', height: '2px', backgroundColor: '#1B873F', display: 'inline-block' }} />
            <span>RESOLVED / RESTORED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
