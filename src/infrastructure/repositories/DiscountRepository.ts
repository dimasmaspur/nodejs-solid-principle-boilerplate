import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Discount } from '../../domain/entities/Discount';
import { IDiscountRepository } from '../../domain/repositories/IDiscountRepository';

export class DiscountRepository implements IDiscountRepository {
  private repository: Repository<Discount>;

  constructor() {
    this.repository = AppDataSource.getRepository(Discount);
  }

  async findById(id: string): Promise<Discount | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['book']
    });
  }

  async findByBookId(bookId: string): Promise<Discount[]> {
    return this.repository.find({
      where: { book: { id: bookId } },
      relations: ['book']
    });
  }

  async findActiveByBookId(bookId: string): Promise<Discount | null> {
    const now = new Date();
    return this.repository.findOne({
      where: {
        book: { id: bookId },
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now)
      },
      relations: ['book']
    });
  }

  async findAll(): Promise<Discount[]> {
    return this.repository.find({
      relations: ['book']
    });
  }

  async create(discount: Partial<Discount>): Promise<Discount> {
    const newDiscount = this.repository.create(discount);
    return this.repository.save(newDiscount);
  }

  async update(id: string, discount: Partial<Discount>): Promise<Discount | null> {
    await this.repository.update(id, discount);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
} 