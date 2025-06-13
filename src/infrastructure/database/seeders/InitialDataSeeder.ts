import { DataSource } from 'typeorm';
import { Book } from '../../../domain/entities/Book';
import { Discount } from '../../../domain/entities/Discount';
import { User } from '../../../domain/entities/User';
import { UserRole } from '../../../application/dtos/UserDTO';

export class InitialDataSeeder {
  constructor(private dataSource: DataSource) {}

  async seed(): Promise<void> {
    // Seed books
    const bookRepository = this.dataSource.getRepository(Book);
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

    // Seed discounts
    const discountRepository = this.dataSource.getRepository(Discount);
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
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 hari dari sekarang
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
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 hari dari sekarang
        });
        await discountRepository.save(discount2);
      }
    }

    // Seed admin user
    const userRepository = this.dataSource.getRepository(User);
    const adminEmail = 'admin@example.com';
    
    const existingAdmin = await userRepository.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const admin = userRepository.create({
        email: adminEmail,
        password: 'admin123', // Password akan di-hash oleh entity
        name: 'Admin',
        role: UserRole.ADMIN,
        isActive: true
      });
      await userRepository.save(admin);
    }
  }
} 