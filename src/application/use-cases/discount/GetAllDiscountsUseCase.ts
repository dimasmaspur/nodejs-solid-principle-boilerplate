import { IDiscountRepository } from '../../../domain/repositories/IDiscountRepository';
import { Discount } from '../../../domain/entities/Discount';

export class GetAllDiscountsUseCase {
  constructor(private discountRepository: IDiscountRepository) {}

  async execute(): Promise<Discount[]> {
    return this.discountRepository.findAll();
  }
} 