import {ConflictException, Injectable, Logger, UnauthorizedException} from "@nestjs/common";
import {UserRegisterDto} from "./dto/UserRegister.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Streaming} from "../streaming/entity/Streaming.entity";
import {Repository} from "typeorm";
import {User} from "./entity/User.entity";
import * as bcrypt from 'bcrypt';
import {UserLoginDto} from "./dto/UserLogin.dto";
import {JwtService} from "@nestjs/jwt";
import {UserResponseDto} from "./dto/UserResponse.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly logger: Logger,
        private jwtService: JwtService
    ) {
    }

    async register(dto: UserRegisterDto): Promise<UserResponseDto> {
        const existingUser = await this.userRepository.findOneBy({
            email: dto.email,
        });

        if (existingUser) {
            this.logger.error(`User with email ${dto.email} already exists`);
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = this.userRepository.create({
            email: dto.email,
            password: hashedPassword,
            role: dto.role,
        });

        const createdUser = await this.userRepository.save(user);
        this.logger.log(`User with email ${dto.email} created`);

        const {password, ...result} = createdUser;

        return result;
    }

    async login(dto: UserLoginDto): Promise<{ access_token: string }> {
        const user = await this.userRepository.findOneBy({
            email: dto.email,
        });

        if (!user) {
            this.logger.error(`User with email ${dto.email} does not exists exists`);
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatch = await bcrypt.compare(
            dto.password,
            user.password,
        );

        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            access_token: token,
        };
    }
}