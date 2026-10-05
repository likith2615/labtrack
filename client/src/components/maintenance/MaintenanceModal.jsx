import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Wrench, Check, AlertCircle } from 'lucide-react';
import { maintenanceApi, equipmentApi } from '../../api/client';

export default function MaintenanceModal({ isOpen, onClose, onSuccess, preselectedEquipment = null }) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    equipment_id: preselectedEquipment?.id || '',
    service_type: 'routine_calibration',
    service_date: new Date().toISOString().slice(0, 10),
    next_service_due: '',
    technician_name: '',
    cost: '0.00',
    findings: '',
    action_taken: '',
    status_after_service: 'available'
  });

  useEffect(() => {
    equipmentApi.getAll()
      .then(res => {
        setEquipmentList(res.data || []);
        if (!preselectedEquipment && res.data?.length > 0) {
          setFormData(prev => ({ ...prev, equipment_id: res.data[0].id }));
        }
      })
      .catch(console.error);

    if (preselectedEquipment) {
      setFormData(prev => ({
        ...prev,
        equipment_id: preselectedEquipment.id,
        status_after_service: preselectedEquipment.status === 'damaged' ? 'available' : preselectedEquipment.status
      }));
    }
  }, [preselectedEquipment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      await maintenanceApi.create({
        ...formData,
        equipment_id: Number(formData.equipment_id),
        cost: parseFloat(formData.cost) || 0
      });
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setFormError(err.message || 'Failed to record maintenance service.');
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
        <div className="panel-header">
          <div className="panel-title">
            <Wrench size={16} strokeWidth={1.75} color="var(--accent-orange)" />
            <span>Record Calibration / Maintenance Event</span>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.4rem' }}>
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="panel-body">
          {formError && (
            <div style={{
              padding: '0.75rem',
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

          <div className="form-group">
            <label className="form-label">Target Laboratory Instrument *</label>
            <select
              name="equipment_id"
              className="form-select font-mono"
              value={formData.equipment_id}
              onChange={handleChange}
              required
            >
              {equipmentList.map(eq => (
                <option key={eq.id} value={eq.id}>
                  [{eq.asset_tag}] {eq.name} — ({eq.lab_name || 'Lab'})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Service Type *</label>
              <select
                name="service_type"
                className="form-select"
                value={formData.service_type}
                onChange={handleChange}
              >
                <option value="routine_calibration">Routine Calibration (NIST)</option>
                <option value="repair">Corrective Repair</option>
                <option value="inspection">Safety / Optical Inspection</option>
                <option value="emergency_fix">Emergency Fix</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Service Date *</label>
              <input
                type="date"
                name="service_date"
                className="form-input font-mono"
                required
                value={formData.service_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Technician / Certification Body *</label>
              <input
                type="text"
                name="technician_name"
                className="form-input"
                placeholder="e.g. Tektronix Field Tech / Dr. Vance"
                required
                value={formData.technician_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Service Cost ($ USD)</label>
              <input
                type="number"
                step="0.01"
                name="cost"
                className="form-input font-mono"
                placeholder="0.00"
                value={formData.cost}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Diagnostic Findings & Measurements *</label>
            <textarea
              name="findings"
              className="form-textarea"
              placeholder="e.g. Channel 1 offset +1.4% drift. Mechanical backlash verified at 0.08mm."
              required
              value={formData.findings}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Action Taken & Firmware Updates *</label>
            <textarea
              name="action_taken"
              className="form-textarea"
              placeholder="e.g. Replaced optical lead seal, recalibrated ADC bias trim, updated FW to v2.14."
              required
              value={formData.action_taken}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Post-Service Status</label>
              <select
                name="status_after_service"
                className="form-select font-mono"
                value={formData.status_after_service}
                onChange={handleChange}
              >
                <option value="available">Available (Operational)</option>
                <option value="in_use">In Use</option>
                <option value="damaged">Damaged (Still Defective)</option>
                <option value="retired">Retired</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Next Service Due (Optional)</label>
              <input
                type="date"
                name="next_service_due"
                className="form-input font-mono"
                value={formData.next_service_due}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Check size={16} />
              <span>{loading ? 'Logging Service...' : 'Commit Maintenance Record'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
