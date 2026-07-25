import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; import { Document, Types } from 'mongoose';
export type PurchaseDocument = Purchase & Document;
@Schema({ timestamps: true }) export class Purchase { @Prop({ required: true }) reference: string; @Prop({ type: Types.ObjectId, ref: 'Supplier', required: true }) supplier: Types.ObjectId; @Prop({ required: true, min: 0 }) total: number; @Prop({ default: 'PENDING', enum: ['PENDING', 'RECEIVED', 'CANCELLED'] }) status: string; @Prop() expectedDate?: Date; }
export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
