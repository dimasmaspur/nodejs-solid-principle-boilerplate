import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { CreateUserDTO, UserRole } from '../../dtos/UserDTO';
import { User } from '../../../domain/entities/User';
import { AppError } from '../../../shared/errors/AppError';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<User> {
    // Cek apakah email sudah terdaftar
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email sudah terdaftar', 400);
    }

    // Buat user baru
    const user = await this.userRepository.create({
      ...data,
      role: data.role || UserRole.USER,
      isActive: data.isActive ?? true
    });

    return user;
  }
} 