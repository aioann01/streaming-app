import { NestFactory } from '@nestjs/core';
import { appConfiguration } from './appconfig';
import {ApplicationModule} from "./modules/app.module";

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);

  appConfiguration(app);
  app.getHttpAdapter().getInstance().set('x-powered-by', false);
  app.getHttpServer().keepAliveTimeout = 65000;
  app.getHttpServer().headersTimeout = 66000;
  app.enableShutdownHooks();
  const port = process.env.PORT || 3000;
  await app.listen(port, "0.0.0.0");
}
bootstrap();
