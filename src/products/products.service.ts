import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Product, ProductDocument } from './schemas/product.schema';

import { CreateProductDto } from './dto/create-product.dto';

import { UpdateProductDto } from './dto/update-product.dto';

import { QueryProductDto } from './dto/query-product.dto';



@Injectable()
export class ProductsService {


constructor(

@InjectModel(Product.name)

private productModel:
Model<ProductDocument>

){}




async create(
createProductDto:CreateProductDto
){


const product =
new this.productModel(createProductDto);


return product.save();


}




async findAll(
query:QueryProductDto
){


const {
search,
category,
brand
}=query;



let filter:any={};



if(search){

filter.name={
$regex:search,
$options:"i"
}

}



if(category){

filter.category=category;

}



if(brand){

filter.brand=brand;

}



return this.productModel.find(filter);


}





async findOne(id:string){


return this.productModel.find()
.populate("brand")
.populate("category");

}




async update(
id:string,
updateProductDto:UpdateProductDto
){


return this.productModel.findByIdAndUpdate(

id,
updateProductDto,

{
new:true
}

);


}





async remove(id:string){


return this.productModel.findByIdAndDelete(id);


}


}