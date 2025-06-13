"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllBooksUseCase = void 0;
class GetAllBooksUseCase {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    async execute() {
        return this.bookRepository.findAll();
    }
}
exports.GetAllBooksUseCase = GetAllBooksUseCase;
//# sourceMappingURL=GetAllBooksUseCase.js.map