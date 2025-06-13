import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AppError } from '../../../shared/errors/AppError';

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    // Cek apakah user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new AppError('User tidak ditemukan', 404);
    }

    // Delete user
    const success = await this.userRepository.delete(id);
    if (!success) {
      throw new AppError('Gagal menghapus user', 500);
    }
  }
} 