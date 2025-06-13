import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from 'dotenv';
import { AppDataSource } from './config/database';
import bookRoutes from './interfaces/routes/bookRoutes';
import discountRoutes from './interfaces/routes/discountRoutes';
import userRoutes from './interfaces/routes/userRoutes';
import authRoutes from './interfaces/routes/authRoutes';
import { AuthMiddleware } from './interfaces/middleware/authMiddleware';
import { JwtService } from './infrastructure/services/JwtService';
import { IAuthService } from './domain/services/IAuthService';
import { responseMiddleware } from './interfaces/middleware/responseMiddleware';
import { swaggerSpec } from './config/swagger';

config();

const app = express();

// Dependency Injection
const authService: IAuthService = new JwtService();
const authMiddleware = new AuthMiddleware(authService);

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseMiddleware);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Book Store API Documentation'
}));

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/books', (req, res, next) => authMiddleware.authenticate(req, res, next), bookRoutes);
app.use('/api/discounts', (req, res, next) => authMiddleware.authenticate(req, res, next), discountRoutes);
app.use('/api/users', (req, res, next) => authMiddleware.authenticate(req, res, next), userRoutes);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

// Initialize database connection and start server
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });

export default app; 