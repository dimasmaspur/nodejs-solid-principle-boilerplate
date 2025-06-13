import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Store API Documentation',
      version,
      description: 'API documentation for Book Store application',
      contact: {
        name: 'API Support',
        email: 'support@bookstore.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Success'
            },
            data: {
              type: 'object',
              nullable: true
            },
            error: {
              type: 'object',
              nullable: true,
              properties: {
                code: {
                  type: 'string',
                  example: 'ERROR'
                },
                details: {
                  type: 'object',
                  nullable: true
                }
              }
            },
            meta: {
              type: 'object',
              nullable: true,
              properties: {
                page: {
                  type: 'number',
                  example: 1
                },
                limit: {
                  type: 'number',
                  example: 10
                },
                total: {
                  type: 'number',
                  example: 100
                },
                totalPages: {
                  type: 'number',
                  example: 10
                }
              }
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                  example: '123e4567-e89b-12d3-a456-426614174000'
                },
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com'
                },
                name: {
                  type: 'string',
                  example: 'John Doe'
                },
                role: {
                  type: 'string',
                  enum: ['USER', 'ADMIN'],
                  example: 'USER'
                }
              }
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/interfaces/routes/*.ts', './src/interfaces/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options); 