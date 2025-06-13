import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { JwtService } from '../../../infrastructure/services/JwtService';
import { AppError } from '../../../shared/errors/AppError';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from '../../dtos/AuthDTO';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: JwtService
  ) {}

  async execute(data: LoginDTO): Promise<LoginResponse> {
    console.log('Login attempt for email:', data.email);
    
    const user = await this.userRepository.findByEmail(data.email);
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      throw new AppError('Email atau password salah', 401);
    }

    console.log('Comparing passwords...');
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      throw new AppError('Email atau password salah', 401);
    }

    if (!user.isActive) {
      throw new AppError('Akun tidak aktif', 401);
    }

    const token = this.jwtService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }
} 