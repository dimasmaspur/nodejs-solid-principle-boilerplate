import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1709999999999 implements MigrationInterface {
    name = 'CreateInitialTables1709999999999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create books table
        await queryRunner.query(`
            CREATE TABLE books (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                isbn VARCHAR(13) UNIQUE,
                stock INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create discounts table
        await queryRunner.query(`
            CREATE TABLE discounts (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
                percentage DECIMAL(5,2) NOT NULL,
                start_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create index for faster queries
        await queryRunner.query(`
            CREATE INDEX idx_discounts_book_id ON discounts(book_id)
        `);
        await queryRunner.query(`
            CREATE INDEX idx_discounts_dates ON discounts(start_date, end_date)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order
        await queryRunner.query(`DROP TABLE IF EXISTS discounts`);
        await queryRunner.query(`DROP TABLE IF EXISTS books`);
    }
} 