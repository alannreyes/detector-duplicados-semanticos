import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Prefijo global para API
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.get('BACKEND_PORT') || 3001;

  await app.listen(port);
  console.log(`🚀 Backend corriendo en puerto ${port}`);
}

bootstrap();