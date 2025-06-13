import { Request, Response } from 'express';
import { CreateBookUseCase } from '../../application/use-cases/book/CreateBookUseCase';
import { GetAllBooksUseCase } from '../../application/use-cases/book/GetAllBooksUseCase';
import { GetBookByIdUseCase } from '../../application/use-cases/book/GetBookByIdUseCase';
import { UpdateBookUseCase } from '../../application/use-cases/book/UpdateBookUseCase';
import { DeleteBookUseCase } from '../../application/use-cases/book/DeleteBookUseCase';
import { CreateBookDTO, UpdateBookDTO, BookResponseDTO } from '../../application/dtos/BookDTO';
import { AppError } from '../../shared/errors/AppError';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class BookController {
  constructor(
    private createBookUseCase: CreateBookUseCase,
    private getAllBooksUseCase: GetAllBooksUseCase,
    private getBookByIdUseCase: GetBookByIdUseCase,
    private updateBookUseCase: UpdateBookUseCase,
    private deleteBookUseCase: DeleteBookUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const bookDTO = plainToClass(CreateBookDTO, req.body);
      const errors = await validate(bookDTO);

      if (errors.length > 0) {
        throw new AppError('Validation failed', 400);
      }

      const book = await this.createBookUseCase.execute(bookDTO);
      if (!book) {
        throw new AppError('Failed to create book', 500);
      }
      
      const response: BookResponseDTO = {
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price,
        isbn: book.isbn,
        stock: book.stock,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt
      };

      res.status(201).apiSuccess(response, 'Buku berhasil dibuat');
    } catch (error) {
      if (error instanceof AppError) {
        res.apiError(error.message, 'BOOK_ERROR', error);
        return;
      }
      res.apiError('Internal server error', 'SERVER_ERROR');
    }
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const books = await this.getAllBooksUseCase.execute();
      const response: BookResponseDTO[] = books.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price,
        isbn: book.isbn,
        stock: book.stock,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt
      }));
      res.apiSuccess(response);
    } catch (error) {
      if (error instanceof AppError) {
        res.apiError(error.message, 'BOOK_ERROR', error);
        return;
      }
      res.apiError('Internal server error', 'SERVER_ERROR');
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const book = await this.getBookByIdUseCase.execute(id);
      
      if (!book) {
        throw new AppError('Book not found', 404);
      }

      const response: BookResponseDTO = {
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price,
        isbn: book.isbn,
        stock: book.stock,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt
      };

      res.apiSuccess(response);
    } catch (error) {
      if (error instanceof AppError) {
        res.apiError(error.message, 'BOOK_ERROR', error);
        return;
      }
      res.apiError('Internal server error', 'SERVER_ERROR');
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const bookDTO = plainToClass(UpdateBookDTO, req.body);
      const errors = await validate(bookDTO);

      if (errors.length > 0) {
        throw new AppError('Validation failed', 400);
      }

      const book = await this.updateBookUseCase.execute(id, bookDTO);
      if (!book) {
        throw new AppError('Book not found', 404);
      }

      const response: BookResponseDTO = {
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price,
        isbn: book.isbn,
        stock: book.stock,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt
      };

      res.apiSuccess(response, 'Buku berhasil diupdate');
    } catch (error) {
      if (error instanceof AppError) {
        res.apiError(error.message, 'BOOK_ERROR', error);
        return;
      }
      res.apiError('Internal server error', 'SERVER_ERROR');
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteBookUseCase.execute(id);
      res.apiSuccess(null, 'Buku berhasil dihapus');
    } catch (error) {
      if (error instanceof AppError) {
        res.apiError(error.message, 'BOOK_ERROR', error);
        return;
      }
      res.apiError('Internal server error', 'SERVER_ERROR');
    }
  }
} 