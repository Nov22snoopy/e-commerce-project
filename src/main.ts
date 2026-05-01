import { otelSDK } from './core/tracing/tracing';

otelSDK.start();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';
import * as cls from 'cls-hooked';
import { error } from 'console';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';

const namespace = cls.createNamespace('sneaker-ecommerce-namespace');
Sequelize.useCLS(namespace);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor<any>(),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sneaker PIM Service API')
    .setDescription('API documentation for the Product Information Management system.')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 8080);
}

bootstrap()
  .then()
  .catch((err) => {
    otelSDK.shutdown().finally(() => error(err));
  });
