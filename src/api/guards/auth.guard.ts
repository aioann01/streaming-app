import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
    Injectable,
    mixin,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInfo } from '../model/UserInfo';
import { UserRole } from '../../modules/auth/model/UserRoles';
import {HTTP_HEADERS} from "../../utils/Constants";

export const AdvGuard = (allowedRoles: UserRole[]) => {
    @Injectable()
    class AuthGuardMixin implements CanActivate {
        constructor(readonly jwtService: JwtService) {}

        canActivate(context: ExecutionContext): boolean {
            const request = context.switchToHttp().getRequest();

            const authHeader = request.headers[HTTP_HEADERS.AUTHORIZATION];
            if (!authHeader) {
                throw new UnauthorizedException('Missing Authorization header');
            }

            const parts = authHeader.split(' ');
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                throw new UnauthorizedException('Invalid Authorization format');
            }

            const token = parts[1];

            let userInfo: UserInfo;

            try {
                userInfo = this.jwtService.verify(token);
            } catch {
                throw new UnauthorizedException('Invalid or expired token');
            }

            request.userInfo = userInfo;

            if (
                allowedRoles?.length &&
                !allowedRoles.includes(userInfo.role)
            ) {
                throw new ForbiddenException('Insufficient permissions to perform this operation');
            }

            return true;
        }
    }

    return mixin(AuthGuardMixin);
};