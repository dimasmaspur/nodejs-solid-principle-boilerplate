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

  async create(req: Request, res: Response): Promise<Response> {
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

      return res.status(201).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const books = await this.getAllBooksUseCase.execute();
      return res.json(books);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
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

      return res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
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

      return res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await this.deleteBookUseCase.execute(id);
      
      if (!success) {
        throw new AppError('Book not found', 404);
      }

      return res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
} 