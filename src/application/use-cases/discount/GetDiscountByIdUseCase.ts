import { IDiscountRepository } from '../../../domain/repositories/IDiscountRepository';
import { Discount } from '../../../domain/entities/Discount';
import { AppError } from '../../../shared/errors/AppError';

export class GetDiscountByIdUseCase {
  constructor(private discountRepository: IDiscountRepository) {}

  async execute(id: string): Promise<Discount> {
    const discount = await this.discountRepository.findById(id);
    if (!discount) {
      throw new AppError('Discount not found', 404);
    }
    return discount;
  }
} 