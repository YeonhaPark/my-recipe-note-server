import express from 'express';
import {} from 'express-async-errors';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import * as authController from '../controller/auth.js';
import { isAuth } from '../middleware/auth.js';
const router = express.Router();

const validateCredentials = [
  body('username')
    .trim()
    .notEmpty()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please check if email is valid'),
  body('password')
    .trim()
    .notEmpty()
    .isLength({ min: 5, max: 16 })
    .withMessage('Password length between 5 to 16 only'),
  validate,
];

router.post('/signup', validateCredentials, authController.signup);
router.post('/login', validateCredentials, authController.login);
router.get('/me', isAuth, authController.isMe);
export default router;
