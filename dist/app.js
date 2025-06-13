"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = require("dotenv");
const database_1 = require("./config/database");
const bookRoutes_1 = __importDefault(require("./interfaces/routes/bookRoutes"));
const discountRoutes_1 = __importDefault(require("./interfaces/routes/discountRoutes"));
const userRoutes_1 = __importDefault(require("./interfaces/routes/userRoutes"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/books', bookRoutes_1.default);
app.use('/api/discounts', discountRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});
const PORT = process.env.PORT || 3000;
database_1.AppDataSource.initialize()
    .then(() => {
    console.log('Database connection established');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error during Data Source initialization:', error);
});
exports.default = app;
//# sourceMappingURL=app.js.map