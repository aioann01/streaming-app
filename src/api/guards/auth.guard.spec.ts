import { Test, TestingModule } from "@nestjs/testing";
import {
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AdvGuard } from "./auth.guard";
import { UserRole } from "../../modules/auth/model/UserRoles";
import { HTTP_HEADERS } from "../../utils/Constants";

describe("Auth Guard", () => {
    let jwtService: JwtService;
    let module: TestingModule;

    const mockExecutionContext = (
        authorizationHeader?: string,
    ): ExecutionContext =>
        ({
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: {
                        [HTTP_HEADERS.AUTHORIZATION]: authorizationHeader,
                    },
                }),
            }),
        }) as ExecutionContext;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                {
                    provide: JwtService,
                    useValue: {
                        verify: jest.fn(),
                    },
                },
            ],
        }).compile();

        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("canActivate()", () => {
        it("should successfully authenticate and authorize user", () => {
            const Guard = AdvGuard([UserRole.ADMIN]);

            const guard = new Guard(jwtService);

            const context = mockExecutionContext(
                "Bearer valid-token",
            );

            jest.spyOn(jwtService, "verify").mockReturnValue({
                id: 1,
                role: UserRole.ADMIN,
            });

            const response = guard.canActivate(context);

            expect(jwtService.verify).toBeCalledWith(
                "valid-token",
            );

            expect(response).toBe(true);
        });

        it("should throw UnauthorizedException when authorization header is missing", () => {
            const Guard = AdvGuard([UserRole.ADMIN]);

            const guard = new Guard(jwtService);

            const context = mockExecutionContext();

            try {
                guard.canActivate(context);
                expect(true).toBeFalsy();
            } catch (e) {
                expect(e).toBeInstanceOf(UnauthorizedException);
                expect(e.message).toBe(
                    'Missing Authorization header',
                );
            }
        });

        it("should throw UnauthorizedException when authorization format is invalid", () => {
            const Guard = AdvGuard([UserRole.ADMIN]);

            const guard = new Guard(jwtService);

            const context = mockExecutionContext(
                "invalid-token",
            );

            try {
                guard.canActivate(context);
                expect(true).toBeFalsy();
            } catch (e) {
                expect(e).toBeInstanceOf(UnauthorizedException);
                expect(e.message).toBe(
                    'Invalid Authorization format',
                );
            }
        });

        it("should throw UnauthorizedException when token is invalid", () => {
            const Guard = AdvGuard([UserRole.ADMIN]);

            const guard = new Guard(jwtService);

            const context = mockExecutionContext(
                "Bearer invalid-token",
            );

            jest.spyOn(jwtService, "verify").mockImplementation(() => {
                throw new Error();
            });

            try {
                guard.canActivate(context);
                expect(true).toBeFalsy();
            } catch (e) {
                expect(e).toBeInstanceOf(UnauthorizedException);
                expect(e.message).toBe(
                    'Invalid or expired token',
                );
            }
        });

        it("should throw ForbiddenException when user role is not allowed to perform operation", () => {
            const Guard = AdvGuard([UserRole.ADMIN]);

            const guard = new Guard(jwtService);

            const context = mockExecutionContext(
                "Bearer valid-token",
            );

            jest.spyOn(jwtService, "verify").mockReturnValue({
                id: 1,
                role: UserRole.AGENT,
            });

            try {
                guard.canActivate(context);
                expect(true).toBeFalsy();
            } catch (e) {
                expect(e).toBeInstanceOf(ForbiddenException);
                expect(e.message).toBe(
                    'Insufficient permissions to perform this operation',
                );
            }
        });
    });
});