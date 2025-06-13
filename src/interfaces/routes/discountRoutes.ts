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

/**
 * @swagger
 * /api/discounts:
 *   post:
 *     tags:
 *       - Discounts
 *     summary: Membuat diskon baru
 *     description: Endpoint untuk membuat diskon baru untuk buku
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - percentage
 *               - startDate
 *               - endDate
 *             properties:
 *               bookId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               percentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 20
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-03-20T00:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-04-20T00:00:00Z"
 *     responses:
 *       201:
 *         description: Diskon berhasil dibuat
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
 *       409:
 *         description: Sudah ada diskon aktif untuk buku ini
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/', async (req, res, next) => {
  try {
    await discountController.create(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/discounts:
 *   get:
 *     tags:
 *       - Discounts
 *     summary: Mendapatkan semua diskon
 *     description: Endpoint untuk mendapatkan daftar semua diskon
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
 *         description: Daftar diskon berhasil didapatkan
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
    await discountController.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/discounts/{id}:
 *   get:
 *     tags:
 *       - Discounts
 *     summary: Mendapatkan diskon berdasarkan ID
 *     description: Endpoint untuk mendapatkan detail diskon berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID diskon
 *     responses:
 *       200:
 *         description: Detail diskon berhasil didapatkan
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
 *         description: Diskon tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/:id', async (req, res, next) => {
  try {
    await discountController.getById(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/discounts/calculate/{bookId}:
 *   get:
 *     tags:
 *       - Discounts
 *     summary: Menghitung harga buku dengan diskon
 *     description: Endpoint untuk menghitung harga akhir buku setelah diskon
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID buku
 *     responses:
 *       200:
 *         description: Perhitungan harga berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 originalPrice:
 *                   type: number
 *                   example: 150000
 *                 discountAmount:
 *                   type: number
 *                   example: 30000
 *                 finalPrice:
 *                   type: number
 *                   example: 120000
 *                 appliedDiscount:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     bookId:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     percentage:
 *                       type: number
 *                       example: 20
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-20T00:00:00Z"
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-04-20T00:00:00Z"
 *                     isActive:
 *                       type: boolean
 *                       example: true
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
router.get('/calculate/:bookId', async (req, res, next) => {
  try {
    await discountController.calculateBookPrice(req, res);
  } catch (error) {
    next(error);
  }
});

export default router; 