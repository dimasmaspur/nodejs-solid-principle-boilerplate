import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { UserController } from '../controllers/UserController';
import { CreateUserUseCase } from '../../application/use-cases/user/CreateUserUseCase';
import { GetUserUseCase } from '../../application/use-cases/user/GetUserUseCase';
import { GetAllUsersUseCase } from '../../application/use-cases/user/GetAllUsersUseCase';
import { UpdateUserUseCase } from '../../application/use-cases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../application/use-cases/user/DeleteUserUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { JwtService } from '../../infrastructure/services/JwtService';

const router = Router();
const userRepository = new UserRepository();
const jwtService = new JwtService();
const authMiddleware = new AuthMiddleware(jwtService);

// Initialize use cases
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

// Initialize controller
const userController = new UserController(
  createUserUseCase,
  getUserUseCase,
  getAllUsersUseCase,
  updateUserUseCase,
  deleteUserUseCase
);

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *         name:
 *           type: string
 *           example: John Doe
 *         phone:
 *           type: string
 *           example: +6281234567890
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *           example: USER
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         phone:
 *           type: string
 *           example: +6281234567890
 *         isActive:
 *           type: boolean
 *           example: true
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         name:
 *           type: string
 *           example: John Doe
 *         phone:
 *           type: string
 *           example: +6281234567890
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *           example: USER
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-03-20T10:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-03-20T10:00:00Z
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     description: Create a new user with the provided information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Forbidden - Only admin can create users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/', authMiddleware.authorize(['ADMIN']), async (req, res, next) => {
  try {
    await userController.create(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Forbidden - Only admin can view all users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/', authMiddleware.authorize(['ADMIN']), async (_req, res, next) => {
  try {
    await userController.getAll(_req, res);
  } catch (error) {
    next(error);
  }
});

const getByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    if (req.user?.role !== 'ADMIN' && req.user?.id !== req.params.id) {
      res.status(403).apiError('Anda tidak memiliki akses untuk melihat profil user lain', 'FORBIDDEN');
      return;
    }
    await userController.getById(req, res);
  } catch (error) {
    next(error);
  }
};

const updateHandler: RequestHandler = async (req, res, next) => {
  try {
    if (req.user?.role !== 'ADMIN' && req.user?.id !== req.params.id) {
      res.status(403).apiError('Anda tidak memiliki akses untuk mengupdate profil user lain', 'FORBIDDEN');
      return;
    }
    await userController.update(req, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieve a user by their ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Forbidden - User can only view their own profile unless admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/:id', getByIdHandler);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user
 *     description: Update a user's information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Forbidden - User can only update their own profile unless admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put('/:id', updateHandler);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user
 *     description: Delete a user by their ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Forbidden - Only admin can delete users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/:id', authMiddleware.authorize(['ADMIN']), async (req, res, next) => {
  try {
    await userController.delete(req, res);
  } catch (error) {
    next(error);
  }
});

export default router; 