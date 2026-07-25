import { IsBoolean, IsOptional, IsString, IsMongoId } from "class-validator";

export class CreateCategoryDto{
    @IsString()
    name:string;

    @IsString()
    slug:string;

    @IsOptional()
    @IsString()
    image?:string;

    @IsOptional()
    @IsMongoId()
    brand?: string;

    @IsOptional()
    @IsString()
    description?:string

    @IsOptional()
    @IsBoolean()
    isActive?:boolean
}