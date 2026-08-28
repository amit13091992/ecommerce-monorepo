import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

export async function register(data: any) {
  const { name, email, password, confirmPassword } = data;
  if (password !== confirmPassword) throw new Error('Passwords do not match');
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email already exists');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
  return { user: { id: user.id, name: user.name, email: user.email }, token };
}

export async function login(data: any) {
  const { email, password } = data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
  return { user: { id: user.id, name: user.name, email: user.email }, token };
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always return success to avoid leaking existence
  if (!user) return;
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });
  // In dev: return reset URL
  console.log(`Password reset link: ${process.env.FRONTEND_URL}/reset-password?token=${token}`);
}

export async function resetPassword(token: string, password: string) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const record = await prisma.passwordResetToken.findFirst({ where: { tokenHash } });
  if (!record || record.expiresAt < new Date()) throw new Error('Invalid or expired token');
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: record.userId }, data: { passwordHash } });
  await prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } });
}
