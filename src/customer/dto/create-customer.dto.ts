import {
  IsMongoId,
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';

export class CreateCustomerDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  @IsOptional()
  addresses?: AddressDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}