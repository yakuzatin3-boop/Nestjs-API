// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.setGlobalPrefix('api');

//   app.enableCors();
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();
import { ValidationPipe } from '@nestjs/common'; // 🆕 Added import
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  //  ADD THIS: Enables automatic validation and type conversion for all routes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips out properties that are not defined in your DTOs
      transform: true, // Automatically transforms plain JavaScript objects into DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Essential for turning query strings into numbers
      },
    }),
  );

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
