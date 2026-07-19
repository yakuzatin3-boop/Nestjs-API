import {
    IsOptional,
    IsString,
    IsNumberString
} from "class-validator";


export class QueryProductDto {


    @IsOptional()
    @IsString()
    search?:string;



    @IsOptional()
    @IsString()
    category?:string;



    @IsOptional()
    @IsString()
    brand?:string;



    @IsOptional()
    @IsNumberString()
    page?:number;



    @IsOptional()
    @IsNumberString()
    limit?:number;


}