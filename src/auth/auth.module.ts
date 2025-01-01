import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './Passport/local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './Passport/jwt.strategy';
import { AuThController } from './auth.controller';
const ms = require('ms');


@Module({

    imports: [UsersModule, PassportModule, JwtModule.registerAsync({
        useFactory: (config: ConfigService) => {
            return {
                secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
                signOptions: {
                    expiresIn: ms(config.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')) / 1000,
                },
            };
        },
        inject: [ConfigService],
        imports: [ConfigModule],
    }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [JwtModule, AuthService],
    controllers: [AuThController],
})
export class AuthModule { }
