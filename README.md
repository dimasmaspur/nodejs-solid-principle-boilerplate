# Book CRUD Application dengan SOLID Principles

Aplikasi CRUD buku yang mengimplementasikan SOLID Principles, Clean Architecture, dan Domain-Driven Design menggunakan Node.js, Express, TypeScript, dan PostgreSQL.

## 🏗️ Struktur Proyek

```
src/
├── application/           # Layer aplikasi (Use Cases)
│   ├── dtos/             # Data Transfer Objects
│   └── use-cases/        # Implementasi business logic
│       ├── book/         # Use cases untuk buku
│       └── discount/     # Use cases untuk diskon
├── domain/               # Layer domain (Business Rules)
│   ├── entities/         # Business entities
│   ├── repositories/     # Repository interfaces
│   └── services/         # Domain services
├── infrastructure/       # Layer infrastruktur
│   ├── database/         # Konfigurasi database
│   │   ├── migrations/   # Database migrations
│   │   └── seeders/      # Database seeders
│   └── repositories/     # Implementasi repository
└── interfaces/           # Layer interface
    ├── controllers/      # API controllers
    ├── middlewares/      # Express middlewares
    └── routes/           # API routes
```

## 🚀 Teknologi yang Digunakan

- **Node.js & Express**: Runtime dan framework web
- **TypeScript**: Bahasa pemrograman
- **PostgreSQL**: Database
- **TypeORM**: ORM untuk database
- **Class Validator**: Validasi data
- **Class Transformer**: Transformasi data

## 📋 Prasyarat

- Node.js (v14 atau lebih baru)
- PostgreSQL
- npm atau yarn

## 🛠️ Instalasi

1. Clone repository:
```bash
git clone [url-repository]
cd [nama-folder]
```

2. Install dependencies:
```bash
npm install
```

3. Buat file `.env` berdasarkan `.env.example`:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=book_crud_db

# JWT Configuration (untuk autentikasi nanti)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
```

4. Setup database:
```bash
# Jalankan migrasi dan seeder
npm run db:setup

# Atau jalankan secara terpisah
npm run migration:run
npm run seed
```

## 🏃‍♂️ Menjalankan Aplikasi

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Books

1. **Create Book** (POST /api/books)
```json
{
  "title": "Judul Buku",
  "author": "Nama Penulis",
  "description": "Deskripsi buku",
  "price": 150000,
  "isAvailable": true
}
```

2. **Get All Books** (GET /api/books)

3. **Get Book by ID** (GET /api/books/:id)

4. **Update Book** (PUT /api/books/:id)
```json
{
  "title": "Judul Buku Baru",
  "author": "Nama Penulis Baru",
  "description": "Deskripsi baru",
  "price": 200000,
  "isAvailable": false
}
```

5. **Delete Book** (DELETE /api/books/:id)

### Discounts

1. **Create Discount** (POST /api/discounts)
```json
{
  "type": "PERCENTAGE",
  "value": 20,
  "startDate": "2024-03-20T00:00:00Z",
  "endDate": "2024-04-20T00:00:00Z",
  "bookId": "uuid-buku",
  "description": "Diskon spesial 20%"
}
```

2. **Calculate Book Price** (GET /api/discounts/calculate/:bookId)

## 🔄 Database Migrations

### Generate Migrasi
```bash
npm run migration:generate src/infrastructure/database/migrations/[nama-migrasi]
```

### Jalankan Migrasi
```bash
npm run migration:run
```

### Rollback Migrasi
```bash
npm run migration:revert
```

## 🧪 Database Seeding

Jalankan seeder untuk mengisi data awal:
```bash
npm run seed
```

## 🏗️ Arsitektur & SOLID Principles

### Clean Architecture
- **Domain Layer**: Berisi business logic dan entities
- **Application Layer**: Berisi use cases dan DTOs
- **Infrastructure Layer**: Implementasi teknis (database, external services)
- **Interface Layer**: API controllers dan routes

### SOLID Principles
1. **Single Responsibility Principle (SRP)**
   - Setiap class memiliki satu tanggung jawab
   - Contoh: `BookRepository` hanya menangani operasi database buku
   - `BookDiscountService` hanya menangani perhitungan diskon

2. **Open/Closed Principle (OCP)**
   - Kode terbuka untuk ekstensi, tertutup untuk modifikasi
   - Contoh: Interface `IBookRepository` memungkinkan implementasi baru
   - DTO classes bisa di-extend untuk validasi baru

3. **Liskov Substitution Principle (LSP)**
   - Implementasi harus bisa di-substitute dengan interface-nya
   - Contoh: `DiscountRepository` mengimplementasikan `IDiscountRepository`
   - `UpdateBookDTO` mengimplementasikan `Partial<IBookBase>`

4. **Interface Segregation Principle (ISP)**
   - Interface harus spesifik untuk client-nya
   - Contoh: `IBookRepository` hanya mendefinisikan method yang diperlukan
   - DTO classes dipisahkan berdasarkan use case

5. **Dependency Inversion Principle (DIP)**
   - High-level modules tidak bergantung pada low-level modules
   - Contoh: Use cases bergantung pada interface repository
   - Controller menggunakan dependency injection

### Domain-Driven Design (DDD)
- **Entities**: `Book`, `Discount`
- **Value Objects**: DTOs
- **Domain Services**: `BookDiscountService`
- **Repositories**: `BookRepository`, `DiscountRepository`

## 🔍 Domain Services

### BookDiscountService
- Menghitung harga akhir buku dengan diskon
- Validasi aturan diskon
- Mencari diskon terbaik
- Mendukung tipe diskon:
  - Percentage (persentase)
  - Fixed Amount (jumlah tetap)

## 📝 Catatan Pengembangan

### Menambah Entity Baru
1. Buat entity di `domain/entities/`
2. Buat interface repository di `domain/repositories/`
3. Implementasi repository di `infrastructure/repositories/`
4. Buat DTO di `application/dtos/`
5. Buat use cases di `application/use-cases/`
6. Buat controller di `interfaces/controllers/`
7. Buat routes di `interfaces/routes/`
8. Generate dan jalankan migrasi

### Menambah Domain Service
1. Buat service di `domain/services/`
2. Implementasi business logic
3. Inject repository yang diperlukan
4. Gunakan di use cases yang relevan

### Best Practices
1. Selalu gunakan interface untuk repository
2. Validasi input menggunakan DTO
3. Handle errors dengan proper
4. Gunakan dependency injection
5. Tulis unit tests untuk business logic
6. Dokumentasikan API dengan Swagger
7. Gunakan environment variables
8. Implementasi logging
9. Gunakan transaction untuk operasi database yang kompleks

## 🔜 Fitur yang Akan Datang
1. Autentikasi dan otorisasi
2. Unit testing
3. API documentation dengan Swagger
4. Caching layer
5. Rate limiting
6. Logging system
7. Error tracking
8. CI/CD pipeline 