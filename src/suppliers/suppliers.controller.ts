import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SuppliersService } from './suppliers.service';
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly service: SuppliersService) {}
  @Get() findAll() {
    return this.service.findAll();
  }
  @Post() create(@Body() data: CreateSupplierDto) {
    return this.service.create(data);
  }
  @Patch(':id') update(
    @Param('id') id: string,
    @Body() data: Partial<CreateSupplierDto>,
  ) {
    return this.service.update(id, data);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
