import { IDiscountRepository } from '../../../domain/repositories/IDiscountRepository';
import { Discount } from '../../../domain/entities/Discount';
import { UpdateDiscountDTO } from '../../dtos/DiscountDTO';
import { AppError } from '../../../shared/errors/AppError';
import { BookRepository } from '../../../infrastructure/repositories/BookRepository';

export class UpdateDiscountUseCase {
  private bookRepository: BookRepository;

  constructor(private discountRepository: IDiscountRepository) {
    this.bookRepository = new BookRepository();
  }

  async execute(id: string, discountDTO: UpdateDiscountDTO): Promise<Discount> {
    const existingDiscount = await this.discountRepository.findById(id);
    if (!existingDiscount) {
      throw new AppError('Discount not found', 404);
    }

    let book = existingDiscount.book;
    if (discountDTO.bookId) {
      const newBook = await this.bookRepository.findById(discountDTO.bookId);
      if (!newBook) {
        throw new AppError('Book not found', 404);
      }
      book = newBook;
    }

    const updatedDiscount = await this.discountRepository.update(id, {
      ...discountDTO,
      book
    });

    if (!updatedDiscount) {
      throw new AppError('Failed to update discount', 500);
    }

    return updatedDiscount;
  }
} 