import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseInterceptors, Version } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/decorator/user.decorator';
import { IUser } from 'src/users/users.interface';
import { userInfo } from 'os';
import aqp from 'api-query-params';
import { TransformInterceptor } from 'src/transform.interceptor';
import { Message } from 'src/decorator/message.decorator';

@Controller('companies')

export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }
  @Message('Create Company success')
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  @Message("fetch Company success")
  findAll(
    @Query("page") currentPage: number,
    @Query("limit") limit: number,
    @Req() req) {


    return this.companiesService.findAll(limit, currentPage, req.query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
