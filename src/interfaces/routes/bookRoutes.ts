import { Router } from 'express';
import { BookController } from '../controllers/BookController';
import { CreateBookUseCase } from '../../application/use-cases/book/CreateBookUseCase';
import { GetBookByIdUseCase } from '../../application/use-cases/book/GetBookByIdUseCase';
import { GetAllBooksUseCase } from '../../application/use-cases/book/GetAllBooksUseCase';
import { UpdateBookUseCase } from '../../application/use-cases/book/UpdateBookUseCase';
import { DeleteBookUseCase } from '../../application/use-cases/book/DeleteBookUseCase';
import { BookRepository } from '../../infrastructure/repositories/BookRepository';

const router = Router();

// Initialize repository
const bookRepository = new BookRepository();

// Initialize use cases
const createBookUseCase = new CreateBookUseCase(bookRepository);
const getBookByIdUseCase = new GetBookByIdUseCase(bookRepository);
const getAllBooksUseCase = new GetAllBooksUseCase(bookRepository);
const updateBookUseCase = new UpdateBookUseCase(bookRepository);
const deleteBookUseCase = new DeleteBookUseCase(bookRepository);

// Initialize controller with dependencies
const bookController = new BookController(
  createBookUseCase,
  getAllBooksUseCase,
  getBookByIdUseCase,
  updateBookUseCase,
  deleteBookUseCase
);

// Routes
router.post('/', async (req, res, next) => {
  try {
    await bookController.create(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    await bookController.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await bookController.getById(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    await bookController.update(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await bookController.delete(req, res);
  } catch (error) {
    next(error);
  }
});

export default router; 