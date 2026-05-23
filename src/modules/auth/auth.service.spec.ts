import { Test, TestingModule } from "@nestjs/testing";
import {
    ConflictException,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

import { AuthService } from "./auth.service";
import { User } from "./entity/User.entity";
import { UserRole } from "./model/UserRoles";

describe("Auth Service", () => {
    let service: AuthService;
    let userRepository: Repository<User>;
    let jwtService: JwtService;
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                AuthService,
                Logger,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOneBy: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                    },
                },
            ],
        }).compile();

        userRepository = module.get<Repository<User>>(
            getRepositoryToken(User),
        );

        jwtService = module.get<JwtService>(JwtService);

        service = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("register()", () => {
        it("should successfully register a user", async () => {
            const dto = {
                email: "test@test.com",
                password: "password123",
                role: UserRole.ADMIN,
            };

            const createdUser = {
                id: 1,
                email: dto.email,
                password: "hashed-password",
                role: dto.role,
            };

            jest
                .spyOn(userRepository, "findOneBy")
                .mockResolvedValue(null);

            jest
                .spyOn(userRepository, "create")
                .mockReturnValue(createdUser as User);

            jest
                .spyOn(userRepository, "save")
                .mockResolvedValue(createdUser as User);

            const response = await service.register(dto);

            expect(userRepository.findOneBy).toBeCalledWith({
                email: dto.email,
            });

            expect(userRepository.create).toBeCalled();

            expect(userRepository.save).toBeCalled();

            expect(response).toEqual({
                id: 1,
                email: dto.email,
                role: dto.role,
            });
        });

        it("should throw ConflictException if user already exists", async () => {
            const dto = {
                email: "test@test.com",
                password: "password123",
                role: UserRole.ADMIN,
            };

            jest.spyOn(userRepository, "findOneBy").mockResolvedValue({} as User);

            try {
                await service.register(dto);
                expect(true).toBeFalsy();
            }catch (e) {
                expect(e).toBeInstanceOf(ConflictException);
                expect(e.message).toBe('User already exists');
            }
        });
    });

    describe("login()", () => {
        it("should successfully login user", async () => {
            const dto = {
                email: "test@test.com",
                password: "password123",
            };

            const user = {
                id: 1,
                email: dto.email,
                password: await bcrypt.hash(dto.password, 10),
                role: UserRole.ADMIN,
            };

            jest
                .spyOn(userRepository, "findOneBy")
                .mockResolvedValue(user as User);

            jest
                .spyOn(jwtService, "signAsync")
                .mockResolvedValue("jwt-token");

            const response = await service.login(dto);

            expect(userRepository.findOneBy).toBeCalledWith({
                email: dto.email,
            });

            expect(jwtService.signAsync).toBeCalledWith({
                sub: user.id,
                email: user.email,
                role: user.role,
            });

            expect(response).toEqual({
                access_token: "jwt-token",
            });

        });

        it("should throw UnauthorizedException when user does not exist", async () => {
            const dto = {
                email: "test@test.com",
                password: "password123",
            };

            jest
                .spyOn(userRepository, "findOneBy")
                .mockResolvedValue(null);

            try {
                await service.login(dto);
                expect(true).toBeFalsy();
            }catch (e) {
                expect(e).toBeInstanceOf(UnauthorizedException);
                expect(e.message).toBe('Invalid credentials');
            }
            expect(userRepository.findOneBy).toBeCalledWith({
                email: dto.email,
            })

        });

        it("should throw UnauthorizedException when password is invalid", async () => {
            const dto = {
                email: "test@test.com",
                password: "wrong-password",
            };

            const user = {
                id: 1,
                email: dto.email,
                password: await bcrypt.hash("correct-password", 10),
                role: UserRole.ADMIN,
            };

            jest
                .spyOn(userRepository, "findOneBy")
                .mockResolvedValue(user as User);

            try {
                await service.login(dto);
                expect(true).toBeFalsy();
            }catch (e) {
                expect(e).toBeInstanceOf(UnauthorizedException);
                expect(e.message).toBe('Invalid credentials');
            }
        });
    });
});