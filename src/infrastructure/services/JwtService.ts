import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRole } from '../../application/dtos/UserDTO';
import { IAuthService, AuthPayload } from '../../domain/services/IAuthService';
import { AppError } from '../../shared/errors/AppError';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export class JwtService implements IAuthService {
  private readonly secret: jwt.Secret;
  private readonly expiresIn: jwt.SignOptions['expiresIn'];

  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-secret-key';
    this.expiresIn = (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'];
  }

  generateToken(payload: AuthPayload): string {
    const options: SignOptions = { expiresIn: this.expiresIn };
    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token: string): AuthPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as AuthPayload;
      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
    } catch (error) {
      throw new AppError('Token tidak valid', 401);
    }
  }
} 