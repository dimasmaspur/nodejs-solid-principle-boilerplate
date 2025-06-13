import { IBookRepository } from '../../../domain/repositories/IBookRepository';

export class DeleteBookUseCase {
  constructor(private bookRepository: IBookRepository) {}

  async execute(id: string): Promise<boolean> {
    const existingBook = await this.bookRepository.findById(id);
    if (!existingBook) {
      throw new Error('Book not found');
    }

    const isDeleted = await this.bookRepository.delete(id);
    if (!isDeleted) {
      throw new Error('Failed to delete book');
    }

    return true;
  }
} 