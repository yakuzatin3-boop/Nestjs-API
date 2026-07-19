// in this carts schema it must have the
// relationship with the product and user 
// when the user add product to carts 
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ _id: false }) // _id: false prevents Mongoose from generating an unnecessary sub-ID for every single item
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1, default: 1 })
  quantity: number;

  @Prop({ type: String })
  selectedColor?: string;

  @Prop({ type: Number })
  selectedSize?: number;
}

// Generate the sub-schema for insertion into the parent array
export const CartItemSchema = SchemaFactory.createForClass(CartItem);

// Create the unified Hydrated Document type for NestJS Service layers
export type CartDocument = Cart & Document;

@Schema({ 
  timestamps: true, // Automatically tracks createdAt and updatedAt dates for metrics
  collection: 'carts' // Explicitly names the collection in MongoDB
})
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

// Generate the final database schema blueprint
export const CartSchema = SchemaFactory.createForClass(Cart);