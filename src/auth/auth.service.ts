import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/decorator/user.decorator';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import bcrypt = require('bcryptjs');
@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
        private readonly jwtService: JwtService,

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
    async login(user: IUser) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
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
    register(registerUserDto: RegisterUserDto) {
        const hashPassword: string = this.hashPassword(registerUserDto.password);
        registerUserDto.password = hashPassword;
        registerUserDto.role = "USER"
        return this.usersService.register(registerUserDto)

    }
}

