import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SupplierDocument = Supplier & Document;
@Schema({ timestamps: true })
export class Supplier {
  @Prop({ required: true, trim: true }) name: string;
  @Prop() email?: string;
  @Prop() phone?: string;
  @Prop() address?: string;
  @Prop({ default: true }) isActive: boolean;
}
export const SupplierSchema = SchemaFactory.createForClass(Supplier);
