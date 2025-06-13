"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBookUseCase = void 0;
class DeleteBookUseCase {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    async execute(id) {
        const existingBook = await this.bookRepository.findById(id);
        if (!existingBook) {
            throw new Error('Book not found');
        }
        const isDeleted = await this.bookRepository.delete(id);
        if (!isDeleted) {
            throw new Error('Failed to delete book');
        }
        return true;
    }
}
exports.DeleteBookUseCase = DeleteBookUseCase;
//# sourceMappingURL=DeleteBookUseCase.js.map