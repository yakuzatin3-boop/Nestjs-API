import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
    timestamps:true,
})

export class Category{
    @Prop({
        required:true,
        unique:true,
        trim: true
    })
    name:string;

    @Prop({
        required: true,
        unique:true,
        lowercase:true,
        trim:true,
    })
    slug:string;

    @Prop({
        default:'',
    })
    description:string;

    @Prop({
        default:'',
    })
    image:string;

    @Prop({
        default:true,
    })
    isActive:boolean;

    @Prop({ type: Types.ObjectId, ref: 'Brand', required: false })
    brand?: Types.ObjectId;
}
export const CategorySchema = SchemaFactory.createForClass(Category);