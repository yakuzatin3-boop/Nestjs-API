import { webcrypto } from 'node:crypto';
if (!globalThis.crypto) {
  (globalThis as any).crypto = webcrypto;
}

import 'reflect-metadata';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function createApp(): Promise<INestApplication> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing required environment variable: MONGODB_URI');
  }

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  console.log('Vercel:', process.env.VERCEL === '1');
  console.log('MONGODB_URI set:', !!process.env.MONGODB_URI);
  console.log('JWT_SECRET set:', !!process.env.JWT_SECRET);
  console.log('CORS_ORIGINS:', process.env.CORS_ORIGINS || '(default)');

  const rawOrigins = process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001';
  const allowedOrigins = rawOrigins.split(',').map((s) => s.trim()).filter(Boolean);

  console.log('Allowed CORS origins:', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use((req: any, res: any, next: any) => {
    const origin = req.headers.origin as string | undefined;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }
    return next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  return app;
}

export async function bootstrap(): Promise<void> {
  const app = await createApp();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8050;

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection at:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    setTimeout(() => process.exit(1), 100);
  });

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on: http://0.0.0.0:${port}`);
  console.log(`📦 API: http://0.0.0.0:${port}/api`);
}

if (process.env.VERCEL !== '1') {
  bootstrap();
}