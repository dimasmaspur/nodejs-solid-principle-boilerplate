"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDiscountUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class DeleteDiscountUseCase {
    constructor(discountRepository) {
        this.discountRepository = discountRepository;
    }
    async execute(id) {
        const existingDiscount = await this.discountRepository.findById(id);
        if (!existingDiscount) {
            throw new AppError_1.AppError('Discount not found', 404);
        }
        const success = await this.discountRepository.delete(id);
        if (!success) {
            throw new AppError_1.AppError('Failed to delete discount', 500);
        }
        return true;
    }
}
exports.DeleteDiscountUseCase = DeleteDiscountUseCase;
//# sourceMappingURL=DeleteDiscountUseCase.js.map