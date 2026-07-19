import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number) // ⚠️ Converts query string to a real number
  @IsInt({ message: 'Page must be an integer number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1; // Default to page 1 if not provided

  @IsOptional()
  @Type(() => Number) // ⚠️ Converts query string to a real number
  @IsInt({ message: 'Limit must be an integer number' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number = 10; // Default to 10 items per page if not provided
}