"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDiscountUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
const BookRepository_1 = require("../../../infrastructure/repositories/BookRepository");
class UpdateDiscountUseCase {
    constructor(discountRepository) {
        this.discountRepository = discountRepository;
        this.bookRepository = new BookRepository_1.BookRepository();
    }
    async execute(id, discountDTO) {
        const existingDiscount = await this.discountRepository.findById(id);
        if (!existingDiscount) {
            throw new AppError_1.AppError('Discount not found', 404);
        }
        let book = existingDiscount.book;
        if (discountDTO.bookId) {
            const newBook = await this.bookRepository.findById(discountDTO.bookId);
            if (!newBook) {
                throw new AppError_1.AppError('Book not found', 404);
            }
            book = newBook;
        }
        const updatedDiscount = await this.discountRepository.update(id, {
            ...discountDTO,
            book
        });
        if (!updatedDiscount) {
            throw new AppError_1.AppError('Failed to update discount', 500);
        }
        return updatedDiscount;
    }
}
exports.UpdateDiscountUseCase = UpdateDiscountUseCase;
//# sourceMappingURL=UpdateDiscountUseCase.js.map