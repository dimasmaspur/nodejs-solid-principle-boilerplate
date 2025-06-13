import { UserRole } from '../../application/dtos/UserDTO';

export interface AuthPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface IAuthService {
  generateToken(payload: AuthPayload): string;
  verifyToken(token: string): AuthPayload;
} 