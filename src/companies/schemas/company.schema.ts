import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {
    @Prop()
    name: string;
    @Prop()
    address: string;
    @Prop()
    description: string;
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

export const CompanySchema = SchemaFactory.createForClass(Company);