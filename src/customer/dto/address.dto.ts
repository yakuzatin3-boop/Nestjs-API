import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}