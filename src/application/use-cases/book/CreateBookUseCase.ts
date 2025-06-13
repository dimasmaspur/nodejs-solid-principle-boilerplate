import { IBookRepository } from '../../../domain/repositories/IBookRepository';
import { Book } from '../../../domain/entities/Book';
import { CreateBookDTO } from '../../dtos/BookDTO';

export class CreateBookUseCase {
  constructor(private bookRepository: IBookRepository) {}

  async execute(bookData: CreateBookDTO): Promise<Book> {
    const book = await this.bookRepository.create(bookData);
    return book;
  }
} 