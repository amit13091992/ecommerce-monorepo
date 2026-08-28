import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  if (err.name === 'ZodError') {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
  return res.status(400).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message || 'Server error' } });
}
