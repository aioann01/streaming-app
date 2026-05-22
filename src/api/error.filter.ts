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

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const res = exception.getResponse();

            message =
                typeof res === 'string'
                    ? res
                    : Array.isArray((res as any).message)
                        ? (res as any).message.join(', ')
                        : (res as any).message;

            this.logger.error(
                `HTTP ${status} Error: ${message}`,
            );

            return response.status(status).json({
                statusCode: status,
                message,
            });
        }

        this.logger.error(
            `Unhandled Error: ${
                exception instanceof Error
                    ? exception.message
                    : exception
            }`,
            exception instanceof Error
                ? exception.stack
                : undefined,
        );

        return response.status(status).json({
            statusCode: status,
            message,
        });
    }
}