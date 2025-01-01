import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './Passport/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from '../decorator/public';
import { Message } from 'src/decorator/message.decorator';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { User } from 'src/decorator/user.decorator';
import { IUser } from 'src/users/users.interface';
@Controller("auth")
export class AuThController {
    constructor(
        private readonly authService: AuthService
    ) { }
    @Public()
    @UseGuards(LocalAuthGuard)
    @Message("User Login")
    @Post('/login')
    async handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {

        return this.authService.login(req.user._doc, response)
    }
    @Post("register")
    @Public()
    @Message("Register a new user")
    Register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto)
    }
    @Get("account")
    @Message("get user information")
    getAccount(@User() user: IUser) {
        return {
            user
        }
    }
    @Get("refresh")
    async getRefeshToken(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = req.cookies['refresh_token']; // Lấy giá trị cookie


        return await this.authService.getRefreshToken(refreshToken, response);

    }
    @Get("logout")
    @Message("Logout Success ")
    async handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {

        return await this.authService.logout(user, response);
    }


}
