"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBookUseCase = void 0;
class UpdateBookUseCase {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    async execute(id, bookData) {
        const existingBook = await this.bookRepository.findById(id);
        if (!existingBook) {
            throw new Error('Book not found');
        }
        const updatedBook = await this.bookRepository.update(id, bookData);
        if (!updatedBook) {
            throw new Error('Failed to update book');
        }
        return updatedBook;
    }
}
exports.UpdateBookUseCase = UpdateBookUseCase;
//# sourceMappingURL=UpdateBookUseCase.js.map