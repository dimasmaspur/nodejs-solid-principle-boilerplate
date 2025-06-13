import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/user/CreateUserUseCase';
import { GetUserUseCase } from '../../application/use-cases/user/GetUserUseCase';
import { GetAllUsersUseCase } from '../../application/use-cases/user/GetAllUsersUseCase';
import { UpdateUserUseCase } from '../../application/use-cases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../application/use-cases/user/DeleteUserUseCase';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../../application/dtos/UserDTO';
import { AppError } from '../../shared/errors/AppError';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUserUseCase: GetUserUseCase,
    private getAllUsersUseCase: GetAllUsersUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDTO = req.body;
      const user = await this.createUserUseCase.execute(userData);
      
      const response: UserResponseDTO = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.status(201).apiSuccess(response, 'User berhasil dibuat');
    } catch (error) {
      if (error instanceof AppError) {
        res.apiError(error.message, 'USER_ERROR', error);
        return;
      }
      res.apiError('Internal server error', 'SERVER_ERROR');
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getUserUseCase.execute(id);
      
      const response: UserResponseDTO = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.apiSuccess(response);
    } catch (error) {
      if (error instanceof AppError) {
        res.apiError(error.message, 'USER_ERROR', error);
        return;
      }
      res.apiError('Internal server error', 'SERVER_ERROR');
    }
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const users = await this.getAllUsersUseCase.execute();
      
      const response: UserResponseDTO[] = users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));

      res.apiSuccess(response);
    } catch (error) {
      if (error instanceof AppError) {
        res.apiError(error.message, 'USER_ERROR', error);
        return;
      }
      res.apiError('Internal server error', 'SERVER_ERROR');
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userData: UpdateUserDTO = req.body;
      const user = await this.updateUserUseCase.execute(id, userData);
      
      const response: UserResponseDTO = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.apiSuccess(response, 'User berhasil diupdate');
    } catch (error) {
      if (error instanceof AppError) {
        res.apiError(error.message, 'USER_ERROR', error);
        return;
      }
      res.apiError('Internal server error', 'SERVER_ERROR');
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteUserUseCase.execute(id);
      res.apiSuccess(null, 'User berhasil dihapus');
    } catch (error) {
      if (error instanceof AppError) {
        res.apiError(error.message, 'USER_ERROR', error);
        return;
      }
      res.apiError('Internal server error', 'SERVER_ERROR');
    }
  }
} 