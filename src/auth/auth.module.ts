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

@Module({

    imports: [UsersModule, PassportModule, JwtModule.registerAsync({
        useFactory: (config: ConfigService) => {
            return {
                secret: config.get<string>('JWT_SECRET_KEY'),
                signOptions: {
                    expiresIn: config.get<string | number>('JWT_EXPIRATION_TIME'),
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
