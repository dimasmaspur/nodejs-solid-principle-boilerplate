import { IBookRepository } from '../../../domain/repositories/IBookRepository';
import { Book } from '../../../domain/entities/Book';

export class GetAllBooksUseCase {
  constructor(private bookRepository: IBookRepository) {}

  async execute(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }
} 