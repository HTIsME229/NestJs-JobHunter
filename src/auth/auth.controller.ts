import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './Passport/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from '../decorator/public';
import { Message } from 'src/decorator/message.decorator';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
@Controller("auth")
export class AuThController {
    constructor(
        private readonly authService: AuthService
    ) { }
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async handleLogin(@Request() req) {

        return this.authService.login(req.user._doc)
    }
    @Post("register")
    @Public()
    @Message("Register a new user")
    Register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto)
    }
}
