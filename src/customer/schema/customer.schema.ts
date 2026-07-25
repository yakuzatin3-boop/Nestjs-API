import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ _id: false })
export class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop()
  state?: string;

  @Prop()
  postalCode?: string;

  @Prop({ required: true })
  country: string;

  @Prop({ default: false })
  isDefault: boolean;
}

const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ timestamps: true })
export class Customer {
  // Relation to the User account
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop()
  phoneNumber?: string;

  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];

  @Prop({ default: 0 })
  totalOrders: number;

  @Prop({ default: 0 })
  totalSpent: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  notes?: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
