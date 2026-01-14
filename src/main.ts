import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { HttpMetaInterceptor } from './interceptors/http-meta-interceptor.service.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Globaler Prefix
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new HttpMetaInterceptor());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('SWAGGER_TITLE') || 'Todo API')
    .setDescription(
      configService.get<string>('SWAGGER_DESCRIPTION') || 'API Description',
    )
    .setVersion(configService.get<string>('SWAGGER_VERSION') || '1.0.0')
    .setContact(
      configService.get<string>('SWAGGER_AUTHOR_NAME') || 'Author undefined',
      configService.get<string>('SWAGGER_AUTHOR_URL') || '',
      configService.get<string>('SWAGGER_AUTHOR_EMAIL') || '',
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    configService.get<string>('SWAGGER_DOC_PATH') || 'docs',
    app,
    document,
  );

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
  console.log(`Swagger docs available at: http://localhost:${port}/docs`);
}
bootstrap();
