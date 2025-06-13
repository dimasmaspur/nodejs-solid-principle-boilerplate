import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../shared/types/ApiResponse';

declare global {
  namespace Express {
    interface Response {
      apiSuccess: <T>(data: T, message?: string) => Response;
      apiError: (message: string, code?: string, details?: any) => Response;
      apiPaginate: <T>(data: T[], page: number, limit: number, total: number, message?: string) => Response;
    }
  }
}

export const responseMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  res.apiSuccess = function<T>(data: T, message: string = 'Success'): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data
    };
    return this.json(response);
  };

  res.apiError = function(message: string, code: string = 'ERROR', details?: any): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: {
        code,
        details
      }
    };
    return this.status(400).json(response);
  };

  res.apiPaginate = function<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Success'
  ): Response {
    const response: ApiResponse<T[]> = {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
    return this.json(response);
  };

  next();
}; 