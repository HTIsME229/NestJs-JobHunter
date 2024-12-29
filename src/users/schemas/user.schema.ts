import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;
  @Prop()
  gender: string;
  @Prop({ type: {} })
  company: {

    _id: string;
    _email: string

  };
  @Prop()
  role: string;
  @Prop()
  age: number;
  @Prop()
  address: string;
  @Prop()
  refreshToken: string;

  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  isDeleted: boolean;
  @Prop()
  deletedAt: Date;
  @Prop({ type: {} })
  deletedBy:
    {
      _id: string;
      _email: string
    };
  @Prop({ type: {} })
  updatedBy:
    {
      _id: string;
      _email: string
    };
  @Prop({ type: {} })
  createdBy:
    {
      _id: string;
      _email: string
    };


}

export const UserSchema = SchemaFactory.createForClass(User);