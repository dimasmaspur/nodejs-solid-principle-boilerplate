"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const AppError_1 = require("../../shared/errors/AppError");
class UserController {
    constructor(createUserUseCase, getUserUseCase, getAllUsersUseCase, updateUserUseCase, deleteUserUseCase) {
        this.createUserUseCase = createUserUseCase;
        this.getUserUseCase = getUserUseCase;
        this.getAllUsersUseCase = getAllUsersUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
    }
    async create(req, res) {
        try {
            const userData = req.body;
            const user = await this.createUserUseCase.execute(userData);
            const response = {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
            return res.status(201).json(response);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await this.getUserUseCase.execute(id);
            const response = {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
            return res.json(response);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getAll(_req, res) {
        try {
            const users = await this.getAllUsersUseCase.execute();
            const response = users.map(user => ({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }));
            return res.json(response);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;
            const user = await this.updateUserUseCase.execute(id, userData);
            const response = {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
            return res.json(response);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            await this.deleteUserUseCase.execute(id);
            return res.status(204).send();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map