import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './core/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './core/config/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const SITE_URL = configService.getOrThrow<string>(
    'BACK_SITE_URL',
    'http://localhost:3000',
  );
  console.log(SITE_URL);
  const PORT = 4000;

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Fesmu API',
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(PORT);
}
bootstrap();
