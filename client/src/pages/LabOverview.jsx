import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Layers,
  MapPin,
  User,
  Mail,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { labsApi, equipmentApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { getLabBanner } from '../assets';

export default function LabOverview() {
  const { isStaff, isAdmin } = useAuth();
  const toast = useToast();

  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddLabModalOpen, setIsAddLabModalOpen] = useState(false);
  const [newLabData, setNewLabData] = useState({
    name: '',
    location: '',
    incharge_id: 1
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchLabs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await labsApi.getAll();
      setLabs(res.data || []);
    } catch (err) {
      console.error('Failed to load labs:', err);
      toast.error('Failed to load laboratory facilities from server.', 'Connection Error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  const handleCreateLab = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);

    if (!newLabData.name.trim() || !newLabData.location.trim()) {
      setModalError('Laboratory name and campus room location are required.');
      setSubmitting(false);
      return;
    }

    try {
      await labsApi.create({
        name: newLabData.name.trim(),
        location: newLabData.location.trim(),
        incharge_id: Number(newLabData.incharge_id) || 1
      });
      toast.success(`Laboratory room "${newLabData.name}" registered.`, 'Facility Created');
      setSubmitting(false);
      setIsAddLabModalOpen(false);
      setNewLabData({ name: '', location: '', incharge_id: 1 });
      fetchLabs();
    } catch (err) {
      setSubmitting(false);
      setModalError(err.message || 'Failed to create laboratory room.');
      toast.error(err.message || 'Failed to register facility.', 'Creation Error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {/* Header */}
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
              gap: '0.4rem'
            }}
          >
            <Building2 size={14} />
            <span>CAMPUS FACILITY DIRECTORY</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>Laboratory Rooms & Research Facilities</h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Departmental laboratory spaces, allocated equipment capacity, and faculty in-charge assignments.
          </p>
        </div>

        {isStaff && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsAddLabModalOpen(true)}
          >
            Add Laboratory Facility
          </Button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.15rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="spec-sheet-panel" style={{ padding: '1.25rem' }}>
              <Skeleton width="60%" height="20px" />
              <div style={{ margin: '0.75rem 0' }}><Skeleton width="80%" height="14px" /></div>
              <Skeleton height="70px" />
            </div>
          ))}
        </div>
      ) : labs.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Laboratory Facilities Found"
          description="No campus research laboratory rooms are currently registered."
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {labs.map((lab) => {
            const total = Number(lab.total_equipment || 0);
            const avail = Number(lab.available_count || 0);
            const inUse = Number(lab.allocated_count || 0);
            const damaged = Number(lab.damaged_count || 0);

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
                    <Building2 size={15} color="var(--color-accent-orange)" strokeWidth={1.75} />
                    <span className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                      ROOM #{lab.id}
                    </span>
                  </div>
                  <Badge variant="default" size="sm">
                    {total} Instruments
                  </Badge>
                </div>

                {/* Risograph Lab Theme Banner */}
                <div
                  style={{
                    width: '100%',
                    height: '110px',
                    backgroundColor: 'var(--color-surface-subtle)',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    overflow: 'hidden'
                  }}
                >
                  {getLabBanner(lab, { width: '100%', height: '100%' })}
                </div>

                <div className="panel-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', margin: '0 0 0.35rem 0', fontWeight: 700 }}>
                      {lab.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                      <MapPin size={13} style={{ opacity: 0.7 }} />
                      <span>{lab.location}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '0.65rem 0.85rem',
                      backgroundColor: 'var(--color-surface-subtle)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: 'var(--text-xs)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <User size={13} color="var(--color-text-muted)" />
                      <span>Faculty In-Charge: <strong>{lab.incharge_name || 'Assigned Staff'}</strong></span>
                    </div>
                    {lab.incharge_email && (
                      <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginLeft: '1.25rem', marginTop: '2px' }}>
                        {lab.incharge_email}
                      </div>
                    )}
                  </div>

                  {/* Allocation Status Matrix */}
                  <div style={{ marginTop: 'auto' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.5rem',
                        textAlign: 'center',
                        marginBottom: '0.85rem'
                      }}
                    >
                      <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '0.4rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border-subtle)' }}>
                        <div className="font-mono" style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--color-status-available)' }}>
                          {avail}
                        </div>
                        <div className="font-mono" style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>AVAILABLE</div>
                      </div>

                      <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '0.4rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border-subtle)' }}>
                        <div className="font-mono" style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--color-status-allocated)' }}>
                          {inUse}
                        </div>
                        <div className="font-mono" style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>ALLOCATED</div>
                      </div>

                      <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '0.4rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border-subtle)' }}>
                        <div className="font-mono" style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--color-status-damaged)' }}>
                          {damaged}
                        </div>
                        <div className="font-mono" style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>DAMAGED</div>
                      </div>
                    </div>

                    <Link to={`/equipment?lab=${lab.id}`} style={{ width: '100%', display: 'block' }}>
                      <Button variant="secondary" size="sm" fullWidth icon={ArrowRight} iconPosition="right">
                        Inspect Lab Inventory
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Lab Modal */}
      <Modal
        isOpen={isAddLabModalOpen}
        onClose={() => setIsAddLabModalOpen(false)}
        title="Register Laboratory Workspace"
        subtitle="Commission campus room & faculty incharge"
        icon={Building2}
        accentEdge
        maxWidth="500px"
      >
        <form onSubmit={handleCreateLab} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {modalError && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--color-status-damaged-bg)',
                border: '1px solid var(--color-status-damaged-border)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--color-status-damaged)',
                fontSize: 'var(--text-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={15} />
              <span>{modalError}</span>
            </div>
          )}

          <Input
            label="Laboratory Name *"
            placeholder="e.g. Applied Optics & Laser Systems Lab"
            required
            value={newLabData.name}
            onChange={(e) => setNewLabData(p => ({ ...p, name: e.target.value }))}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Campus Room / Location *"
            placeholder="e.g. Room 410, North Science Complex"
            required
            value={newLabData.location}
            onChange={(e) => setNewLabData(p => ({ ...p, location: e.target.value }))}
            style={{ marginBottom: 0 }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-subtle)' }}>
            <Button variant="secondary" type="button" onClick={() => setIsAddLabModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              Register Laboratory
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
