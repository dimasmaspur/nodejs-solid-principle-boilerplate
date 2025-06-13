"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDiscountUseCase = void 0;
const BookDiscountService_1 = require("../../../domain/services/BookDiscountService");
const AppError_1 = require("../../../shared/errors/AppError");
const BookRepository_1 = require("../../../infrastructure/repositories/BookRepository");
class CreateDiscountUseCase {
    constructor(discountRepository) {
        this.discountRepository = discountRepository;
        this.discountService = new BookDiscountService_1.BookDiscountService(discountRepository);
        this.bookRepository = new BookRepository_1.BookRepository();
    }
    async execute(discountData) {
        const validationErrors = this.discountService.validateDiscount(discountData);
        if (validationErrors.length > 0) {
            throw new AppError_1.AppError(`Invalid discount data: ${validationErrors.join(', ')}`, 400);
        }
        const book = await this.bookRepository.findById(discountData.bookId);
        if (!book) {
            throw new AppError_1.AppError('Book not found', 404);
        }
        const activeDiscount = await this.discountRepository.findActiveByBookId(discountData.bookId);
        if (activeDiscount) {
            const isOverlapping = (discountData.startDate <= activeDiscount.endDate &&
                discountData.endDate >= activeDiscount.startDate);
            if (isOverlapping) {
                throw new AppError_1.AppError('Book already has an active discount in the specified date range', 409);
            }
        }
        return this.discountRepository.create({
            ...discountData,
            book
        });
    }
}
exports.CreateDiscountUseCase = CreateDiscountUseCase;
//# sourceMappingURL=CreateDiscountUseCase.js.map