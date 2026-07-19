import { IsBoolean, IsOptional, IsString, isString } from "class-validator";

export class CreateCategoryDto{
    @IsString()
    name:string;

    @IsString()
    slug:string;

    @IsOptional()
    @IsString()
    image?:string;

    @IsOptional()
    @IsString()
    description?:string

    @IsOptional()
    @IsBoolean()
    isActive?:boolean
}