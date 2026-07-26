import {
 IsNotEmpty,
 IsMongoId,
 IsString,
 IsEmail,
 IsOptional
} from 'class-validator';


export class CreateCustomerDto {


 @IsNotEmpty()
 @IsMongoId()
 userId:string;


 @IsNotEmpty()
 @IsString()
 firstName:string;


 @IsNotEmpty()
 @IsString()
 lastName:string;


 @IsNotEmpty()
 @IsEmail()
 email:string;


 @IsOptional()
 @IsString()
 phoneNumber?:string;

}