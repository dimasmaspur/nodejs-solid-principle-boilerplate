import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';

config();

const dbConfig: DataSourceOptions = {
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
};

// Log konfigurasi database (tanpa password)
const logConfig = {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: '******',
  database: dbConfig.database,
  synchronize: dbConfig.synchronize,
  logging: dbConfig.logging,
  entities: (dbConfig.entities as string[]).map(p => path.basename(p)),
  migrations: (dbConfig.migrations as string[]).map(p => path.basename(p)),
  subscribers: (dbConfig.subscribers as string[]).map(p => path.basename(p))
};

console.log('Database Configuration:', logConfig);

export const AppDataSource = new DataSource(dbConfig); 