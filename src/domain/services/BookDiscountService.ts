import { Book } from '../entities/Book';
import { Discount } from '../entities/Discount';
import { IDiscountRepository } from '../repositories/IDiscountRepository';

export interface DiscountCalculationResult {
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  appliedDiscount: Discount | null;
}

export class BookDiscountService {
  constructor(private discountRepository: IDiscountRepository) {}

  /**
   * Menghitung harga akhir buku setelah diskon
   * @param book Buku yang akan dihitung diskonnya
   * @returns Hasil perhitungan diskon
   */
  async calculateFinalPrice(book: Book): Promise<DiscountCalculationResult> {
    const activeDiscount = await this.discountRepository.findActiveByBookId(book.id);
    
    if (!activeDiscount) {
      return {
        originalPrice: book.price,
        discountAmount: 0,
        finalPrice: book.price,
        appliedDiscount: null
      };
    }

    const discountAmount = this.calculateDiscountAmount(activeDiscount, book.price);
    const finalPrice = book.price - discountAmount;

    return {
      originalPrice: book.price,
      discountAmount,
      finalPrice: Math.max(0, finalPrice), // Memastikan harga tidak negatif
      appliedDiscount: activeDiscount
    };
  }

  /**
   * Menghitung jumlah diskon berdasarkan persentase
   */
  private calculateDiscountAmount(discount: Discount, originalPrice: number): number {
    return (originalPrice * discount.percentage) / 100;
  }

  /**
   * Validasi diskon baru
   */
  validateDiscount(discount: Partial<Discount>): string[] {
    const errors: string[] = [];

    if (discount.startDate && discount.endDate) {
      if (discount.startDate >= discount.endDate) {
        errors.push('Start date must be before end date');
      }
    }

    if (discount.percentage !== undefined) {
      if (discount.percentage < 0) {
        errors.push('Discount percentage cannot be negative');
      }
      if (discount.percentage > 100) {
        errors.push('Discount percentage cannot exceed 100%');
      }
    }

    return errors;
  }
} 