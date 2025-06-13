"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class UpdateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id, data) {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new AppError_1.AppError('User tidak ditemukan', 404);
        }
        if (data.email && data.email !== existingUser.email) {
            const userWithEmail = await this.userRepository.findByEmail(data.email);
            if (userWithEmail) {
                throw new AppError_1.AppError('Email sudah terdaftar', 400);
            }
        }
        const updatedUser = await this.userRepository.update(id, data);
        if (!updatedUser) {
            throw new AppError_1.AppError('Gagal mengupdate user', 500);
        }
        return updatedUser;
    }
}
exports.UpdateUserUseCase = UpdateUserUseCase;
//# sourceMappingURL=UpdateUserUseCase.js.map