import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
    @IsNotEmpty({ message: "Name khong duoc de trong" })
    name: string;
    @IsNotEmpty({ message: "address khong duoc de trong" })
    address: string;
    @IsNotEmpty({ message: "description khong duoc de trong" })
    description: string;
}
