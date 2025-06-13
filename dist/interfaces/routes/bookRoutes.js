"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BookController_1 = require("../controllers/BookController");
const CreateBookUseCase_1 = require("../../application/use-cases/book/CreateBookUseCase");
const GetBookByIdUseCase_1 = require("../../application/use-cases/book/GetBookByIdUseCase");
const GetAllBooksUseCase_1 = require("../../application/use-cases/book/GetAllBooksUseCase");
const UpdateBookUseCase_1 = require("../../application/use-cases/book/UpdateBookUseCase");
const DeleteBookUseCase_1 = require("../../application/use-cases/book/DeleteBookUseCase");
const BookRepository_1 = require("../../infrastructure/repositories/BookRepository");
const router = (0, express_1.Router)();
const bookRepository = new BookRepository_1.BookRepository();
const createBookUseCase = new CreateBookUseCase_1.CreateBookUseCase(bookRepository);
const getBookByIdUseCase = new GetBookByIdUseCase_1.GetBookByIdUseCase(bookRepository);
const getAllBooksUseCase = new GetAllBooksUseCase_1.GetAllBooksUseCase(bookRepository);
const updateBookUseCase = new UpdateBookUseCase_1.UpdateBookUseCase(bookRepository);
const deleteBookUseCase = new DeleteBookUseCase_1.DeleteBookUseCase(bookRepository);
const bookController = new BookController_1.BookController(createBookUseCase, getAllBooksUseCase, getBookByIdUseCase, updateBookUseCase, deleteBookUseCase);
router.post('/', async (req, res, next) => {
    try {
        await bookController.create(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        await bookController.getAll(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        await bookController.getById(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await bookController.update(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await bookController.delete(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=bookRoutes.js.map