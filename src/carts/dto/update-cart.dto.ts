import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class UpdateCartDto {
  @IsMongoId()
  productId: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;
}