import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Check, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { equipmentApi } from '../../api/client';
import { useToast } from '../ui/Toast';

export default function EquipmentFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
  labs = [],
  categories = []
}) {
  const isEdit = Boolean(initialData);
  const toast = useToast();

  const [formData, setFormData] = useState({
    asset_tag: '',
    name: '',
    category_id: '',
    lab_id: '',
    serial_no: '',
    purchase_date: new Date().toISOString().slice(0, 10),
    status: 'available',
    image_url: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState('idle'); // 'idle' | 'loading' | 'success'
  const [generalError, setGeneralError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        asset_tag: initialData.asset_tag || '',
        name: initialData.name || '',
        category_id: initialData.category_id || (categories[0]?.id || ''),
        lab_id: initialData.lab_id || (labs[0]?.id || ''),
        serial_no: initialData.serial_no || '',
        purchase_date: initialData.purchase_date ? String(initialData.purchase_date).slice(0, 10) : '',
        status: initialData.status || 'available',
        image_url: initialData.image_url || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        asset_tag: '',
        name: '',
        category_id: categories[0]?.id || '',
        lab_id: labs[0]?.id || '',
        serial_no: '',
        purchase_date: new Date().toISOString().slice(0, 10),
        status: 'available',
        image_url: '',
        description: ''
      });
    }
    setErrors({});
    setGeneralError(null);
    setSubmitState('idle');
  }, [initialData, isOpen, labs, categories]);

  const validateField = (field, value) => {
    let err = null;
    if (field === 'asset_tag') {
      if (!value || !value.trim()) err = 'Asset Tag is required.';
      else if (value.trim().length < 3) err = 'Tag must be at least 3 characters.';
    }
    if (field === 'name') {
      if (!value || !value.trim()) err = 'Instrument Name is required.';
      else if (value.trim().length < 3) err = 'Name must be at least 3 characters.';
    }
    if (field === 'serial_no') {
      if (!value || !value.trim()) err = 'Serial Number is required.';
    }
    if (field === 'category_id') {
      if (!value) err = 'Category selection is required.';
    }
    if (field === 'lab_id') {
      if (!value) err = 'Assigned Laboratory is required.';
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time field validation on change
    const fieldErr = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldErr }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldErr = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldErr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    // Full form validation check
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setGeneralError('Please resolve indicated parameter validation errors.');
      return;
    }

    setSubmitState('loading');

    const payload = {
      asset_tag: formData.asset_tag.trim().toUpperCase(),
      name: formData.name.trim(),
      category_id: Number(formData.category_id),
      lab_id: Number(formData.lab_id),
      serial_no: formData.serial_no.trim(),
      purchase_date: formData.purchase_date || null,
      status: formData.status,
      image_url: formData.image_url ? formData.image_url.trim() : null,
      description: formData.description ? formData.description.trim() : null
    };

    try {
      if (isEdit) {
        await equipmentApi.update(initialData.id, payload);
        toast.success(`Equipment [${payload.asset_tag}] updated successfully.`, 'Asset Updated');
      } else {
        await equipmentApi.create(payload);
        toast.success(`Equipment [${payload.asset_tag}] registered in ledger.`, 'Asset Registered');
      }

      setSubmitState('success');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1100);
    } catch (err) {
      setSubmitState('idle');
      setGeneralError(err.message || 'Operation failed. Check server response.');
      toast.error(err.message || 'Failed to save equipment.', 'Server Error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={submitState === 'loading' ? () => {} : onClose}
      title={isEdit ? 'Edit Equipment Specification' : 'Register New Laboratory Instrument'}
      subtitle={isEdit ? `ID: #${initialData.id} • ${initialData.asset_tag}` : 'Calibrated Campus Hardware Registry'}
      icon={Layers}
      accentEdge
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {generalError && (
          <div
            style={{
              padding: '0.75rem 1rem',
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
            <AlertCircle size={15} strokeWidth={2} />
            <span>{generalError}</span>
          </div>
        )}

        {/* Row 1: Asset Tag & Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <Input
            label="Asset Tag / Code"
            name="asset_tag"
            placeholder="e.g. EQ-CS-2024-001"
            required
            mono
            value={formData.asset_tag}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.asset_tag}
            helperText="Unique uppercase inventory code"
            style={{ marginBottom: 0 }}
          />

          <Select
            label="Operational Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            mono
            style={{ marginBottom: 0 }}
          >
            <option value="available">Available (In Service)</option>
            <option value="allocated">Allocated (In Use)</option>
            <option value="under_maintenance">Under Maintenance</option>
            <option value="damaged">Damaged (Fault Flagged)</option>
            <option value="retired">Retired (Decommissioned)</option>
          </Select>
        </div>

        {/* Row 2: Instrument Name */}
        <Input
          label="Instrument / Equipment Name"
          name="name"
          placeholder="e.g. Dell OptiPlex 7090 MT / Tektronix TBS1052B Oscilloscope"
          required
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          style={{ marginBottom: 0 }}
        />

        {/* Row 3: Category & Lab */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <Select
            label="Category"
            name="category_id"
            required
            value={formData.category_id}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.category_id}
            style={{ marginBottom: 0 }}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <Select
            label="Assigned Laboratory Facility"
            name="lab_id"
            required
            value={formData.lab_id}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.lab_id}
            style={{ marginBottom: 0 }}
          >
            {labs.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.location || `Room ${l.id}`})
              </option>
            ))}
          </Select>
        </div>

        {/* Row 4: Serial No & Commission Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <Input
            label="Serial Number (SN)"
            name="serial_no"
            placeholder="e.g. SN-883921-US"
            required
            mono
            value={formData.serial_no}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.serial_no}
            style={{ marginBottom: 0 }}
          />

          <Input
            type="date"
            label="Commission / Acquired Date"
            name="purchase_date"
            mono
            value={formData.purchase_date}
            onChange={handleChange}
            style={{ marginBottom: 0 }}
          />
        </div>

        {/* Row 5: Hardware Photo URL (Optional) */}
        <Input
          label="Hardware Specimen Photo URL (Optional - Duotone Filter Applied)"
          name="image_url"
          placeholder="https://... (or leave empty for vector illustration)"
          mono
          value={formData.image_url}
          onChange={handleChange}
          helperText="Uploaded photos receive retro risograph duotone & halftone print matrix treatment"
          style={{ marginBottom: 0 }}
        />

        {/* Row 6: Bench Location & Description */}
        <div>
          <label
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-text-secondary)',
              display: 'block',
              marginBottom: '0.35rem'
            }}
          >
            Bench Placement & Calibration Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="form-textarea"
            placeholder="e.g. Bench 04, Rack 2. Calibration valid until Dec 2026."
            value={formData.description}
            onChange={handleChange}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>

        {/* Submit Actions Footer with Animated 3-State Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border-subtle)',
            marginTop: '0.5rem'
          }}
        >
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={submitState === 'loading'}
          >
            Cancel
          </Button>

          <motion.button
            type="submit"
            disabled={submitState !== 'idle'}
            whileHover={submitState === 'idle' ? { y: -1 } : {}}
            whileTap={submitState === 'idle' ? { y: 1 } : {}}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.15rem',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              borderRadius: 'var(--radius-xs)',
              border: '1px solid',
              borderColor:
                submitState === 'success'
                  ? 'var(--color-status-available)'
                  : 'var(--color-accent-orange)',
              backgroundColor:
                submitState === 'success'
                  ? 'var(--color-status-available)'
                  : 'var(--color-accent-orange)',
              color: '#FFFFFF',
              cursor: submitState === 'idle' ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              minWidth: '170px'
            }}
          >
            {submitState === 'loading' && (
              <>
                <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Saving Specs...</span>
              </>
            )}
            {submitState === 'success' && (
              <>
                <Check size={16} strokeWidth={2.5} />
                <span>Saved to Ledger!</span>
              </>
            )}
            {submitState === 'idle' && (
              <>
                <Check size={16} strokeWidth={2} />
                <span>{isEdit ? 'Update Asset' : 'Register Instrument'}</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
