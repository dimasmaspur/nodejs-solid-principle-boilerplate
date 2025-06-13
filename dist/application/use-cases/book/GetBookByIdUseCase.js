"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBookByIdUseCase = void 0;
class GetBookByIdUseCase {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    async execute(id) {
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new Error('Book not found');
        }
        return book;
    }
}
exports.GetBookByIdUseCase = GetBookByIdUseCase;
//# sourceMappingURL=GetBookByIdUseCase.js.map