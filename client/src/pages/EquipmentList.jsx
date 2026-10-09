import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  Plus,
  Filter,
  X,
  SlidersHorizontal,
  Layers,
  MapPin,
  Barcode,
  Calendar,
  Eye,
  Activity,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

import { equipmentApi, labsApi, categoriesApi } from '../api/client';
import useDebounce from '../hooks/useDebounce';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Drawer from '../components/ui/Drawer';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import EquipmentCardMedia from '../components/equipment/EquipmentCardMedia';
import { SadComputerIllustration, FloppyEmptyIllustration } from '../assets';

// Animation Variants for Staggered Grid & List Entry
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function EquipmentList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  // Primary Data States
  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [labFilter, setLabFilter] = useState(searchParams.get('lab') || 'all');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [sortBy, setSortBy] = useState('asset_tag');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal / Drawer Active States
  const [selectedDrawerItem, setSelectedDrawerItem] = useState(null);
  const [statusModalTarget, setStatusModalTarget] = useState(null);
  const [newStatusValue, setNewStatusValue] = useState('available');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Custom Debounce Hook for Search Input
  const debouncedSearch = useDebounce(search, 280);

  // Fetch Equipment & Metadata from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [eqRes, labsRes, catsRes] = await Promise.all([
        equipmentApi.getAll({ limit: 100 }),
        labsApi.getAll(),
        categoriesApi.getAll()
      ]);

      setEquipment(eqRes.data || []);
      setLabs(labsRes.data || []);
      setCategories(catsRes.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch equipment data:', err);
      setError(err.message || 'Unable to establish connection with LabTrack backend.');
      setLoading(false);
      toast.error('Failed to load equipment ledger from server.', 'Connection Error');
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Synchronize URL query parameters for shareability
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (labFilter !== 'all') params.lab = labFilter;
    if (categoryFilter !== 'all') params.category = categoryFilter;
    if (statusFilter !== 'all') params.status = statusFilter;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, labFilter, categoryFilter, statusFilter, setSearchParams]);

  // Compute Filtered and Sorted Equipment List
  const filteredEquipment = useMemo(() => {
    return equipment
      .filter((item) => {
        // Status Filter
        if (statusFilter !== 'all' && item.status !== statusFilter) {
          return false;
        }
        // Lab Filter
        if (labFilter !== 'all' && item.lab_id !== Number(labFilter)) {
          return false;
        }
        // Category Filter
        if (categoryFilter !== 'all' && item.category_id !== Number(categoryFilter)) {
          return false;
        }
        // Search Query Filter
        if (debouncedSearch.trim()) {
          const q = debouncedSearch.toLowerCase();
          const matches =
            item.name?.toLowerCase().includes(q) ||
            item.asset_tag?.toLowerCase().includes(q) ||
            item.serial_no?.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q) ||
            item.lab_name?.toLowerCase().includes(q) ||
            item.category_name?.toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'asset_tag') return (a.asset_tag || '').localeCompare(b.asset_tag || '');
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '');
        if (sortBy === 'lab') return (a.lab_name || '').localeCompare(b.lab_name || '');
        if (sortBy === 'date') return (b.purchase_date || '').localeCompare(a.purchase_date || '');
        return 0;
      });
  }, [equipment, statusFilter, labFilter, categoryFilter, debouncedSearch, sortBy]);

  // Count items by status for status filter chips
  const statusCounts = useMemo(() => {
    const counts = {
      all: equipment.length,
      available: 0,
      allocated: 0,
      under_maintenance: 0,
      damaged: 0,
      retired: 0
    };
    equipment.forEach((item) => {
      if (counts[item.status] !== undefined) {
        counts[item.status]++;
      }
    });
    return counts;
  }, [equipment]);

  // Reset all filters helper
  const handleResetFilters = () => {
    setSearch('');
    setLabFilter('all');
    setCategoryFilter('all');
    setStatusFilter('all');
    setSortBy('asset_tag');
  };

  const isFiltered =
    search.trim() !== '' ||
    labFilter !== 'all' ||
    categoryFilter !== 'all' ||
    statusFilter !== 'all';

  // Quick Status Transition Handler
  const handleOpenStatusModal = (item) => {
    setStatusModalTarget(item);
    setNewStatusValue(item.status);
  };

  const handleUpdateStatus = async () => {
    if (!statusModalTarget) return;
    setStatusUpdating(true);
    try {
      await equipmentApi.update(statusModalTarget.id, {
        ...statusModalTarget,
        status: newStatusValue
      });
      toast.success(
        `Equipment ${statusModalTarget.asset_tag} transitioned to ${newStatusValue.toUpperCase()}.`,
        'Status Updated'
      );
      setStatusModalTarget(null);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to update equipment status.', 'Update Error');
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner / Header Bar */}
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
              marginBottom: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Barcode size={14} strokeWidth={2} />
            <span>COMMISSIONED HARDWARE LEDGER</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>Laboratory Equipment & Instruments</h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Calibrated instrument registry, active assignments, and facility hardware specifications.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Refresh Action */}
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchData}
            loading={loading}
            icon={RefreshCw}
            title="Reload latest records from API"
          >
            Sync
          </Button>

          {/* Animated Filter Count Pill */}
          <div
            className="font-mono"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--text-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span style={{ color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Filtered:</span>
            <motion.span
              key={filteredEquipment.length}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{ fontWeight: 800, color: 'var(--color-accent-orange)' }}
            >
              {filteredEquipment.length}
            </motion.span>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{equipment.length}</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.675rem' }}>ITEMS</span>
          </div>

          {/* View Mode Switcher */}
          <div
            style={{
              display: 'inline-flex',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--color-surface)',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.45rem 0.65rem',
                border: 'none',
                backgroundColor: viewMode === 'grid' ? 'var(--color-text-primary)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--color-canvas)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <LayoutGrid size={15} strokeWidth={2} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.45rem 0.65rem',
                border: 'none',
                borderLeft: '1px solid var(--color-border-subtle)',
                backgroundColor: viewMode === 'table' ? 'var(--color-text-primary)' : 'transparent',
                color: viewMode === 'table' ? 'var(--color-canvas)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <TableIcon size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Control Panel */}
      <div
        className="spec-sheet-panel"
        style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}
      >
        {/* Status Tab Chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.4rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            paddingBottom: '0.85rem'
          }}
        >
          {[
            { id: 'all', label: 'ALL ASSETS' },
            { id: 'available', label: 'AVAILABLE', status: 'available' },
            { id: 'allocated', label: 'ALLOCATED', status: 'allocated' },
            { id: 'under_maintenance', label: 'UNDER MAINTENANCE', status: 'under_maintenance' },
            { id: 'damaged', label: 'DAMAGED', status: 'damaged' },
            { id: 'retired', label: 'RETIRED', status: 'retired' }
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            const count = statusCounts[tab.id] || 0;

            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className="font-mono"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
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
                {tab.status && (
                  <span
                    className={tab.status === 'available' || tab.status === 'under_maintenance' ? 'status-pulse-dot' : ''}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor:
                        tab.status === 'available'
                          ? 'var(--color-status-available)'
                          : tab.status === 'allocated'
                          ? 'var(--color-status-allocated)'
                          : tab.status === 'under_maintenance'
                          ? 'var(--color-status-maintenance)'
                          : tab.status === 'damaged'
                          ? 'var(--color-status-damaged)'
                          : 'var(--color-status-retired)'
                    }}
                  />
                )}
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
                  {count}
                </span>
              </button>
            );
          })}

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              style={{
                marginLeft: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-accent-orange)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                padding: '0.35rem 0.5rem'
              }}
            >
              <X size={13} />
              <span>CLEAR FILTERS</span>
            </button>
          )}
        </div>

        {/* Search and Dropdown Controls Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}
        >
          {/* Search Input with Debounce */}
          <div style={{ gridColumn: 'span 2', minWidth: '240px' }}>
            <Input
              placeholder="Search tag (EQ-IT-001), instrument name, serial, specs..."
              icon={Search}
              mono
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>

          {/* Laboratory Filter Dropdown */}
          <Select
            value={labFilter}
            onChange={(e) => setLabFilter(e.target.value)}
            style={{ marginBottom: 0 }}
          >
            <option value="all">All Laboratory Facilities ({labs.length})</option>
            {labs.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.name} ({lab.location || `Lab ${lab.id}`})
              </option>
            ))}
          </Select>

          {/* Category Filter Dropdown */}
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ marginBottom: 0 }}
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>

          {/* Sort Order Selector */}
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ marginBottom: 0 }}
            mono
          >
            <option value="asset_tag">Sort: Asset Tag (ASC)</option>
            <option value="name">Sort: Instrument Name</option>
            <option value="status">Sort: Operational Status</option>
            <option value="lab">Sort: Lab Location</option>
            <option value="date">Sort: Acquired Date (Newest)</option>
          </Select>
        </div>
      </div>

      {/* Error Alert Display */}
      {error && (
        <div
          style={{
            backgroundColor: 'var(--color-status-damaged-bg)',
            border: '1px solid var(--color-status-damaged-border)',
            borderLeft: '4px solid var(--color-status-damaged)',
            borderRadius: 'var(--radius-xs)',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AlertTriangle size={18} color="var(--color-status-damaged)" strokeWidth={2} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-status-damaged)' }}>
                System Telemetry Failure
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                {error}
              </div>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={fetchData}>
            Retry API
          </Button>
        </div>
      )}

      {/* Main Content Area: Skeleton / Empty State / Grid / Table */}
      {loading ? (
        viewMode === 'grid' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
              gap: '1rem'
            }}
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="spec-sheet-panel"
                style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Skeleton width="90px" height="18px" />
                  <Skeleton width="80px" height="20px" />
                </div>
                <Skeleton width="85%" height="22px" />
                <Skeleton width="60%" height="16px" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Skeleton height="36px" />
                  <Skeleton height="36px" />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Skeleton width="50%" height="30px" />
                  <Skeleton width="50%" height="30px" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Skeleton variant="table" rows={7} columns={7} />
        )
      ) : filteredEquipment.length === 0 ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <EmptyState
              illustration={isFiltered ? SadComputerIllustration : FloppyEmptyIllustration}
              title={isFiltered ? "No Equipment Matched Query" : "No Equipment in Registry"}
              description={
                isFiltered
                  ? `No laboratory instruments matched your active search query "${search}" and selected filters. Try adjusting criteria or clearing filters.`
                  : 'No equipment items currently commissioned in the laboratory inventory.'
              }
              action={
                isFiltered ? (
                  <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                    Reset All Filters
                  </Button>
                ) : null
              }
            />
          </motion.div>
        </AnimatePresence>
      ) : viewMode === 'grid' ? (
        /* =========================================================================
           GRID VIEW WITH STAGGERED ENTRY & LAYOUT ANIMATIONS
           ========================================================================= */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.15rem'
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredEquipment.map((item) => (
              <motion.div
                key={item.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className="spec-sheet-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                {/* Card Header with Asset Tag & Status Badge */}
                <div
                  style={{
                    padding: '0.65rem 0.95rem',
                    backgroundColor: 'var(--color-surface-subtle)',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Link
                    to={`/equipment/${item.id}`}
                    className="font-mono"
                    style={{
                      fontWeight: 800,
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-primary)',
                      letterSpacing: '0.04em',
                      textDecoration: 'underline',
                      textDecorationColor: 'var(--color-accent-orange)',
                      textUnderlineOffset: '3px'
                    }}
                  >
                    {item.asset_tag}
                  </Link>

                  <Badge status={item.status} size="sm" />
                </div>

                {/* Retro Risograph Illustration / Duotone Photo */}
                <EquipmentCardMedia equipment={item} height="135px" />

                {/* Card Body */}
                <div style={{ padding: '0.95rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 'var(--text-md)',
                        fontWeight: 700,
                        lineHeight: 1.3
                      }}
                    >
                      <Link
                        to={`/equipment/${item.id}`}
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {item.name}
                      </Link>
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '0.45rem',
                        marginTop: '0.35rem'
                      }}
                    >
                      <Badge variant="orange" size="sm">
                        {item.category_name}
                      </Badge>

                      <span
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-secondary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <MapPin size={12} strokeWidth={1.75} />
                        <span>{item.lab_name}</span>
                      </span>
                    </div>
                  </div>

                  {/* Technical Spec Matrix */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem',
                      padding: '0.65rem 0.75rem',
                      backgroundColor: 'var(--color-surface-subtle)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: 'var(--radius-xs)'
                    }}
                  >
                    <div>
                      <div
                        className="font-mono"
                        style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}
                      >
                        SERIAL NO.
                      </div>
                      <div
                        className="font-mono"
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 700,
                          color: 'var(--color-text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.serial_no || 'N/A'}
                      </div>
                    </div>

                    <div>
                      <div
                        className="font-mono"
                        style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}
                      >
                        ACQUIRED
                      </div>
                      <div
                        className="font-mono"
                        style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-primary)' }}
                      >
                        {item.purchase_date ? String(item.purchase_date).slice(0, 10) : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Description Excerpt */}
                  {item.description && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Card Action Footer */}
                <div
                  style={{
                    padding: '0.65rem 1rem',
                    borderTop: '1px solid var(--color-border-subtle)',
                    backgroundColor: 'var(--color-surface-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDrawerItem(item)}
                    icon={Eye}
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    Quick Spec
                  </Button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenStatusModal(item)}
                      style={{ padding: '0.25rem 0.5rem' }}
                    >
                      Status
                    </Button>

                    <Link to={`/equipment/${item.id}`}>
                      <Button
                        variant="dark"
                        size="sm"
                        icon={ExternalLink}
                        iconPosition="right"
                        style={{ padding: '0.25rem 0.55rem' }}
                      >
                        Detail
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* =========================================================================
           TABLE VIEW WITH SPEC SHEET FORMAT & FLUID ROW ANIMATIONS
           ========================================================================= */
        <div className="spec-table-container">
          <table className="spec-table">
            <thead>
              <tr>
                <th>ASSET TAG</th>
                <th>INSTRUMENT NAME & SPECIFICATION</th>
                <th>CATEGORY</th>
                <th>LAB FACILITY</th>
                <th>SERIAL NUMBER</th>
                <th>PURCHASE DATE</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
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
                    transition={{ duration: 0.18 }}
                  >
                    {/* Asset Tag */}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <Link
                        to={`/equipment/${item.id}`}
                        className="font-mono"
                        style={{
                          fontWeight: 800,
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-primary)',
                          textDecoration: 'underline',
                          textDecorationColor: 'var(--color-accent-orange)',
                          textUnderlineOffset: '3px'
                        }}
                      >
                        {item.asset_tag}
                      </Link>
                    </td>

                    {/* Instrument Name */}
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
                        <Link to={`/equipment/${item.id}`}>{item.name}</Link>
                      </div>
                      {item.description && (
                        <div
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--color-text-muted)',
                            marginTop: '2px',
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.description}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td>
                      <Badge variant="orange" size="sm">
                        {item.category_name}
                      </Badge>
                    </td>

                    {/* Assigned Facility */}
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>{item.lab_name}</div>
                      <div className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)' }}>
                        {item.lab_location || 'Room ' + item.lab_id}
                      </div>
                    </td>

                    {/* Serial No */}
                    <td className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                      {item.serial_no || '—'}
                    </td>

                    {/* Purchase Date */}
                    <td className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                      {item.purchase_date ? String(item.purchase_date).slice(0, 10) : '—'}
                    </td>

                    {/* Operational Status */}
                    <td>
                      <Badge status={item.status} size="sm" />
                    </td>

                    {/* Action Controls */}
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          onClick={() => setSelectedDrawerItem(item)}
                          className="font-mono"
                          title="Quick Spec Drawer"
                          style={{
                            padding: '0.22rem 0.45rem',
                            fontSize: 'var(--text-xs)',
                            border: '1px solid var(--color-border-default)',
                            borderRadius: 'var(--radius-xs)',
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer'
                          }}
                        >
                          Spec
                        </button>

                        <button
                          onClick={() => handleOpenStatusModal(item)}
                          className="font-mono"
                          title="Transition Status"
                          style={{
                            padding: '0.22rem 0.45rem',
                            fontSize: 'var(--text-xs)',
                            border: '1px solid var(--color-border-default)',
                            borderRadius: 'var(--radius-xs)',
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text-primary)',
                            cursor: 'pointer'
                          }}
                        >
                          Status
                        </button>

                        <Link
                          to={`/equipment/${item.id}`}
                          className="font-mono"
                          style={{
                            padding: '0.22rem 0.5rem',
                            fontSize: 'var(--text-xs)',
                            border: '1px solid var(--color-text-primary)',
                            borderRadius: 'var(--radius-xs)',
                            backgroundColor: 'var(--color-text-primary)',
                            color: 'var(--color-canvas)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <span>Open</span>
                          <ChevronRight size={12} />
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

      {/* =========================================================================
         QUICK SPECIFICATION DRAWER
         ========================================================================= */}
      <Drawer
        isOpen={!!selectedDrawerItem}
        onClose={() => setSelectedDrawerItem(null)}
        title={selectedDrawerItem ? selectedDrawerItem.asset_tag : 'Asset Specification'}
        subtitle={selectedDrawerItem ? selectedDrawerItem.name : ''}
        icon={Layers}
        footer={
          selectedDrawerItem && (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedDrawerItem(null)}
              >
                Close Drawer
              </Button>
              <Link to={`/equipment/${selectedDrawerItem.id}`}>
                <Button variant="primary" size="sm" icon={ExternalLink} iconPosition="right">
                  Full Spec Sheet
                </Button>
              </Link>
            </div>
          )
        }
      >
        {selectedDrawerItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Status Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-xs)'
              }}
            >
              <div>
                <div className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  OPERATIONAL STATE
                </div>
                <div style={{ marginTop: '3px' }}>
                  <Badge status={selectedDrawerItem.status} />
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  handleOpenStatusModal(selectedDrawerItem);
                }}
              >
                Change Status
              </Button>
            </div>

            {/* Spec Matrix List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <h4 style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                CORE TELEMETRY & INVENTORY PARAMETERS
              </h4>

              <div
                style={{
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-surface)'
                }}
              >
                {[
                  { label: 'ASSET TAG', value: selectedDrawerItem.asset_tag, mono: true, strong: true },
                  { label: 'EQUIPMENT NAME', value: selectedDrawerItem.name },
                  { label: 'CATEGORY', value: selectedDrawerItem.category_name },
                  { label: 'ASSIGNED LAB', value: `${selectedDrawerItem.lab_name} (${selectedDrawerItem.lab_location || 'Campus'})` },
                  { label: 'SERIAL NUMBER', value: selectedDrawerItem.serial_no || 'Not Registered', mono: true },
                  { label: 'PURCHASE DATE', value: selectedDrawerItem.purchase_date ? String(selectedDrawerItem.purchase_date).slice(0, 10) : 'Not Specified', mono: true }
                ].map((row, rIdx) => (
                  <div
                    key={rIdx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '130px 1fr',
                      padding: '0.55rem 0.85rem',
                      borderBottom: rIdx < 5 ? '1px solid var(--color-border-subtle)' : 'none',
                      backgroundColor: rIdx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-subtle)',
                      fontSize: 'var(--text-xs)'
                    }}
                  >
                    <span
                      className="font-mono"
                      style={{ color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}
                    >
                      {row.label}
                    </span>
                    <span
                      className={row.mono ? 'font-mono' : ''}
                      style={{
                        color: row.strong ? 'var(--color-accent-orange)' : 'var(--color-text-primary)',
                        fontWeight: row.strong ? 700 : 500
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Notes */}
            {selectedDrawerItem.description && (
              <div>
                <h4 style={{ margin: '0 0 0.4rem 0', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  BENCH LOCATION & SPECIFICATION NOTES
                </h4>
                <div
                  style={{
                    padding: '0.85rem',
                    backgroundColor: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.45,
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {selectedDrawerItem.description}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* =========================================================================
         QUICK STATUS TRANSITION MODAL
         ========================================================================= */}
      <Modal
        isOpen={!!statusModalTarget}
        onClose={() => setStatusModalTarget(null)}
        title="Transition Asset Status"
        subtitle={statusModalTarget ? `${statusModalTarget.asset_tag} • ${statusModalTarget.name}` : ''}
        icon={Activity}
        accentEdge
        maxWidth="480px"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStatusModalTarget(null)}
              disabled={statusUpdating}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleUpdateStatus}
              loading={statusUpdating}
              icon={Check}
            >
              Apply Status Update
            </Button>
          </>
        }
      >
        {statusModalTarget && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Select new operational state for <strong>{statusModalTarget.name}</strong>. All state transitions are logged in the facility activity ledger.
            </p>

            <Select
              label="Select Operational Status"
              value={newStatusValue}
              onChange={(e) => setNewStatusValue(e.target.value)}
              mono
            >
              <option value="available">Available (Operational / Ready for Allocation)</option>
              <option value="allocated">Allocated (Currently Checked Out)</option>
              <option value="under_maintenance">Under Maintenance (In Calibration / Repair)</option>
              <option value="damaged">Damaged (Fault Reported / Out of Service)</option>
              <option value="retired">Retired (Decommissioned)</option>
            </Select>

            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}
            >
              <ShieldCheck size={16} color="var(--color-accent-orange)" />
              <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                Current Database Status: <strong>{statusModalTarget.status.toUpperCase()}</strong>
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
