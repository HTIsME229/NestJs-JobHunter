import { IsEmail, IsNotEmpty } from 'class-validator';
import { MESSAGES } from "@nestjs/cli/lib/ui";

export class CreateCompanyDto {


    @IsNotEmpty({ message: "Name khong duoc de trong" })
    name: string;
    @IsNotEmpty({ message: "address khong duoc de trong" })
    address: string;
    @IsNotEmpty({ message: "description khong duoc de trong" })
    description: string;

}


