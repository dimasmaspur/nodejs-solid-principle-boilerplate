import { IsString, IsNumber, IsOptional, Min, IsISBN } from 'class-validator';

export class CreateBookDTO {
  @IsString()
  title!: string;

  @IsString()
  author!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsISBN()
  isbn!: string;

  @IsNumber()
  @Min(0)
  stock!: number;
}

export class UpdateBookDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsISBN()
  @IsOptional()
  isbn?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;
}

export class BookResponseDTO {
  id!: string;
  title!: string;
  author!: string;
  description?: string;
  price!: number;
  isbn!: string;
  stock!: number;
  createdAt!: Date;
  updatedAt!: Date;
} 