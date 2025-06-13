"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const BookDTO_1 = require("../../application/dtos/BookDTO");
const AppError_1 = require("../../shared/errors/AppError");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class BookController {
    constructor(createBookUseCase, getAllBooksUseCase, getBookByIdUseCase, updateBookUseCase, deleteBookUseCase) {
        this.createBookUseCase = createBookUseCase;
        this.getAllBooksUseCase = getAllBooksUseCase;
        this.getBookByIdUseCase = getBookByIdUseCase;
        this.updateBookUseCase = updateBookUseCase;
        this.deleteBookUseCase = deleteBookUseCase;
    }
    async create(req, res) {
        try {
            const bookDTO = (0, class_transformer_1.plainToClass)(BookDTO_1.CreateBookDTO, req.body);
            const errors = await (0, class_validator_1.validate)(bookDTO);
            if (errors.length > 0) {
                throw new AppError_1.AppError('Validation failed', 400);
            }
            const book = await this.createBookUseCase.execute(bookDTO);
            if (!book) {
                throw new AppError_1.AppError('Failed to create book', 500);
            }
            const response = {
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
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getAll(_req, res) {
        try {
            const books = await this.getAllBooksUseCase.execute();
            return res.json(books);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const book = await this.getBookByIdUseCase.execute(id);
            if (!book) {
                throw new AppError_1.AppError('Book not found', 404);
            }
            const response = {
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
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const bookDTO = (0, class_transformer_1.plainToClass)(BookDTO_1.UpdateBookDTO, req.body);
            const errors = await (0, class_validator_1.validate)(bookDTO);
            if (errors.length > 0) {
                throw new AppError_1.AppError('Validation failed', 400);
            }
            const book = await this.updateBookUseCase.execute(id, bookDTO);
            if (!book) {
                throw new AppError_1.AppError('Book not found', 404);
            }
            const response = {
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
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const success = await this.deleteBookUseCase.execute(id);
            if (!success) {
                throw new AppError_1.AppError('Book not found', 404);
            }
            return res.status(204).send();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.BookController = BookController;
//# sourceMappingURL=BookController.js.map