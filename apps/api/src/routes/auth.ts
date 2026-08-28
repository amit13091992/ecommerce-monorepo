import { Router } from 'express';
import { register, login, me, logout, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', me);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
