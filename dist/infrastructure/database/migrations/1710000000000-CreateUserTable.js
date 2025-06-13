"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserTable1710000000000 = void 0;
const UserDTO_1 = require("../../../application/dtos/UserDTO");
class CreateUserTable1710000000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE user_role_enum AS ENUM ('${UserDTO_1.UserRole.ADMIN}', '${UserDTO_1.UserRole.USER}')
    `);
        await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        role user_role_enum NOT NULL DEFAULT '${UserDTO_1.UserRole.USER}',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await queryRunner.query(`
      CREATE INDEX idx_users_email ON users(email)
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS users`);
        await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum`);
    }
}
exports.CreateUserTable1710000000000 = CreateUserTable1710000000000;
//# sourceMappingURL=1710000000000-CreateUserTable.js.map