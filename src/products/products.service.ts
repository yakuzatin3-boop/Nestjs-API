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
    private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const price = createProductDto.price;
    const value = createProductDto.discountValue || 0;
    const salePrice =
      createProductDto.discountType === 'percentage'
        ? price * Math.max(0, 1 - value / 100)
        : createProductDto.discountType === 'fixed'
          ? Math.max(0, price - value)
          : price;
    const product = new this.productModel({ ...createProductDto, salePrice });

    return product.save();
  }

  async findAll(query: QueryProductDto) {
  const { search, category, brand } = query;

  const filter: any = {};

  if (search) {
    filter.name = {
      $regex: search,
      $options: 'i',
    };
  }

  if (category) {
    filter.category = category;
  }

  if (brand) {
    filter.brand = brand;
  }

  return this.productModel
    .find(filter)
    .populate('category', 'name')
    .populate('brand', 'name');
}

  async findOne(id: string) {
    return this.productModel
      .findById(id)
      .populate('brand', 'name')
      .populate('category', 'name');
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existing = await this.productModel.findById(id);
    if (!existing) return null;
    const price = updateProductDto.price ?? existing.price;
    const type = updateProductDto.discountType ?? existing.discountType;
    const value = updateProductDto.discountValue ?? existing.discountValue ?? 0;
    const salePrice =
      type === 'percentage'
        ? price * Math.max(0, 1 - value / 100)
        : type === 'fixed'
          ? Math.max(0, price - value)
          : price;
    return this.productModel.findByIdAndUpdate(
      id,
      { ...updateProductDto, salePrice },
      { new: true },
    );
  }

  async remove(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
