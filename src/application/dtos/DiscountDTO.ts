import { IsString, IsNumber, IsDate, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDiscountDTO {
  @IsString()
  bookId!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentage!: number;

  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @IsDate()
  @Type(() => Date)
  endDate!: Date;
}

export class UpdateDiscountDTO {
  @IsString()
  @IsOptional()
  bookId?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  percentage?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;
}

export class DiscountResponseDTO {
  id!: string;
  bookId!: string;
  percentage!: number;
  startDate!: Date;
  endDate!: Date;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
} 