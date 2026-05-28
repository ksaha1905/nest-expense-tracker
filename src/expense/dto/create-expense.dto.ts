import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNumber()
  @Type(() => Number)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsDateString()
  @IsOptional()
  date?: string;
}