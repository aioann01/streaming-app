import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ErrorFilter implements ExceptionFilter {
    private readonly logger = new Logger(ErrorFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        this.logger.error(
            'Error caught: ' +
            (exception instanceof Error ? exception.message : exception),
        );

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse();

            return response.status(status).json({
                statusCode: status,
                message: res,
            });
        }

        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: 500,
            message: 'Internal server error',
        });
    }
}