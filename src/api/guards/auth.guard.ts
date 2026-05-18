import { JwtService } from '@nestjs/jwt';
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
    Logger,
    Injectable
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger: Logger = new Logger(AuthGuard.name);

    constructor(private jwtService: JwtService) {}
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.get('authorization')
        if(!authorizationHeader){
            this.logger.error('Authorization header not provided');
            throw new UnauthorizedException('Authorization header not provided');
        }
        const {type, token} = authorizationHeader.split(' ');
        if (!token) {
            this.logger.error('Invalid Authorization header');
            throw new UnauthorizedException('Invalid Authorization header');
        }
        try {
            const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            request.user = decoded;
            return true
        } catch (err) {
            this.logger.error('Could not verify token');
            throw new ForbiddenException('Could not verify token');
        }
    }
}