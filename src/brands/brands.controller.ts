import {
Controller,
Get,
Post,
Body,
Param,
Delete
} from '@nestjs/common';


import {
BrandsService
} from './brands.service';


import {
CreateBrandDto
} from './dto/create-brand.dto';



@Controller('brands')
export class BrandsController {

constructor(private readonly brandService:BrandsService){}

@Post()
create(@Body() createBrandDto:CreateBrandDto){

  return this.brandService.create(createBrandDto);

}


@Get()
findAll(){

return this.brandService.findAll();

}




@Get(':id')
findOne(
@Param('id') id:string){

return this.brandService.findOne(id);
}

@Delete(':id')
remove(
@Param('id') id:string){

   return this.brandService.remove(id);

}

}