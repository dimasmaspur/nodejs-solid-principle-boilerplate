"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class DeleteUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new AppError_1.AppError('User tidak ditemukan', 404);
        }
        const success = await this.userRepository.delete(id);
        if (!success) {
            throw new AppError_1.AppError('Gagal menghapus user', 500);
        }
    }
}
exports.DeleteUserUseCase = DeleteUserUseCase;
//# sourceMappingURL=DeleteUserUseCase.js.map