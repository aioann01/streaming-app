import {INestApplication, Logger, LogLevel, ValidationPipe} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as info from "./swaggerDocumentation";
import {ErrorFilter} from "./api/error.filter";
const logger: Logger = new Logger('appconfig.ts');

export const appConfiguration = (app: INestApplication) => {
    app.useGlobalFilters(new ErrorFilter());

    const logLevel : LogLevel = (process.env.LOG_LEVEL !== undefined && process.env.LOG_LEVEL.toLowerCase() !== 'info' ? process.env.LOG_LEVEL : 'log') as LogLevel;
    app.useLogger([logLevel]);

    process.on('unhandledRejection', (reason) => {
        if (reason instanceof Error) {
            logger.error(`Unhandled Rejection due to: ${reason} \n ${reason.stack}`);
        } else {
            logger.error(`Unhandled Rejection due to: ${reason}`);
        }
    });
    app.getHttpAdapter().getInstance().set("etag", false);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    app.enableCors();
    const options = new DocumentBuilder()
        .setTitle(info.AppName)
        .setDescription(info.AppDescription)
        .setVersion(info.AppVersion)
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            'jwt',
        )
        .addServer(
            `${process.env.API_URL}/`,
        )
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("/docs", app, document);
};
