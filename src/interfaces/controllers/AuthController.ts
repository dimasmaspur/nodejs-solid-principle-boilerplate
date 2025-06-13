import { Request, Response } from 'express';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { AppError } from '../../shared/errors/AppError';
import { LoginDTO } from '../../application/dtos/AuthDTO';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginDTO = plainToClass(LoginDTO, req.body);
      const errors = await validate(loginDTO);

      if (errors.length > 0) {
        const errorMessages = errors.map(error => Object.values(error.constraints || {})).flat();
        throw new AppError(errorMessages.join(', '), 400);
      }

      const result = await this.loginUseCase.execute(loginDTO);
      res.apiSuccess(result, 'Login berhasil');
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).apiError(error.message, 'AUTH_ERROR');
        return;
      }
      res.status(500).apiError('Internal server error', 'SERVER_ERROR');
    }
  }
} 