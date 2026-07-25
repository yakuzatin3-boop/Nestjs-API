import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsIn,
  ValidateNested,
  IsMongoId
} from 'class-validator';
import { Type } from 'class-transformer';

import { ProductStatus } from '../enums/product-status.enum';
import { SpecificationDto } from './specification.dto';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  originalprice?: number;

  @IsOptional()
  @IsIn(['none', 'percentage', 'fixed'])
  discountType?: 'none' | 'percentage' | 'fixed';

  @IsOptional()
  @IsNumber()
  discountValue?: number;

  @IsNumber()
  stock: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => SpecificationDto)
  specifications?: SpecificationDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsMongoId()
  category: string;

  @IsMongoId()
  brand: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  bestSeller?: boolean;

  @IsOptional()
  @IsBoolean()
  flashSale?: boolean;
}
