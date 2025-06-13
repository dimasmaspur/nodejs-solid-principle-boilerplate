"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../../config/database");
const User_1 = require("../../domain/entities/User");
class UserRepository {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(User_1.User);
    }
    async findById(id) {
        return this.repository.findOneBy({ id });
    }
    async findByEmail(email) {
        return this.repository.findOneBy({ email });
    }
    async findAll() {
        return this.repository.find({
            select: ['id', 'email', 'name', 'phone', 'isActive', 'role', 'createdAt', 'updatedAt']
        });
    }
    async create(user) {
        const newUser = this.repository.create(user);
        return this.repository.save(newUser);
    }
    async update(id, user) {
        await this.repository.update(id, user);
        return this.findById(id);
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map