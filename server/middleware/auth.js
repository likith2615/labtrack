import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'labtrack_jwt_secret_dev_key_2024';

/**
 * Middleware: Verify Bearer JWT Token
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
      errors: [{ field: 'authorization', message: 'Bearer token is required in Authorization header.' }]
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      message: isExpired ? 'Authentication token has expired. Please log in again.' : 'Invalid authentication token.',
      errors: [{ field: 'authorization', message: err.message }]
    });
  }
};

/**
 * Middleware: Authorize Specific User Roles (e.g. 'admin', 'staff', 'student')
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User session not verified.',
        errors: null
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role "${req.user.role}" is not authorized for this operation.`,
        errors: [
          {
            field: 'role',
            message: `Current role "${req.user.role}" lacks required permissions: [${allowedRoles.join(', ')}]`
          }
        ]
      });
    }

    next();
  };
};

export default { authenticateToken, authorizeRoles };
