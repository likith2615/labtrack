import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Plus,
  RefreshCw,
  Clock,
  Wrench,
  AlertTriangle,
  Building2,
  ShieldCheck,
  Activity,
  Edit,
  Trash2,
  ExternalLink,
  SlidersHorizontal,
  Eye,
  CheckCircle2,
  Search
} from 'lucide-react';

import {
  equipmentApi,
  labsApi,
  categoriesApi,
  maintenanceApi,
  allocationsApi,
  reportsApi
} from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import ProtectedRoute from '../components/auth/ProtectedRoute';

import KPIStrip from '../components/dashboard/KPIStrip';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import OverdueTable from '../components/dashboard/OverdueTable';
import MaintenanceQueue from '../components/dashboard/MaintenanceQueue';
import AllocationsPanel from '../components/dashboard/AllocationsPanel';
import EquipmentFormModal from '../components/dashboard/EquipmentFormModal';
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal';

import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

export default function Dashboard() {
  const { currentUser, isAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Primary Data States
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [maintenanceTickets, setMaintenanceTickets] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [reportsData, setReportsData] = useState(null);

  // Search & Filter for Equipment Management Grid
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerLabFilter, setLedgerLabFilter] = useState('all');

  // Modal States
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteModalItem, setDeleteModalItem] = useState(null);

  // Active Dashboard Section Tabs
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'allocations' | 'maintenance' | 'inventory'

  // Fetch all dashboard data from API
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        eqRes,
        labsRes,
        catsRes,
        maintRes,
        allocRes,
        reportsRes
      ] = await Promise.all([
        equipmentApi.getAll({ limit: 100 }),
        labsApi.getAll(),
        categoriesApi.getAll(),
        maintenanceApi.getAll(),
        allocationsApi.getAll(),
        reportsApi.getSummary()
      ]);

      setEquipment(eqRes.data || []);
      setLabs(labsRes.data || []);
      setCategories(catsRes.data || []);
      setMaintenanceTickets(maintRes.data || []);
      setAllocations(allocRes.data || []);
      setReportsData(reportsRes.data || null);
    } catch (err) {
      console.error('Failed to load dashboard telemetry:', err);
      toast.error('Failed to load real-time telemetry from backend API.', 'Connection Failure');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Compute KPI Counts
  const totalCount = equipment.length;
  const availableCount = equipment.filter((e) => e.status === 'available').length;
  const allocatedCount = equipment.filter((e) => e.status === 'allocated' || e.status === 'in_use').length;
  const damagedCount = equipment.filter((e) => e.status === 'damaged').length;
  const maintenanceCount = maintenanceTickets.filter((m) => m.status !== 'resolved').length;

  // Available equipment items for new checkouts
  const availableEquipment = equipment.filter((e) => e.status === 'available');

  // Overdue allocations from reports summary or calculated from allocations
  const overdueItems = reportsData?.overdueAllocations?.items || allocations.filter((a) => a.returned_on === null && new Date(a.due_date) < new Date()).map((a) => {
    const eq = equipment.find((e) => e.id === a.equipment_id);
    const lab = eq ? labs.find((l) => l.id === eq.lab_id) : null;
    const daysOverdue = Math.max(0, Math.floor((Date.now() - new Date(a.due_date).getTime()) / (1000 * 60 * 60 * 24)));
    return {
      allocation_id: a.id,
      equipment_id: a.equipment_id,
      asset_tag: eq ? eq.asset_tag : `EQ-#${a.equipment_id}`,
      equipment_name: eq ? eq.name : a.equipment_name || 'Hardware Asset',
      borrower_name: a.user_name || 'Borrower',
      borrower_email: a.user_email || '',
      borrower_role: a.user_role || 'student',
      lab_name: lab ? lab.name : a.lab_name || 'Laboratory',
      allocated_on: a.allocated_on,
      due_date: a.due_date,
      days_overdue: daysOverdue,
      purpose: a.purpose
    };
  });

  // Filtered Equipment Ledger for direct admin management
  const filteredEquipment = equipment.filter((item) => {
    if (ledgerLabFilter !== 'all' && item.lab_id !== Number(ledgerLabFilter)) {
      return false;
    }
    if (ledgerSearch.trim()) {
      const q = ledgerSearch.toLowerCase();
      return (
        item.name?.toLowerCase().includes(q) ||
        item.asset_tag?.toLowerCase().includes(q) ||
        item.serial_no?.toLowerCase().includes(q) ||
        item.lab_name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <ProtectedRoute requiredRole="admin">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
      >
        {/* Top Operational Header Bar */}
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
                gap: '0.45rem'
              }}
            >
              <ShieldCheck size={14} strokeWidth={2} />
              <span>ADMINISTRATIVE CONTROL CONSOLE • SECURE</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 'var(--text-2xl)' }}>
              Laboratory Instrument Panel
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Real-time hardware inventory, active student loan circulation, and calibration maintenance queues.
            </p>
          </div>

          {/* Quick Action Button Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              loading={loading}
              onClick={fetchDashboardData}
            >
              Sync Telemetry
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                setEditingItem(null);
                setFormModalOpen(true);
              }}
            >
              Register Asset
            </Button>
          </div>
        </div>

        {/* 1. Animated Count-Up KPI Strip */}
        <KPIStrip
          loading={loading}
          stats={{
            total: totalCount,
            available: availableCount,
            allocated: allocatedCount,
            damaged: damagedCount,
            maintenance: maintenanceCount
          }}
        />

        {/* 2. Recharts Palette-Matched Visualizations */}
        <DashboardCharts
          labData={reportsData?.labBreakdown || labs.map((l) => ({
            lab_name: l.name,
            total_equipment: equipment.filter((e) => e.lab_id === l.id).length,
            available_count: equipment.filter((e) => e.lab_id === l.id && e.status === 'available').length,
            allocated_count: equipment.filter((e) => e.lab_id === l.id && (e.status === 'allocated' || e.status === 'in_use')).length
          }))}
          statusData={reportsData?.statusCounts || [
            { status: 'available', count: availableCount },
            { status: 'allocated', count: allocatedCount },
            { status: 'under_maintenance', count: equipment.filter((e) => e.status === 'under_maintenance').length },
            { status: 'damaged', count: damagedCount },
            { status: 'retired', count: equipment.filter((e) => e.status === 'retired').length }
          ]}
        />

        {/* Dashboard Navigation Sub-Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderBottom: '1px solid var(--color-border-default)',
            paddingBottom: '0.5rem'
          }}
        >
          {[
            { id: 'overview', label: 'ATTENTION & OVERDUE' },
            { id: 'maintenance', label: `MAINTENANCE QUEUE (${maintenanceCount})` },
            { id: 'allocations', label: `CIRCULATION & LOANS (${allocations.filter((a) => a.returned_on === null).length})` },
            { id: 'inventory', label: `INVENTORY LEDGER (${equipment.length})` }
          ].map((tab) => {
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className="font-mono"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: 'var(--text-xs)',
                  fontWeight: isActive ? 700 : 500,
                  border: '1px solid',
                  borderColor: isActive ? 'var(--color-text-primary)' : 'var(--color-border-default)',
                  backgroundColor: isActive ? 'var(--color-text-primary)' : 'var(--color-surface)',
                  color: isActive ? 'var(--color-canvas)' : 'var(--color-text-secondary)',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 3. Overdue Allocations Table (Shown on Overview & Allocations) */}
        {(activeSection === 'overview' || activeSection === 'allocations') && (
          <OverdueTable
            overdueItems={overdueItems}
            onAllocationReturned={fetchDashboardData}
          />
        )}

        {/* 4. Active Maintenance Queue with Inline Status Updates */}
        {(activeSection === 'overview' || activeSection === 'maintenance') && (
          <MaintenanceQueue
            tickets={maintenanceTickets}
            onTicketUpdated={fetchDashboardData}
          />
        )}

        {/* 5. Allocations Screen to Allocate & Return Equipment */}
        {(activeSection === 'overview' || activeSection === 'allocations') && (
          <AllocationsPanel
            allocations={allocations}
            availableEquipment={availableEquipment}
            onAllocationChange={fetchDashboardData}
          />
        )}

        {/* 6. Admin Equipment Inventory Ledger with Add / Edit / Delete */}
        {(activeSection === 'overview' || activeSection === 'inventory') && (
          <div className="spec-sheet-panel" style={{ marginBottom: '1.5rem' }}>
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
                <Layers size={16} strokeWidth={1.75} color="var(--color-accent-orange)" />
                <span>Admin Asset Ledger & Control</span>
              </div>

              {/* Mini filter controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={13} style={{ position: 'absolute', left: '0.55rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Filter ledger..."
                    className="form-input font-mono"
                    value={ledgerSearch}
                    onChange={(e) => setLedgerSearch(e.target.value)}
                    style={{
                      paddingLeft: '1.75rem',
                      paddingTop: '0.25rem',
                      paddingBottom: '0.25rem',
                      fontSize: '0.75rem',
                      width: '170px'
                    }}
                  />
                </div>

                <select
                  value={ledgerLabFilter}
                  onChange={(e) => setLedgerLabFilter(e.target.value)}
                  className="form-select font-mono"
                  style={{
                    padding: '0.25rem 1.75rem 0.25rem 0.55rem',
                    fontSize: '0.75rem'
                  }}
                >
                  <option value="all">All Labs</option>
                  {labs.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    setEditingItem(null);
                    setFormModalOpen(true);
                  }}
                  style={{ padding: '0.25rem 0.6rem' }}
                >
                  Add Equipment
                </Button>
              </div>
            </div>

            <div className="panel-body" style={{ padding: 0 }}>
              <div className="spec-table-container" style={{ border: 'none' }}>
                <table className="spec-table">
                  <thead>
                    <tr>
                      <th>TAG</th>
                      <th>EQUIPMENT NAME</th>
                      <th>CATEGORY</th>
                      <th>LAB LOCATION</th>
                      <th>SERIAL NO</th>
                      <th>STATUS</th>
                      <th style={{ textAlign: 'right' }}>ADMIN ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {filteredEquipment.slice(0, 15).map((item) => (
                        <motion.tr
                          key={item.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <Link
                              to={`/equipment/${item.id}`}
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
                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                          </td>

                          <td>
                            <Badge variant="orange" size="sm">
                              {item.category_name}
                            </Badge>
                          </td>

                          <td>
                            <div style={{ fontSize: 'var(--text-xs)' }}>{item.lab_name}</div>
                          </td>

                          <td className="font-mono" style={{ fontSize: 'var(--text-xs)' }}>
                            {item.serial_no || '—'}
                          </td>

                          <td>
                            <Badge status={item.status} size="sm" />
                          </td>

                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setFormModalOpen(true);
                                }}
                                className="font-mono"
                                title="Edit Asset Specification"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  padding: '0.22rem 0.45rem',
                                  fontSize: 'var(--text-xs)',
                                  border: '1px solid var(--color-border-default)',
                                  borderRadius: 'var(--radius-xs)',
                                  backgroundColor: 'var(--color-surface)',
                                  color: 'var(--color-text-primary)',
                                  cursor: 'pointer'
                                }}
                              >
                                <Edit size={12} />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => setDeleteModalItem(item)}
                                className="font-mono"
                                title="Delete Asset"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  padding: '0.22rem 0.45rem',
                                  fontSize: 'var(--text-xs)',
                                  border: '1px solid var(--color-status-damaged-border)',
                                  borderRadius: 'var(--radius-xs)',
                                  backgroundColor: 'var(--color-status-damaged-bg)',
                                  color: 'var(--color-status-damaged)',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={12} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add / Edit Equipment Modal */}
        <EquipmentFormModal
          isOpen={formModalOpen}
          initialData={editingItem}
          labs={labs}
          categories={categories}
          onClose={() => {
            setFormModalOpen(false);
            setEditingItem(null);
          }}
          onSuccess={() => {
            fetchDashboardData();
          }}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={!!deleteModalItem}
          equipment={deleteModalItem}
          onClose={() => setDeleteModalItem(null)}
          onSuccess={() => {
            fetchDashboardData();
          }}
        />
      </motion.div>
    </ProtectedRoute>
  );
}
