import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import { MESSAGES } from "@nestjs/cli/lib/ui";
import mongoose from 'mongoose';
import { Type } from 'class-transformer';

export class RegisterUserDto {
  @IsEmail({}, {
    message: 'email phai dung dinh dang'
  })

  @IsNotEmpty(
    {
      message: 'email phai dung dinh dang'
    }
  )

  email: string;
  @IsNotEmpty()
  password: string
  @IsNotEmpty()
  name: string;
  address: string;
  age: number;
  gender: string;
  role: string;

}
class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  name: string

}
export class CreateUserDto extends RegisterUserDto {
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: {

    _id: mongoose.Schema.Types.ObjectId;
    name: string

  };
}
