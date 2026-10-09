import { Router } from 'express';
import { body } from 'express-validator';
import { login, getMe, getAllUsers } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Please provide a valid university email address.'),
  body('password')
    .notEmpty().withMessage('Password is required.'),
  validateRequest
];

router.post('/login', loginValidation, login);
router.get('/me', authenticateToken, getMe);
router.get('/users', authenticateToken, getAllUsers);

export default router;
