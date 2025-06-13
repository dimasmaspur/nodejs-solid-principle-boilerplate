"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountRepository = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../../config/database");
const Discount_1 = require("../../domain/entities/Discount");
class DiscountRepository {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(Discount_1.Discount);
    }
    async findById(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['book']
        });
    }
    async findByBookId(bookId) {
        return this.repository.find({
            where: { book: { id: bookId } },
            relations: ['book']
        });
    }
    async findActiveByBookId(bookId) {
        const now = new Date();
        return this.repository.findOne({
            where: {
                book: { id: bookId },
                startDate: (0, typeorm_1.LessThanOrEqual)(now),
                endDate: (0, typeorm_1.MoreThanOrEqual)(now)
            },
            relations: ['book']
        });
    }
    async findAll() {
        return this.repository.find({
            relations: ['book']
        });
    }
    async create(discount) {
        const newDiscount = this.repository.create(discount);
        return this.repository.save(newDiscount);
    }
    async update(id, discount) {
        await this.repository.update(id, discount);
        return this.findById(id);
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
exports.DiscountRepository = DiscountRepository;
//# sourceMappingURL=DiscountRepository.js.map