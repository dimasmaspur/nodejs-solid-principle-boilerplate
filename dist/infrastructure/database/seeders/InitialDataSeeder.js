"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialDataSeeder = void 0;
const Book_1 = require("../../../domain/entities/Book");
const Discount_1 = require("../../../domain/entities/Discount");
const User_1 = require("../../../domain/entities/User");
const UserDTO_1 = require("../../../application/dtos/UserDTO");
class InitialDataSeeder {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async seed() {
        const bookRepository = this.dataSource.getRepository(Book_1.Book);
        const books = [
            {
                title: 'Clean Code',
                author: 'Robert C. Martin',
                price: 150000,
                description: 'A handbook of agile software craftsmanship',
                isbn: '9780132350884',
                stock: 10
            },
            {
                title: 'Domain-Driven Design',
                author: 'Eric Evans',
                price: 200000,
                description: 'Tackling complexity in the heart of software',
                isbn: '9780321125217',
                stock: 5
            }
        ];
        for (const bookData of books) {
            const existingBook = await bookRepository.findOne({ where: { isbn: bookData.isbn } });
            if (!existingBook) {
                const book = bookRepository.create(bookData);
                await bookRepository.save(book);
            }
        }
        const discountRepository = this.dataSource.getRepository(Discount_1.Discount);
        const book1 = await bookRepository.findOne({ where: { isbn: '9780132350884' } });
        const book2 = await bookRepository.findOne({ where: { isbn: '9780321125217' } });
        if (book1) {
            const existingDiscount1 = await discountRepository.findOne({
                where: { book: { id: book1.id } }
            });
            if (!existingDiscount1) {
                const discount1 = discountRepository.create({
                    book: { id: book1.id },
                    percentage: 10,
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                });
                await discountRepository.save(discount1);
            }
        }
        if (book2) {
            const existingDiscount2 = await discountRepository.findOne({
                where: { book: { id: book2.id } }
            });
            if (!existingDiscount2) {
                const discount2 = discountRepository.create({
                    book: { id: book2.id },
                    percentage: 15,
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
                });
                await discountRepository.save(discount2);
            }
        }
        const userRepository = this.dataSource.getRepository(User_1.User);
        const adminEmail = 'admin@example.com';
        const existingAdmin = await userRepository.findOne({ where: { email: adminEmail } });
        if (!existingAdmin) {
            const admin = userRepository.create({
                email: adminEmail,
                password: 'admin123',
                name: 'Admin',
                role: UserDTO_1.UserRole.ADMIN,
                isActive: true
            });
            await admin.hashPassword();
            await userRepository.save(admin);
        }
    }
}
exports.InitialDataSeeder = InitialDataSeeder;
//# sourceMappingURL=InitialDataSeeder.js.map