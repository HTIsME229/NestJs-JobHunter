import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus, UseGuards, Version, Query } from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UserResponse } from './dto/update-user.dto';
import { User } from "./schemas/user.schema";
import { error } from "console";
import { JwtAuthGuard } from "src/auth/Passport/JwtAuthGuard";
import { Public } from "src/decorator/public";
import { Message } from "src/decorator/message.decorator";
import { User as UserDecorator } from 'src/decorator/user.decorator';
import { IUser } from "./users.interface";
import { plainToClass } from "class-transformer";
import { ToObjectOptions } from "mongoose";
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }



  @Get()
  @Message("fetch Company success")
  findAll(
    @Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Req() req) {


    return this.usersService.findAll(limit, currentPage, req.query);
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user: any = await this.usersService.findOne(id);

    if (user)
      return user
    else
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UserDecorator() currentUser: IUser) {
    const user: UserResponse = await this.usersService.findOne(id);
    if (!user)
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

    const userUpdate: any = await this.usersService.update(id, updateUserDto, currentUser);
    const userData = userUpdate.toObject();
    delete userData.password;
    return userData


  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

