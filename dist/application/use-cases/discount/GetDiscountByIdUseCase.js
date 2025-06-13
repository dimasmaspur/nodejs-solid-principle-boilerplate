"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDiscountByIdUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class GetDiscountByIdUseCase {
    constructor(discountRepository) {
        this.discountRepository = discountRepository;
    }
    async execute(id) {
        const discount = await this.discountRepository.findById(id);
        if (!discount) {
            throw new AppError_1.AppError('Discount not found', 404);
        }
        return discount;
    }
}
exports.GetDiscountByIdUseCase = GetDiscountByIdUseCase;
//# sourceMappingURL=GetDiscountByIdUseCase.js.map