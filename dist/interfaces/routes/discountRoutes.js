"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DiscountController_1 = require("../controllers/DiscountController");
const CreateDiscountUseCase_1 = require("../../application/use-cases/discount/CreateDiscountUseCase");
const GetAllDiscountsUseCase_1 = require("../../application/use-cases/discount/GetAllDiscountsUseCase");
const GetDiscountByIdUseCase_1 = require("../../application/use-cases/discount/GetDiscountByIdUseCase");
const UpdateDiscountUseCase_1 = require("../../application/use-cases/discount/UpdateDiscountUseCase");
const DeleteDiscountUseCase_1 = require("../../application/use-cases/discount/DeleteDiscountUseCase");
const DiscountRepository_1 = require("../../infrastructure/repositories/DiscountRepository");
const router = (0, express_1.Router)();
const discountRepository = new DiscountRepository_1.DiscountRepository();
const createDiscountUseCase = new CreateDiscountUseCase_1.CreateDiscountUseCase(discountRepository);
const getAllDiscountsUseCase = new GetAllDiscountsUseCase_1.GetAllDiscountsUseCase(discountRepository);
const getDiscountByIdUseCase = new GetDiscountByIdUseCase_1.GetDiscountByIdUseCase(discountRepository);
const updateDiscountUseCase = new UpdateDiscountUseCase_1.UpdateDiscountUseCase(discountRepository);
const deleteDiscountUseCase = new DeleteDiscountUseCase_1.DeleteDiscountUseCase(discountRepository);
const discountController = new DiscountController_1.DiscountController(createDiscountUseCase, getAllDiscountsUseCase, getDiscountByIdUseCase, updateDiscountUseCase, deleteDiscountUseCase);
router.post('/', async (req, res, next) => {
    try {
        await discountController.create(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        await discountController.getAll(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        await discountController.getById(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await discountController.update(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await discountController.delete(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=discountRoutes.js.map