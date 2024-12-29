import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, RegisterUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends OmitType(RegisterUserDto, ['password'] as const) {


}

export class UserResponse {
    email: string;
    name: string;
    gender: string;
    company: {

        _id: string;
        _email: string

    };

    role: string;

    age: number;

    address: string;

    refreshToken: string;


    createdAt: Date;

    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date;

    deletedBy:
        {
            _id: string;
            _email: string
        };

    updatedBy:
        {
            _id: string;
            _email: string
        };
    createdBy:
        {
            _id: string;
            _email: string
        };


}