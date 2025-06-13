"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookDiscountService = void 0;
class BookDiscountService {
    constructor(discountRepository) {
        this.discountRepository = discountRepository;
    }
    async calculateFinalPrice(book) {
        const activeDiscount = await this.discountRepository.findActiveByBookId(book.id);
        if (!activeDiscount) {
            return {
                originalPrice: book.price,
                discountAmount: 0,
                finalPrice: book.price,
                appliedDiscount: null
            };
        }
        const discountAmount = this.calculateDiscountAmount(activeDiscount, book.price);
        const finalPrice = book.price - discountAmount;
        return {
            originalPrice: book.price,
            discountAmount,
            finalPrice: Math.max(0, finalPrice),
            appliedDiscount: activeDiscount
        };
    }
    calculateDiscountAmount(discount, originalPrice) {
        return (originalPrice * discount.percentage) / 100;
    }
    validateDiscount(discount) {
        const errors = [];
        if (discount.startDate && discount.endDate) {
            if (discount.startDate >= discount.endDate) {
                errors.push('Start date must be before end date');
            }
        }
        if (discount.percentage !== undefined) {
            if (discount.percentage < 0) {
                errors.push('Discount percentage cannot be negative');
            }
            if (discount.percentage > 100) {
                errors.push('Discount percentage cannot exceed 100%');
            }
        }
        return errors;
    }
}
exports.BookDiscountService = BookDiscountService;
//# sourceMappingURL=BookDiscountService.js.map