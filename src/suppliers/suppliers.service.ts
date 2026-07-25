import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { Supplier, SupplierDocument } from './schemas/supplier.schema';
@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Supplier.name) private readonly model: Model<SupplierDocument>,
  ) {}
  create(data: CreateSupplierDto) {
    return new this.model(data).save();
  }
  findAll() {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }
  async update(id: string, data: Partial<CreateSupplierDto>) {
    const item = await this.model.findByIdAndUpdate(id, data, { new: true });
    if (!item) throw new NotFoundException('Supplier not found');
    return item;
  }
  async remove(id: string) {
    const item = await this.model.findByIdAndDelete(id);
    if (!item) throw new NotFoundException('Supplier not found');
    return item;
  }
}
