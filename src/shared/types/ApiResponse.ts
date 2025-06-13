export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ApiResponseBuilder {
  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return {
      success: true,
      message,
      data
    };
  }

  static error(message: string, code: string = 'ERROR', details?: any): ApiResponse {
    return {
      success: false,
      message,
      error: {
        code,
        details
      }
    };
  }

  static paginate<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Success'
  ): ApiResponse<T[]> {
    return {
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
  }
} 