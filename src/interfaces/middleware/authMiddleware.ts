import { Request, Response, NextFunction } from 'express';
import { IAuthService, AuthPayload } from '../../domain/services/IAuthService';
import { AppError } from '../../shared/errors/AppError';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export class AuthMiddleware {
  constructor(private authService: IAuthService) {}

  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({ message: 'Token tidak ditemukan' });
        return;
      }

      const [, token] = authHeader.split(' ');

      if (!token) {
        res.status(401).json({ message: 'Token tidak valid' });
        return;
      }

      const decoded = this.authService.verifyToken(token);
      req.user = decoded;

      next();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(401).json({ message: 'Token tidak valid' });
    }
  };

  authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new AppError('Akses ditolak', 403);
      }

      if (!roles.includes(req.user.role)) {
        throw new AppError('Anda tidak memiliki akses untuk operasi ini', 403);
      }

      next();
    };
  };
} 