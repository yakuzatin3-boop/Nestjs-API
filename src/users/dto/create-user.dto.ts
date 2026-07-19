import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  // Required only for email/password registration
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  // Google OAuth
  @IsOptional()
  @IsString()
  googleId?: string;

  // Facebook OAuth
  @IsOptional()
  @IsString()
  facebookId?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  emailVerified?: boolean;

  @IsOptional()
  isActive?: boolean;
}