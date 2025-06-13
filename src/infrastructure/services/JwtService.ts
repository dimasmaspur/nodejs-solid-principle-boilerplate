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
  private readonly expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-secret-key';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  }

  generateToken(payload: AuthPayload): string {
    const options: SignOptions = { expiresIn: this.expiresIn as SignOptions['expiresIn'] };
    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (error) {
      throw new Error('Token tidak valid');
    }
  }
} 