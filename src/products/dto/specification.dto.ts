import { IsOptional, IsString, IsArray,IsMongoId } from 'class-validator';

export class SpecificationDto {
  @IsMongoId()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsArray()
  size?: number[];

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  soleMaterial?: string;

  @IsOptional()
  @IsString()
  closure?: string;

  @IsOptional()
  @IsString()
  weight?: string;

  @IsOptional()
  @IsString()
  origin?: string;
}