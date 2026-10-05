import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useOutletContext, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Layers, 
  Eye, 
  RefreshCw, 
  Wrench, 
  Building2, 
  Plus,
  SlidersHorizontal,
  ChevronRight,
  Sliders
} from 'lucide-react';
import { equipmentApi, labsApi, categoriesApi } from '../api/client';
import StatusBadge from '../components/common/StatusBadge';
import SpecTag from '../components/common/SpecTag';
import SkeletonLoader from '../components/common/SkeletonLoader';
import StatusDrawer from '../components/equipment/StatusDrawer';
import MaintenanceModal from '../components/maintenance/MaintenanceModal';

export default function EquipmentList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { refreshTrigger, triggerRefresh } = useOutletContext();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedLab, setSelectedLab] = useState(searchParams.get('lab_id') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category_id') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [sortBy, setSortBy] = useState('asset_tag');

  // Drawer / Modal targets
  const [statusDrawerTarget, setStatusDrawerTarget] = useState(null);
  const [maintenanceModalTarget, setMaintenanceModalTarget] = useState(null);

  useEffect(() => {
    Promise.all([labsApi.getAll(), categoriesApi.getAll()])
      .then(([labsRes, catsRes]) => {
        setLabs(labsRes.data || []);
        setCategories(catsRes.data || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    equipmentApi.getAll()
      .then(res => {
        setEquipment(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load equipment list:', err);
        setLoading(false);
      });
  }, [refreshTrigger]);

  // Synchronize search params
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedLab) params.lab_id = selectedLab;
    if (selectedCategory) params.category_id = selectedCategory;
    if (selectedStatus !== 'all') params.status = selectedStatus;
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedLab, selectedCategory, selectedStatus, setSearchParams]);

  // Client-side filtering
  const filteredEquipment = equipment.filter(item => {
    // Status filter
    if (selectedStatus !== 'all' && item.status !== selectedStatus) {
      return false;
    }
    // Lab filter
    if (selectedLab && item.lab_id !== Number(selectedLab)) {
      return false;
    }
    // Category filter
    if (selectedCategory && item.category_id !== Number(selectedCategory)) {
      return false;
    }
    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.asset_tag.toLowerCase().includes(q) ||
        item.model_number.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q) ||
        item.serial_number.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'asset_tag') return a.asset_tag.localeCompare(b.asset_tag);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    if (sortBy === 'last_serviced') return (b.last_serviced || '').localeCompare(a.last_serviced || '');
    return 0;
  });

  const statusOptions = [
    { id: 'all', label: 'ALL ASSETS', count: equipment.length },
    { id: 'available', label: 'AVAILABLE', count: equipment.filter(e => e.status === 'available').length },
    { id: 'in_use', label: 'IN USE', count: equipment.filter(e => e.status === 'in_use').length },
    { id: 'damaged', label: 'DAMAGED', count: equipment.filter(e => e.status === 'damaged').length },
    { id: 'retired', label: 'RETIRED', count: equipment.filter(e => e.status === 'retired').length }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-default)'
      }}>
        <div>
          <div className="font-mono" style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            EQUIPMENT REGISTRY & ASSET LEDGER
          </div>
          <h1 style={{ margin: 0 }}>Laboratory Instruments & Hardware</h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>
            Tabular spec sheet view of all commissioned campus laboratory equipment.
          </p>
        </div>

        <div className="font-mono" style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          padding: '0.5rem 0.85rem',
          borderRadius: 'var(--radius-xs)',
          fontSize: '0.775rem'
        }}>
          FILTERED: <strong style={{ color: 'var(--accent-orange)' }}>{filteredEquipment.length}</strong> / {equipment.length} TOTAL UNITS
        </div>
      </div>

      {/* Filter Control Bar */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xs)',
        padding: '1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        {/* Status Tab Toggle Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
          {statusOptions.map((opt) => {
            const isActive = selectedStatus === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedStatus(opt.id)}
                className="btn btn-sm font-mono"
                style={{
                  backgroundColor: isActive ? 'var(--text-primary)' : 'var(--bg-subtle)',
                  color: isActive ? 'var(--bg-canvas)' : 'var(--text-primary)',
                  borderColor: isActive ? 'var(--text-primary)' : 'var(--border-default)',
                  fontWeight: isActive ? 700 : 500
                }}
              >
                <span>{opt.label}</span>
                <span style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--border-default)',
                  padding: '0.05rem 0.35rem',
                  borderRadius: '2px',
                  fontSize: '0.7rem',
                  marginLeft: '0.25rem'
                }}>
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search and Dropdowns Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '0.75rem' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input font-mono"
              placeholder="Search tag, model, serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2rem', fontSize: '0.8rem' }}
            />
          </div>

          {/* Lab Filter Dropdown */}
          <select
            className="form-select"
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            style={{ fontSize: '0.8rem' }}
          >
            <option value="">All Laboratory Rooms</option>
            {labs.map(l => (
              <option key={l.id} value={l.id}>{l.name} ({l.code})</option>
            ))}
          </select>

          {/* Category Filter Dropdown */}
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ fontSize: '0.8rem' }}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            className="form-select font-mono"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ fontSize: '0.8rem' }}
          >
            <option value="asset_tag">Sort: Asset Tag</option>
            <option value="name">Sort: Instrument Name</option>
            <option value="status">Sort: Operational Status</option>
            <option value="last_serviced">Sort: Service Date</option>
          </select>
        </div>
      </div>

      {/* Technical Spec Sheet Table */}
      {loading ? (
        <SkeletonLoader count={6} height="52px" />
      ) : filteredEquipment.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xs)',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <Layers size={32} color="var(--text-muted)" strokeWidth={1.5} style={{ margin: '0 auto 0.75rem auto', display: 'block' }} />
          <h3 style={{ marginBottom: '0.25rem' }}>No Equipment Found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            No instruments match the current search filters ({searchTerm ? `"${searchTerm}"` : 'active filters'}).
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedLab('');
              setSelectedCategory('');
              setSelectedStatus('all');
            }}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '0.75rem' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="spec-table-container">
          <table className="spec-table">
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Instrument / Description</th>
                <th>Model & Serial No</th>
                <th>Facility Lab</th>
                <th>Status</th>
                <th>Last Service</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredEquipment.map((item) => (
                  <motion.tr
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Asset Tag */}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <Link
                        to={`/equipment/${item.id}`}
                        className="font-mono"
                        style={{
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          textDecoration: 'underline',
                          textDecorationColor: 'var(--accent-orange)',
                          textUnderlineOffset: '3px'
                        }}
                      >
                        {item.asset_tag}
                      </Link>
                    </td>

                    {/* Instrument Name */}
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        <Link to={`/equipment/${item.id}`}>{item.name}</Link>
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                        Mfg: {item.manufacturer} • {item.category_name}
                      </div>
                    </td>

                    {/* Model & SN */}
                    <td className="font-mono" style={{ fontSize: '0.775rem' }}>
                      <div>MOD: {item.model_number}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>SN: {item.serial_number}</div>
                    </td>

                    {/* Assigned Lab */}
                    <td>
                      <div style={{ fontWeight: 500, fontSize: '0.8rem' }}>{item.lab_name}</div>
                      <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {item.lab_location}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    {/* Last Serviced */}
                    <td className="font-mono" style={{ fontSize: '0.75rem' }}>
                      {item.last_serviced ? (
                        <div>
                          <div>{item.last_serviced}</div>
                          {item.next_service_due && (
                            <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>
                              Due: {item.next_service_due}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>No record</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          onClick={() => setStatusDrawerTarget(item)}
                          className="btn btn-secondary btn-sm"
                          title="Transition Status"
                          style={{ padding: '0.25rem 0.45rem' }}
                        >
                          <RefreshCw size={12} strokeWidth={1.75} />
                          <span style={{ fontSize: '0.7rem' }}>Status</span>
                        </button>

                        <button
                          onClick={() => setMaintenanceModalTarget(item)}
                          className="btn btn-secondary btn-sm"
                          title="Log Calibration / Repair"
                          style={{ padding: '0.25rem 0.45rem' }}
                        >
                          <Wrench size={12} strokeWidth={1.75} />
                          <span style={{ fontSize: '0.7rem' }}>Service</span>
                        </button>

                        <Link
                          to={`/equipment/${item.id}`}
                          className="btn btn-dark btn-sm"
                          style={{ padding: '0.25rem 0.45rem' }}
                        >
                          <Eye size={12} strokeWidth={1.75} />
                          <span style={{ fontSize: '0.7rem' }}>Spec</span>
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-in Status Drawer */}
      <AnimatePresence>
        {statusDrawerTarget && (
          <StatusDrawer
            equipment={statusDrawerTarget}
            isOpen={!!statusDrawerTarget}
            onClose={() => setStatusDrawerTarget(null)}
            onSuccess={() => {
              triggerRefresh();
              setStatusDrawerTarget(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Maintenance Service Modal */}
      <AnimatePresence>
        {maintenanceModalTarget && (
          <MaintenanceModal
            isOpen={!!maintenanceModalTarget}
            preselectedEquipment={maintenanceModalTarget}
            onClose={() => setMaintenanceModalTarget(null)}
            onSuccess={() => {
              triggerRefresh();
              setMaintenanceModalTarget(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
