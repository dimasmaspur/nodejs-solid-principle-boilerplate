import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserRole } from '../../../application/dtos/UserDTO';

export class CreateUserTable1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Buat enum type untuk role
    await queryRunner.query(`
      CREATE TYPE user_role_enum AS ENUM ('${UserRole.ADMIN}', '${UserRole.USER}')
    `);

    // Buat tabel users
    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        role user_role_enum NOT NULL DEFAULT '${UserRole.USER}',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Buat index untuk email
    await queryRunner.query(`
      CREATE INDEX idx_users_email ON users(email)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Hapus tabel users
    await queryRunner.query(`DROP TABLE IF EXISTS users`);

    // Hapus enum type
    await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum`);
  }
} 