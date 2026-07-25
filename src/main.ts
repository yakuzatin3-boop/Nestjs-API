import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix
  app.setGlobalPrefix('api');

  // CORS Configuration
  // Allow flexible origins for local development. Use CORS_ORIGINS env var
  // as a comma separated list (e.g. http://localhost:3000,http://localhost:3001)
  const rawOrigins = process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001';
  const allowedOrigins = rawOrigins.split(',').map((s) => s.trim()).filter(Boolean);

  console.log('Allowed CORS origins:', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser (server-to-server / curl) requests with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Extra middleware to ensure the CORS headers are set reliably for
  // requests coming from the frontend dev servers. This mirrors the
  // allowlist above and handles preflight responses.
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

  // Global Validation
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

  const port = process.env.PORT || 8050;

  await app.listen(port);

  console.log(`🚀 Server running on: http://localhost:${port}`);
  console.log(`📦 API: http://localhost:${port}/api`);
}

bootstrap();