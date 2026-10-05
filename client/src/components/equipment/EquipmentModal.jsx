import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Check, AlertCircle, Layers } from 'lucide-react';
import { equipmentApi, labsApi, categoriesApi } from '../../api/client';

export default function EquipmentModal({ isOpen, onClose, onSuccess, initialData = null }) {
  const [labs, setLabs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    asset_tag: '',
    name: '',
    model_number: '',
    manufacturer: '',
    serial_number: '',
    category_id: '',
    lab_id: '',
    status: 'available',
    purchase_date: new Date().toISOString().slice(0, 10),
    warranty_expiry: '',
    spec_key1: 'Bandwidth / Range',
    spec_val1: '',
    spec_key2: 'Channels / Capacity',
    spec_val2: '',
    notes: ''
  });

  useEffect(() => {
    Promise.all([labsApi.getAll(), categoriesApi.getAll()])
      .then(([labsRes, catsRes]) => {
        setLabs(labsRes.data || []);
        setCategories(catsRes.data || []);

        if (!initialData && labsRes.data?.length > 0 && catsRes.data?.length > 0) {
          setFormData(prev => ({
            ...prev,
            lab_id: labsRes.data[0].id,
            category_id: catsRes.data[0].id
          }));
        }
      })
      .catch(err => {
        console.error('Error fetching labs/categories:', err);
      });

    if (initialData) {
      setFormData({
        asset_tag: initialData.asset_tag || '',
        name: initialData.name || '',
        model_number: initialData.model_number || '',
        manufacturer: initialData.manufacturer || '',
        serial_number: initialData.serial_number || '',
        category_id: initialData.category_id || '',
        lab_id: initialData.lab_id || '',
        status: initialData.status || 'available',
        purchase_date: initialData.purchase_date ? initialData.purchase_date.slice(0, 10) : '',
        warranty_expiry: initialData.warranty_expiry ? initialData.warranty_expiry.slice(0, 10) : '',
        spec_key1: 'Primary Spec',
        spec_val1: initialData.specifications ? Object.values(initialData.specifications)[0] || '' : '',
        spec_key2: 'Secondary Spec',
        spec_val2: initialData.specifications ? Object.values(initialData.specifications)[1] || '' : '',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const specs = {};
    if (formData.spec_key1 && formData.spec_val1) {
      specs[formData.spec_key1] = formData.spec_val1;
    }
    if (formData.spec_key2 && formData.spec_val2) {
      specs[formData.spec_key2] = formData.spec_val2;
    }

    const payload = {
      asset_tag: formData.asset_tag.trim(),
      name: formData.name.trim(),
      model_number: formData.model_number.trim(),
      manufacturer: formData.manufacturer.trim(),
      serial_number: formData.serial_number.trim(),
      category_id: Number(formData.category_id),
      lab_id: Number(formData.lab_id),
      status: formData.status,
      purchase_date: formData.purchase_date || null,
      warranty_expiry: formData.warranty_expiry || null,
      specifications: specs,
      notes: formData.notes.trim()
    };

    try {
      await equipmentApi.create(payload);
      setLoading(false);
      onSuccess();
    } catch (err) {
      setLoading(false);
      setFormError(err.message || 'Failed to save equipment. Please check input parameters.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="panel-header" style={{ borderTopLeftRadius: 'var(--radius-sm)', borderTopRightRadius: 'var(--radius-sm)' }}>
          <div className="panel-title">
            <Layers size={16} strokeWidth={1.75} color="var(--accent-orange)" />
            <span>{initialData ? 'Edit Asset Specification' : 'Register New Laboratory Asset'}</span>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.2rem 0.4rem' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="panel-body">
          {formError && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--status-damaged-bg)',
              border: '1px solid var(--status-damaged-border)',
              borderRadius: 'var(--radius-xs)',
              color: 'var(--status-damaged)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <AlertCircle size={15} strokeWidth={2} />
              <span>{formError}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Asset Tag / Identifier *</label>
              <input
                type="text"
                name="asset_tag"
                className="form-input font-mono"
                placeholder="EQ-EE-2024-001"
                required
                value={formData.asset_tag}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Operational Status</label>
              <select
                name="status"
                className="form-select font-mono"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="available">Available (In Service)</option>
                <option value="in_use">In Use (Allocated)</option>
                <option value="damaged">Damaged / Needs Repair</option>
                <option value="retired">Retired / Decommissioned</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Instrument / Equipment Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Tektronix TBS1102B-EDU Digital Storage Oscilloscope"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Manufacturer / Brand *</label>
              <input
                type="text"
                name="manufacturer"
                className="form-input"
                placeholder="e.g. Tektronix, Keysight, Olympus"
                required
                value={formData.manufacturer}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Model Number *</label>
              <input
                type="text"
                name="model_number"
                className="form-input font-mono"
                placeholder="e.g. TBS1102B-EDU"
                required
                value={formData.model_number}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Serial Number (SN) *</label>
              <input
                type="text"
                name="serial_number"
                className="form-input font-mono"
                placeholder="e.g. C014982-US"
                required
                value={formData.serial_number}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category_id"
                className="form-select"
                value={formData.category_id}
                onChange={handleChange}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Assigned Laboratory Room *</label>
              <select
                name="lab_id"
                className="form-select"
                value={formData.lab_id}
                onChange={handleChange}
              >
                {labs.map(l => (
                  <option key={l.id} value={l.id}>{l.name} [{l.code}]</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Commission / Purchase Date</label>
              <input
                type="date"
                name="purchase_date"
                className="form-input font-mono"
                value={formData.purchase_date}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Key Spec Parameters */}
          <div style={{
            padding: '0.85rem',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xs)',
            marginBottom: '1rem'
          }}>
            <div className="font-mono" style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.65rem' }}>
              Instrument Technical Parameters
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <input
                  type="text"
                  name="spec_key1"
                  className="form-input"
                  style={{ fontSize: '0.75rem', marginBottom: '0.25rem', padding: '0.35rem 0.5rem' }}
                  placeholder="Param Name (e.g. Bandwidth)"
                  value={formData.spec_key1}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="spec_val1"
                  className="form-input font-mono"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.5rem' }}
                  placeholder="Value (e.g. 100 MHz)"
                  value={formData.spec_val1}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  type="text"
                  name="spec_key2"
                  className="form-input"
                  style={{ fontSize: '0.75rem', marginBottom: '0.25rem', padding: '0.35rem 0.5rem' }}
                  placeholder="Param Name (e.g. Channels)"
                  value={formData.spec_key2}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="spec_val2"
                  className="form-input font-mono"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.5rem' }}
                  placeholder="Value (e.g. 2 Channels)"
                  value={formData.spec_val2}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Deployment Notes & Bench Location</label>
            <textarea
              name="notes"
              className="form-textarea"
              placeholder="e.g. Bench #3, North wall. NIST Traceable Calibration cert #9921."
              value={formData.notes}
              onChange={handleChange}
            />
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
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              <Check size={16} />
              <span>{loading ? 'Registering...' : 'Register Asset'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
