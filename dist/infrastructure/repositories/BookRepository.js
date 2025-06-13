"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRepository = void 0;
const database_1 = require("../../config/database");
const Book_1 = require("../../domain/entities/Book");
class BookRepository {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(Book_1.Book);
    }
    async findAll() {
        return this.repository.find();
    }
    async findById(id) {
        return this.repository.findOneBy({ id });
    }
    async create(book) {
        const newBook = this.repository.create(book);
        return this.repository.save(newBook);
    }
    async update(id, book) {
        await this.repository.update(id, book);
        return this.findById(id);
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
exports.BookRepository = BookRepository;
//# sourceMappingURL=BookRepository.js.map