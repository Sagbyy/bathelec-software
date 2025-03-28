import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// Create express server
const server = express();

// For local development
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      logLevels: ['error', 'warn', 'log', 'verbose', 'debug'],
      prefix: 'Bathelec API',
    }),
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Bathelec API')
    .setDescription('The Bathelec API description')
    .setVersion('1.0')
    .addTag('derivations')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://bathelec-software-web.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}

// For serverless environments (Vercel)
export async function createNestApp() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: new ConsoleLogger({
      logLevels: ['error', 'warn', 'log', 'verbose', 'debug'],
      prefix: 'Bathelec API',
    }),
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Bathelec API')
    .setDescription('The Bathelec API description')
    .setVersion('1.0')
    .addTag('derivations')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://bathelec-software-web.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.init();
  return app;
}

// Create the handler function
export const handler = async (req: any, res: any) => {
  const app = await createNestApp();
  const expressInstance = app.getHttpAdapter().getInstance();
  return expressInstance(req, res);
};

// Add a default export for Vercel
export default async (req: any, res: any) => {
  return handler(req, res);
};

// Only call bootstrap in local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}
