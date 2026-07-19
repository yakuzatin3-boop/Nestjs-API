import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {Brand} from './schemas/brand.schema';
import {CreateBrandDto} from './dto/create-brand.dto';
import { IBrand } from './interfaces/brand.interface';

@Injectable()
export class BrandsService {

  
constructor(

@InjectModel(Brand.name)
private brandModel:Model<Brand>

){}


async create(createBrandDto:CreateBrandDto){

    const brand =
    new this.brandModel(createBrandDto);

    return brand.save();

}




async findAll(){

return this.brandModel.find();

}




async findOne(id:string){

return this.brandModel.findById(id);

}




async remove(id:string){

return this.brandModel.findByIdAndDelete(id);

}


}