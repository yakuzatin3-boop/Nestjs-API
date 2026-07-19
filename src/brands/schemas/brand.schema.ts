import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({
    timestamps:true
})
export class Brand extends Document {


    @Prop({
        required:true,
        unique:true,
        trim:true
    })
    name:string;



    @Prop()
    logo?:string;



    @Prop()
    description?:string;



    @Prop({
        default:true
    })
    active:boolean;


}


export const BrandSchema =
SchemaFactory.createForClass(Brand);