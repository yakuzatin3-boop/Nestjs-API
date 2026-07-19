import {
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryUserDto {

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;
}