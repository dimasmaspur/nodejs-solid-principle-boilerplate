import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'book_crud_db',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(__dirname, '../domain/entities/*.{ts,js}')],
  migrations: [path.join(__dirname, '../infrastructure/database/migrations/*.{ts,js}')],
  subscribers: [path.join(__dirname, '../infrastructure/database/subscribers/*.{ts,js}')],
}); 