"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
const UserDTO_1 = require("../../dtos/UserDTO");
const AppError_1 = require("../../../shared/errors/AppError");
class CreateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(data) {
        var _a;
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError_1.AppError('Email sudah terdaftar', 400);
        }
        const user = await this.userRepository.create({
            ...data,
            role: data.role || UserDTO_1.UserRole.USER,
            isActive: (_a = data.isActive) !== null && _a !== void 0 ? _a : true
        });
        return user;
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
//# sourceMappingURL=CreateUserUseCase.js.map