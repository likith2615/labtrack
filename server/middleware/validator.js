// Validation Middleware for LabTrack API

export const validateEquipmentPayload = (req, res, next) => {
  const { name, asset_tag, model_number, manufacturer, serial_number, category_id, lab_id } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Equipment "name" is required (minimum 2 characters).');
  }
  if (!asset_tag || typeof asset_tag !== 'string' || asset_tag.trim().length < 3) {
    errors.push('Equipment "asset_tag" is required (e.g., EQ-EE-2024-001).');
  }
  if (!model_number || typeof model_number !== 'string') {
    errors.push('Equipment "model_number" is required.');
  }
  if (!manufacturer || typeof manufacturer !== 'string') {
    errors.push('Equipment "manufacturer" is required.');
  }
  if (!serial_number || typeof serial_number !== 'string') {
    errors.push('Equipment "serial_number" is required.');
  }
  if (!category_id || isNaN(Number(category_id))) {
    errors.push('Valid "category_id" is required.');
  }
  if (!lab_id || isNaN(Number(lab_id))) {
    errors.push('Valid "lab_id" is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid equipment payload.',
        details: errors
      }
    });
  }

  next();
};

export const validateStatusPayload = (req, res, next) => {
  const { status, note } = req.body;
  const validStatuses = ['available', 'in_use', 'damaged', 'retired'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      }
    });
  }

  next();
};

export const validateMaintenancePayload = (req, res, next) => {
  const { equipment_id, service_type, service_date, technician_name, findings, action_taken } = req.body;
  const errors = [];
  const validServiceTypes = ['routine_calibration', 'repair', 'inspection', 'emergency_fix'];

  if (!equipment_id || isNaN(Number(equipment_id))) {
    errors.push('Valid "equipment_id" is required.');
  }
  if (!service_type || !validServiceTypes.includes(service_type)) {
    errors.push(`"service_type" must be one of: ${validServiceTypes.join(', ')}`);
  }
  if (!service_date) {
    errors.push('"service_date" (YYYY-MM-DD) is required.');
  }
  if (!technician_name || technician_name.trim().length < 2) {
    errors.push('"technician_name" is required.');
  }
  if (!findings || findings.trim().length < 3) {
    errors.push('"findings" report is required.');
  }
  if (!action_taken || action_taken.trim().length < 3) {
    errors.push('"action_taken" description is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid maintenance record payload.',
        details: errors
      }
    });
  }

  next();
};

export default { validateEquipmentPayload, validateStatusPayload, validateMaintenancePayload };
