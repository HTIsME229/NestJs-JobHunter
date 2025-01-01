import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { User } from 'src/decorator/user.decorator';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) { }
  async create(createCompanyDto: CreateCompanyDto, user: IUser) {

    return await this.companyModel.create({ ...createCompanyDto, createdBy: { _email: user.email, _id: user._id } });
  }

  async findAll(limit: number, currentPage: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize
    let defaultLimit = +limit ? +limit : 10;
    const skip = (currentPage - 1) * defaultLimit
    console.log(filter)
    const listCompany: Company[] = await this.companyModel.find(filter)
      .limit(defaultLimit)
      .skip(skip)
      //@ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .exec()

    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result: listCompany

    }
  }


  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModel.updateOne({ _id: id }, { ...updateCompanyDto, updatedBy: { _email: user.email, _id: user._id } });

  }

  async remove(id: string, user: IUser) {

    await this.companyModel.updateOne({ _id: id }, { deletedBy: { _email: user.email, _id: user._id } });
    return this.companyModel.softDelete({ _id: id });
  }
}
