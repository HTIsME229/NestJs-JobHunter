import { HttpException, HttpStatus, Injectable, Res } from "@nestjs/common";
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UserResponse } from './dto/update-user.dto';
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import bcrypt = require('bcryptjs');
import { response } from "express";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from "./users.interface";
import aqp from "api-query-params";
import { omit } from 'lodash';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }
  hashPassword = (password: string): string => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash
  }
  async create(createUserDto: CreateUserDto) {
    const hashPassword: string = this.hashPassword(createUserDto.password);
    const checkEmail = this.userModel.findOne({ email: createUserDto.email });
    if (checkEmail) {
      throw new HttpException('Email is exits', HttpStatus.BAD_REQUEST)
    }
    createUserDto.password = hashPassword;
    createUserDto.role = "USER"
    const user: any = await this.userModel.create(createUserDto)
    return {
      _id: user._id,
      createdAt: user.createdAt
    }
  }
  async register(registerUserDto: RegisterUserDto) {
    const checkEmail = this.userModel.findOne({ email: registerUserDto.email });
    if (checkEmail) {
      throw new HttpException('Email is exits', HttpStatus.BAD_REQUEST)
    }
    const user: any = await this.userModel.create(registerUserDto)
    return {
      _id: user._id,
      createdAt: user.createdAt
    }
  }


  async findAll(limit: number, currentPage: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.page;
    delete filter.limit
    let defaultLimit = +limit ? +limit : 10;
    const skip = (currentPage - 1) * defaultLimit
    console.log(filter)
    const listUser: any = await this.userModel.find(filter).select("-password")
      .limit(defaultLimit)
      .skip(skip)
      //@ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .exec()

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result: listUser

    }
  }


  async findOne(id: string) {
    try {
      const user: User = await this.userModel.findById(id).select("-password");
      return user
    } catch (err) {
      return null;
    }
  }
  async findByUserName(username: string) {
    try {
      const user: User = await this.userModel.findOne({ email: username });
      return user
    } catch (err) {
      return null;
    }

  }
  checkUserPassword(password: string, hashPassword: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  update(id: string, updateUserDto: UpdateUserDto, currentUser: IUser) {
    return this.userModel.updateOne({ _id: id }, { ...updateUserDto, updatedBy: { _id: currentUser._id, email: currentUser.email } });
  }

  remove(id: string) {
    return this.userModel.softDelete({ _id: id });
  }
}
