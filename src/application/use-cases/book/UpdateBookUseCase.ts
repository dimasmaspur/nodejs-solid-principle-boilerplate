import { IBookRepository } from '../../../domain/repositories/IBookRepository';
import { Book } from '../../../domain/entities/Book';
import { UpdateBookDTO } from '../../dtos/BookDTO';

export class UpdateBookUseCase {
  constructor(private bookRepository: IBookRepository) {}

  async execute(id: string, bookData: UpdateBookDTO): Promise<Book> {
    const existingBook = await this.bookRepository.findById(id);
    if (!existingBook) {
      throw new Error('Book not found');
    }

    const updatedBook = await this.bookRepository.update(id, bookData);
    if (!updatedBook) {
      throw new Error('Failed to update book');
    }

    return updatedBook;
  }
} 