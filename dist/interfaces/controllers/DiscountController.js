"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountController = void 0;
const DiscountDTO_1 = require("../../application/dtos/DiscountDTO");
const AppError_1 = require("../../shared/errors/AppError");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const BookDiscountService_1 = require("../../domain/services/BookDiscountService");
const database_1 = require("../../config/database");
const Book_1 = require("../../domain/entities/Book");
const DiscountRepository_1 = require("../../infrastructure/repositories/DiscountRepository");
class DiscountController {
    constructor(createDiscountUseCase, getAllDiscountsUseCase, getDiscountByIdUseCase, updateDiscountUseCase, deleteDiscountUseCase) {
        this.createDiscountUseCase = createDiscountUseCase;
        this.getAllDiscountsUseCase = getAllDiscountsUseCase;
        this.getDiscountByIdUseCase = getDiscountByIdUseCase;
        this.updateDiscountUseCase = updateDiscountUseCase;
        this.deleteDiscountUseCase = deleteDiscountUseCase;
        const discountRepository = new DiscountRepository_1.DiscountRepository();
        this.discountService = new BookDiscountService_1.BookDiscountService(discountRepository);
    }
    async create(req, res) {
        try {
            const discountDTO = (0, class_transformer_1.plainToClass)(DiscountDTO_1.CreateDiscountDTO, req.body);
            const errors = await (0, class_validator_1.validate)(discountDTO);
            if (errors.length > 0) {
                throw new AppError_1.AppError('Validation failed', 400);
            }
            const discount = await this.createDiscountUseCase.execute(discountDTO);
            if (!discount) {
                throw new AppError_1.AppError('Failed to create discount', 500);
            }
            const response = {
                id: discount.id,
                bookId: discount.book.id,
                percentage: discount.percentage,
                startDate: discount.startDate,
                endDate: discount.endDate,
                isActive: discount.isActive,
                createdAt: discount.createdAt,
                updatedAt: discount.updatedAt
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
            const discounts = await this.getAllDiscountsUseCase.execute();
            const response = discounts.map((discount) => ({
                id: discount.id,
                bookId: discount.book.id,
                percentage: discount.percentage,
                startDate: discount.startDate,
                endDate: discount.endDate,
                isActive: discount.isActive,
                createdAt: discount.createdAt,
                updatedAt: discount.updatedAt
            }));
            return res.json(response);
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
            const discount = await this.getDiscountByIdUseCase.execute(id);
            if (!discount) {
                throw new AppError_1.AppError('Discount not found', 404);
            }
            const response = {
                id: discount.id,
                bookId: discount.book.id,
                percentage: discount.percentage,
                startDate: discount.startDate,
                endDate: discount.endDate,
                isActive: discount.isActive,
                createdAt: discount.createdAt,
                updatedAt: discount.updatedAt
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
            const discountDTO = (0, class_transformer_1.plainToClass)(DiscountDTO_1.UpdateDiscountDTO, req.body);
            const errors = await (0, class_validator_1.validate)(discountDTO);
            if (errors.length > 0) {
                throw new AppError_1.AppError('Validation failed', 400);
            }
            const discount = await this.updateDiscountUseCase.execute(id, discountDTO);
            if (!discount) {
                throw new AppError_1.AppError('Discount not found', 404);
            }
            const response = {
                id: discount.id,
                bookId: discount.book.id,
                percentage: discount.percentage,
                startDate: discount.startDate,
                endDate: discount.endDate,
                isActive: discount.isActive,
                createdAt: discount.createdAt,
                updatedAt: discount.updatedAt
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
            const success = await this.deleteDiscountUseCase.execute(id);
            if (!success) {
                throw new AppError_1.AppError('Discount not found', 404);
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
    async calculateBookPrice(req, res) {
        try {
            const { bookId } = req.params;
            const bookRepository = database_1.AppDataSource.getRepository(Book_1.Book);
            const book = await bookRepository.findOneBy({ id: bookId });
            if (!book) {
                throw new AppError_1.AppError('Book not found', 404);
            }
            const priceCalculation = await this.discountService.calculateFinalPrice(book);
            return res.json({
                originalPrice: priceCalculation.originalPrice,
                discountAmount: priceCalculation.discountAmount,
                finalPrice: priceCalculation.finalPrice,
                appliedDiscount: priceCalculation.appliedDiscount ? {
                    id: priceCalculation.appliedDiscount.id,
                    bookId: priceCalculation.appliedDiscount.book.id,
                    percentage: priceCalculation.appliedDiscount.percentage,
                    startDate: priceCalculation.appliedDiscount.startDate,
                    endDate: priceCalculation.appliedDiscount.endDate,
                    isActive: priceCalculation.appliedDiscount.isActive,
                    createdAt: priceCalculation.appliedDiscount.createdAt,
                    updatedAt: priceCalculation.appliedDiscount.updatedAt
                } : null
            });
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.DiscountController = DiscountController;
//# sourceMappingURL=DiscountController.js.map