"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookUseCase = void 0;
class CreateBookUseCase {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    async execute(bookData) {
        const book = await this.bookRepository.create(bookData);
        return book;
    }
}
exports.CreateBookUseCase = CreateBookUseCase;
//# sourceMappingURL=CreateBookUseCase.js.map