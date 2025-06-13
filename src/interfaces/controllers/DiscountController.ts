import { Request, Response } from 'express';

import { CreateDiscountDTO, UpdateDiscountDTO, DiscountResponseDTO } from '../../application/dtos/DiscountDTO';
import { AppError } from '../../shared/errors/AppError';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BookDiscountService } from '../../domain/services/BookDiscountService';
import { AppDataSource } from '../../config/database';
import { Book } from '../../domain/entities/Book';
import { Discount } from '../../domain/entities/Discount';
import { DiscountRepository } from '../../infrastructure/repositories/DiscountRepository';
import { CreateDiscountUseCase } from '../../application/use-cases/discount/CreateDiscountUseCase';
import { GetAllDiscountsUseCase } from '../../application/use-cases/discount/GetAllDiscountsUseCase';
import { GetDiscountByIdUseCase } from '../../application/use-cases/discount/GetDiscountByIdUseCase';
import { UpdateDiscountUseCase } from '../../application/use-cases/discount/UpdateDiscountUseCase';
import { DeleteDiscountUseCase } from '../../application/use-cases/discount/DeleteDiscountUseCase';

export class DiscountController {
  private createDiscountUseCase: CreateDiscountUseCase;
  private getAllDiscountsUseCase: GetAllDiscountsUseCase;
  private getDiscountByIdUseCase: GetDiscountByIdUseCase;
  private updateDiscountUseCase: UpdateDiscountUseCase;
  private deleteDiscountUseCase: DeleteDiscountUseCase;
  private discountService: BookDiscountService;

  constructor(
    createDiscountUseCase: CreateDiscountUseCase,
    getAllDiscountsUseCase: GetAllDiscountsUseCase,
    getDiscountByIdUseCase: GetDiscountByIdUseCase,
    updateDiscountUseCase: UpdateDiscountUseCase,
    deleteDiscountUseCase: DeleteDiscountUseCase
  ) {
    this.createDiscountUseCase = createDiscountUseCase;
    this.getAllDiscountsUseCase = getAllDiscountsUseCase;
    this.getDiscountByIdUseCase = getDiscountByIdUseCase;
    this.updateDiscountUseCase = updateDiscountUseCase;
    this.deleteDiscountUseCase = deleteDiscountUseCase;
    const discountRepository = new DiscountRepository();
    this.discountService = new BookDiscountService(discountRepository);
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const discountDTO = plainToClass(CreateDiscountDTO, req.body);
      const errors = await validate(discountDTO);

      if (errors.length > 0) {
        throw new AppError('Validation failed', 400);
      }

      const discount = await this.createDiscountUseCase.execute(discountDTO);
      if (!discount) {
        throw new AppError('Failed to create discount', 500);
      }
      
      const response: DiscountResponseDTO = {
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
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const discounts = await this.getAllDiscountsUseCase.execute();
      
      const response: DiscountResponseDTO[] = discounts.map((discount: Discount) => ({
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
      const discount = await this.getDiscountByIdUseCase.execute(id);
      
      if (!discount) {
        throw new AppError('Discount not found', 404);
      }

      const response: DiscountResponseDTO = {
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
      const discountDTO = plainToClass(UpdateDiscountDTO, req.body);
      const errors = await validate(discountDTO);

      if (errors.length > 0) {
        throw new AppError('Validation failed', 400);
      }

      const discount = await this.updateDiscountUseCase.execute(id, discountDTO);
      if (!discount) {
        throw new AppError('Discount not found', 404);
      }
      
      const response: DiscountResponseDTO = {
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
      const success = await this.deleteDiscountUseCase.execute(id);
      
      if (!success) {
        throw new AppError('Discount not found', 404);
      }

      return res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async calculateBookPrice(req: Request, res: Response): Promise<Response> {
    try {
      const { bookId } = req.params;
      const bookRepository = AppDataSource.getRepository(Book);
      const book = await bookRepository.findOneBy({ id: bookId });

      if (!book) {
        throw new AppError('Book not found', 404);
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
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
} 