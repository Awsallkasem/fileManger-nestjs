import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/global-exception.filter';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:8081',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));


  
  const app1 = await NestFactory.create<NestExpressApplication>(AppModule);

  app1.enableCors({
    origin: 'http://localhost:8081',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  

  app.useGlobalFilters(new HttpExceptionFilter());
  app1.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
  await app1.listen(3001);
}
bootstrap();
