import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../enums/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  firstName: string;

  @Prop({
    required: true,
    trim: true,
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  //  CRITICAL CHANGE: Remove "required: true" because OAuth users don't have local passwords
  @Prop({
    required: false, 
  })
  password?: string;

  //  ADDED FOR GOOGLE AUTH
  @Prop({
    unique: true,
    sparse: true, // CRITICAL: Allows multiple users to have 'null/undefined' googleIds
  })
  googleId?: string;

  // ADDED FOR FACEBOOK AUTH
  @Prop({
    unique: true,
    sparse: true, // CRITICAL: Allows multiple users to have 'null/undefined' facebookIds
  })
  facebookId?: string;

  @Prop({
    default: '',
  })
  phone: string;

  @Prop({
    default: '',
  })
  profileImage: string;

  @Prop({
    default: '',
  })
  address: string;

  @Prop({
    default: '',
  })
  city: string;

  @Prop({
    default: '',
  })
  country: string;

  @Prop({
    default: '',
  })
  zipCode: string;

  @Prop({
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    default: false,
  })
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);