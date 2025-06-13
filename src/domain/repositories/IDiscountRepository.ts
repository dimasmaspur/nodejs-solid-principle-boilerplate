import { Discount } from '../entities/Discount';

export interface IDiscountRepository {
  findById(id: string): Promise<Discount | null>;
  findByBookId(bookId: string): Promise<Discount[]>;
  findActiveByBookId(bookId: string): Promise<Discount | null>;
  findAll(): Promise<Discount[]>;
  create(discount: Partial<Discount>): Promise<Discount>;
  update(id: string, discount: Partial<Discount>): Promise<Discount | null>;
  delete(id: string): Promise<boolean>;
} 