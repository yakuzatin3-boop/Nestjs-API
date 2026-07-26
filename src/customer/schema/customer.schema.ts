import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;


@Schema({ timestamps:true })
export class Customer {

  @Prop({
    type: Types.ObjectId,
    ref:'User',
    required:true,
    unique:true
  })
  userId: Types.ObjectId;


  @Prop({
    required:true,
    trim:true
  })
  firstName:string;


  @Prop({
    required:true,
    trim:true
  })
  lastName:string;


  @Prop({
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  })
  email:string;


  @Prop()
  phoneNumber?:string;


  @Prop({
    default:0
  })
  totalOrders:number;


  @Prop({
    default:0
  })
  totalSpent:number;


  @Prop({
    default:true
  })
  isActive:boolean;

}


export const CustomerSchema =
SchemaFactory.createForClass(Customer);