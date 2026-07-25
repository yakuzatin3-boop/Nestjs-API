import { IsDateString, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreatePurchaseDto { @IsString() reference: string; @IsMongoId() supplier: string; @IsNumber() total: number; @IsOptional() @IsString() status?: string; @IsOptional() @IsDateString() expectedDate?: string; }
