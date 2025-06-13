import { AppDataSource } from '../../config/database';
import { InitialDataSeeder } from './seeders/InitialDataSeeder';

async function runSeeder() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connection initialized');

    // Run seeder
    const seeder = new InitialDataSeeder(AppDataSource);
    await seeder.seed();
    console.log('Seeder completed successfully');

    // Close database connection
    await AppDataSource.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error running seeder:', error);
    process.exit(1);
  }
}

// Run seeder
runSeeder(); 