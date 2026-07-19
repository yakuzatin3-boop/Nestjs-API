import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: String })
  selectedColor?: string;

  @Prop({ type: Number })
  selectedSize?: number;

  @Prop({ type: Number, required: true })
  priceAtPurchase: number; //Dynamic snap: logs product price at the exact moment of sale
}

@Schema({ timestamps: true, collection: 'orders' })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [SchemaFactory.createForClass(OrderItem)], required: true })
  items: OrderItem[];

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({ type: String, enum: ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED'], default: 'PENDING' })
  status: string;

  @Prop({ type: String })
  paymentMethod?: string; // e.g., 'KHQR'
}

export const OrderSchema = SchemaFactory.createForClass(Order);