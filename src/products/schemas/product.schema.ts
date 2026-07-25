import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ProductStatus } from "../enums/product-status.enum";

// Define the nested schema layout for your new specifications
@Schema({ _id: false })
export class ProductSpecification {
  @Prop({ type: Types.ObjectId, ref: 'Brand', required: false })
  brand?: Types.ObjectId;

  @Prop({ type: String })
  model?: string;

  @Prop({ type: String })
  gender?: string;

  @Prop({ type: String })
  color?: string;

  @Prop({ type: [Number] })
  size?: number[];

  @Prop({ type: String })
  material?: string;

  @Prop({ type: String })
  soleMaterial?: string;

  @Prop({ type: String })
  closure?: string;

  @Prop({ type: String })
  weight?: string;

  @Prop({ type: String })
  origin?: string;
}

const ProductSpecificationSchema = SchemaFactory.createForClass(ProductSpecification);

export type ProductDocument = Product & Document;

@Schema({
  timestamps: true
})
export class Product {

  @Prop({
    required: true,
    trim: true
  })
  name: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true
  })
  price: number;

  @Prop({
    required: true,
    default: 0,
  })
  originalprice: number;

  @Prop({ enum: ['none', 'percentage', 'fixed'], default: 'none' })
  discountType: 'none' | 'percentage' | 'fixed';

  @Prop({ default: 0, min: 0 })
  discountValue: number;

  @Prop({ default: 0, min: 0 })
  salePrice: number;

  // Swapped out old electronic properties for the clean subdocument layout
  @Prop({ type: ProductSpecificationSchema })
  specifications: ProductSpecification;

  @Prop({
    required: true,
    default: 0
  })
  stock: number;

  @Prop({
    type: [String],
    default: []
  })
  images: string[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Brand',
    required: true,
  })
  brand: Types.ObjectId;

  @Prop({
    type: String,
    enum: ProductStatus,
    default: ProductStatus.ACTIVE
  })
  status: ProductStatus;

  @Prop({
    default: false
  })
  featured: boolean;

  @Prop({
    default: false
  })
  bestSeller: boolean;

  @Prop({
    default: false
  })
  flashSale: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: false,
  })
  createdBy?: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
