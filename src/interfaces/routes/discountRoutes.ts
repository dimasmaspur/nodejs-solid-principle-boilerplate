import { Router } from 'express';
import { DiscountController } from '../controllers/DiscountController';
import { CreateDiscountUseCase } from '../../application/use-cases/discount/CreateDiscountUseCase';
import { GetAllDiscountsUseCase } from '../../application/use-cases/discount/GetAllDiscountsUseCase';
import { GetDiscountByIdUseCase } from '../../application/use-cases/discount/GetDiscountByIdUseCase';
import { UpdateDiscountUseCase } from '../../application/use-cases/discount/UpdateDiscountUseCase';
import { DeleteDiscountUseCase } from '../../application/use-cases/discount/DeleteDiscountUseCase';
import { DiscountRepository } from '../../infrastructure/repositories/DiscountRepository';

const router = Router();

// Initialize repository
const discountRepository = new DiscountRepository();

// Initialize use cases
const createDiscountUseCase = new CreateDiscountUseCase(discountRepository);
const getAllDiscountsUseCase = new GetAllDiscountsUseCase(discountRepository);
const getDiscountByIdUseCase = new GetDiscountByIdUseCase(discountRepository);
const updateDiscountUseCase = new UpdateDiscountUseCase(discountRepository);
const deleteDiscountUseCase = new DeleteDiscountUseCase(discountRepository);

// Initialize controller with dependencies
const discountController = new DiscountController(
  createDiscountUseCase,
  getAllDiscountsUseCase,
  getDiscountByIdUseCase,
  updateDiscountUseCase,
  deleteDiscountUseCase
);

// Routes
router.post('/', async (req, res, next) => {
  try {
    await discountController.create(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    await discountController.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await discountController.getById(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    await discountController.update(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await discountController.delete(req, res);
  } catch (error) {
    next(error);
  }
});

export default router; 