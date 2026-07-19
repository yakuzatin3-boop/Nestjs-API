import { IsNotEmpty, IsNumber, IsString, Min, IsOptional, IsMongoId } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsMongoId()
  product: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  selectedColor?: string;

  @IsOptional()
  @IsNumber()
  selectedSize?: number;
}