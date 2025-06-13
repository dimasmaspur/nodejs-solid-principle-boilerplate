import { IBookRepository } from '../../../domain/repositories/IBookRepository';
import { Book } from '../../../domain/entities/Book';

export class GetBookByIdUseCase {
  constructor(private bookRepository: IBookRepository) {}

  async execute(id: string): Promise<Book | null> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }
} 