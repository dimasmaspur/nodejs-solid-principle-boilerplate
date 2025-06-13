"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllDiscountsUseCase = void 0;
class GetAllDiscountsUseCase {
    constructor(discountRepository) {
        this.discountRepository = discountRepository;
    }
    async execute() {
        return this.discountRepository.findAll();
    }
}
exports.GetAllDiscountsUseCase = GetAllDiscountsUseCase;
//# sourceMappingURL=GetAllDiscountsUseCase.js.map