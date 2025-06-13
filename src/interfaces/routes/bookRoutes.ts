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

/**
 * @swagger
 * /api/books:
 *   post:
 *     tags:
 *       - Books
 *     summary: Membuat buku baru
 *     description: Endpoint untuk membuat buku baru
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - price
 *               - isbn
 *               - stock
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Judul Buku"
 *               author:
 *                 type: string
 *                 example: "Nama Penulis"
 *               description:
 *                 type: string
 *                 example: "Deskripsi buku"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 150000
 *               isbn:
 *                 type: string
 *                 example: "9781234567890"
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 10
 *     responses:
 *       201:
 *         description: Buku berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Data tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/', async (req, res, next) => {
  try {
    await bookController.create(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/books:
 *   get:
 *     tags:
 *       - Books
 *     summary: Mendapatkan semua buku
 *     description: Endpoint untuk mendapatkan daftar semua buku
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Jumlah item per halaman
 *     responses:
 *       200:
 *         description: Daftar buku berhasil didapatkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/', async (req, res, next) => {
  try {
    await bookController.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     tags:
 *       - Books
 *     summary: Mendapatkan buku berdasarkan ID
 *     description: Endpoint untuk mendapatkan detail buku berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID buku
 *     responses:
 *       200:
 *         description: Detail buku berhasil didapatkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Buku tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/:id', async (req, res, next) => {
  try {
    await bookController.getById(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     tags:
 *       - Books
 *     summary: Mengupdate buku
 *     description: Endpoint untuk mengupdate data buku
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID buku
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Judul Buku Baru"
 *               author:
 *                 type: string
 *                 example: "Nama Penulis Baru"
 *               description:
 *                 type: string
 *                 example: "Deskripsi buku baru"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 200000
 *               isbn:
 *                 type: string
 *                 example: "9781234567891"
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 15
 *     responses:
 *       200:
 *         description: Buku berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Data tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Buku tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put('/:id', async (req, res, next) => {
  try {
    await bookController.update(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     tags:
 *       - Books
 *     summary: Menghapus buku
 *     description: Endpoint untuk menghapus buku
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID buku
 *     responses:
 *       200:
 *         description: Buku berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Tidak terautentikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Tidak memiliki akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Buku tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/:id', async (req, res, next) => {
  try {
    await bookController.delete(req, res);
  } catch (error) {
    next(error);
  }
});

export default router; 