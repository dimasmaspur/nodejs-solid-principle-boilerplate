import { IDiscountRepository } from '../../../domain/repositories/IDiscountRepository';
import { AppError } from '../../../shared/errors/AppError';

export class DeleteDiscountUseCase {
  constructor(private discountRepository: IDiscountRepository) {}

  async execute(id: string): Promise<boolean> {
    const existingDiscount = await this.discountRepository.findById(id);
    if (!existingDiscount) {
      throw new AppError('Discount not found', 404);
    }

    const success = await this.discountRepository.delete(id);
    if (!success) {
      throw new AppError('Failed to delete discount', 500);
    }

    return true;
  }
} 