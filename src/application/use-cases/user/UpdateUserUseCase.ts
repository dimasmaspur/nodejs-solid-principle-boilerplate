import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UpdateUserDTO } from '../../dtos/UserDTO';
import { User } from '../../../domain/entities/User';
import { AppError } from '../../../shared/errors/AppError';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserDTO): Promise<User> {
    // Cek apakah user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new AppError('User tidak ditemukan', 404);
    }

    // Jika email diupdate, cek apakah email baru sudah digunakan
    if (data.email && data.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(data.email);
      if (userWithEmail) {
        throw new AppError('Email sudah terdaftar', 400);
      }
    }

    // Update user
    const updatedUser = await this.userRepository.update(id, data);
    if (!updatedUser) {
      throw new AppError('Gagal mengupdate user', 500);
    }

    return updatedUser;
  }
} 