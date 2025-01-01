import { BadRequestException, Injectable, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/decorator/user.decorator';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import bcrypt = require('bcryptjs');
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms = require('ms');
@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    hashPassword = (password: string): string => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        return hash
    }
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByUserName(username);
        if (user && this.usersService.checkUserPassword(pass, user?.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        const refreshToken = this.createRefreshToken({
            sub: "refresh token",
            iss: "from server",
        })
        await this.usersService.updateRefreshToken(user._id, refreshToken)
        response.cookie('refresh_token', refreshToken
            , { httpOnly: true, maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')) })
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role
            }

        };
    }
    createRefreshToken = (payload) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET_KEY"),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')) / 1000,
        });
        return refreshToken
    }
    createAccessToken = (payload) => {
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET_KEY"),
            expiresIn: ms(this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')) / 1000,
        });
        return accessToken
    }

    register(registerUserDto: RegisterUserDto) {
        const hashPassword: string = this.hashPassword(registerUserDto.password);
        registerUserDto.password = hashPassword;
        registerUserDto.role = "USER"
        return this.usersService.register(registerUserDto)

    }
    async getRefreshToken(token: string, response: Response) {


        try {
            this.jwtService.verify(token, { secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET_KEY") })
            const currentUser: any = await this.usersService.findByRefreshToken(token);
            if (currentUser) {
                const refreshToken = this.createRefreshToken({
                    sub: "refresh token",
                    iss: "from server",
                })
                await this.usersService.updateRefreshToken(currentUser._id, refreshToken)
                response.cookie('refresh_token', refreshToken
                    , { httpOnly: true, maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')) })
                const { _id, name, email, role } = currentUser;
                const accessToken: string = this.createAccessToken({
                    _id, name, email, role
                })
                return {
                    access_token: accessToken,
                    user: {
                        _id, name, email, role
                    }

                }
            }
            throw new BadRequestException("User khong hop le")
        }


        catch (err) {
            throw new BadRequestException("Token khong hop le,Vui long login")
        }
    }
    async logout(user: IUser, response: Response) {
        const currentUser: any = await this.usersService.findByUserName(user.email)
        if (currentUser) {
            await this.usersService.updateRefreshTokenLogout(currentUser);
            response.clearCookie("refresh_token")
        }
    }


}

