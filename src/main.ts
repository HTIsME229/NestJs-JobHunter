import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from "node:process";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { TransformInterceptor } from './transform.interceptor';
var cookieParser = require('cookie-parser')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector))
  app.enableCors({
    origin: true,
    credentials: true
  })
  app.setGlobalPrefix("api")
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
  });
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();
