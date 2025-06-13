import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Book } from '../../domain/entities/Book';
import { IBookRepository } from '../../domain/repositories/IBookRepository';

export class BookRepository implements IBookRepository {
  private repository: Repository<Book>;

  constructor() {
    this.repository = AppDataSource.getRepository(Book);
  }

  async findAll(): Promise<Book[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Book | null> {
    return this.repository.findOneBy({ id });
  }

  async create(book: Partial<Book>): Promise<Book> {
    const newBook = this.repository.create(book);
    return this.repository.save(newBook);
  }

  async update(id: string, book: Partial<Book>): Promise<Book | null> {
    await this.repository.update(id, book);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
} 