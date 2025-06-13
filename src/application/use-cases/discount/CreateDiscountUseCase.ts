import { IDiscountRepository } from '../../../domain/repositories/IDiscountRepository';
import { BookDiscountService } from '../../../domain/services/BookDiscountService';
import { CreateDiscountDTO } from '../../dtos/DiscountDTO';
import { Discount } from '../../../domain/entities/Discount';
import { AppError } from '../../../shared/errors/AppError';
import { BookRepository } from '../../../infrastructure/repositories/BookRepository';

export class CreateDiscountUseCase {
  private discountService: BookDiscountService;
  private bookRepository: BookRepository;

  constructor(private discountRepository: IDiscountRepository) {
    this.discountService = new BookDiscountService(discountRepository);
    this.bookRepository = new BookRepository();
  }

  async execute(discountData: CreateDiscountDTO): Promise<Discount> {
    // Validasi diskon menggunakan domain service
    const validationErrors = this.discountService.validateDiscount(discountData);
    if (validationErrors.length > 0) {
      throw new AppError(`Invalid discount data: ${validationErrors.join(', ')}`, 400);
    }

    // Validasi book exists
    const book = await this.bookRepository.findById(discountData.bookId);
    if (!book) {
      throw new AppError('Book not found', 404);
    }

    // Cek apakah buku memiliki diskon aktif yang tumpang tindih
    const activeDiscount = await this.discountRepository.findActiveByBookId(discountData.bookId);
    if (activeDiscount) {
      const isOverlapping = 
        (discountData.startDate <= activeDiscount.endDate && 
         discountData.endDate >= activeDiscount.startDate);

      if (isOverlapping) {
        throw new AppError('Book already has an active discount in the specified date range', 409);
      }
    }

    return this.discountRepository.create({
      ...discountData,
      book
    });
  }
} 