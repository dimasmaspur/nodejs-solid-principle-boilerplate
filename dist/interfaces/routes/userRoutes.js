"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const CreateUserUseCase_1 = require("../../application/use-cases/user/CreateUserUseCase");
const GetUserUseCase_1 = require("../../application/use-cases/user/GetUserUseCase");
const GetAllUsersUseCase_1 = require("../../application/use-cases/user/GetAllUsersUseCase");
const UpdateUserUseCase_1 = require("../../application/use-cases/user/UpdateUserUseCase");
const DeleteUserUseCase_1 = require("../../application/use-cases/user/DeleteUserUseCase");
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
const router = (0, express_1.Router)();
const userRepository = new UserRepository_1.UserRepository();
const createUserUseCase = new CreateUserUseCase_1.CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase_1.GetUserUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase_1.GetAllUsersUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase_1.UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase_1.DeleteUserUseCase(userRepository);
const userController = new UserController_1.UserController(createUserUseCase, getUserUseCase, getAllUsersUseCase, updateUserUseCase, deleteUserUseCase);
router.post('/', async (req, res, next) => {
    try {
        await userController.create(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        await userController.getAll(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        await userController.getById(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await userController.update(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await userController.delete(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=userRoutes.js.map