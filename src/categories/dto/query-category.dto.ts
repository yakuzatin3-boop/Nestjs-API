import { IsString, IsOptional } from "class-validator";

export class QueryCategoryDto {
    @IsOptional()
    @IsString()
    search?:string

    @IsOptional()
    page:number

    @IsOptional()
    limit?:number
}