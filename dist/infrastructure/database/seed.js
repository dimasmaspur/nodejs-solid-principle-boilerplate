"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../config/database");
const InitialDataSeeder_1 = require("./seeders/InitialDataSeeder");
async function runSeeder() {
    try {
        await database_1.AppDataSource.initialize();
        console.log('Database connection initialized');
        const seeder = new InitialDataSeeder_1.InitialDataSeeder(database_1.AppDataSource);
        await seeder.seed();
        console.log('Seeder completed successfully');
        await database_1.AppDataSource.destroy();
        console.log('Database connection closed');
    }
    catch (error) {
        console.error('Error running seeder:', error);
        process.exit(1);
    }
}
runSeeder();
//# sourceMappingURL=seed.js.map