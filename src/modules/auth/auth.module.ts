import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { User } from "./entity/User.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        Logger,
    ],
    imports: [
        ConfigModule,

        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
        }),

        TypeOrmModule.forFeature([User]),
    ],
    exports: [
        AuthService,
        JwtModule,
    ],
})
export class AuthModule {}