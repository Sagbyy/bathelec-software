import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      logLevels: ['error', 'warn', 'log', 'verbose', 'debug'],
      prefix: 'Bathelec API',
    }),
  });

  app.useBodyParser('json', { limit: '1mb' });

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
bootstrap();
