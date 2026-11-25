import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { JSON_BODY_LIMIT_BYTES } from './common/http/json-body-limit';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      logLevels: ['error', 'warn', 'log', 'verbose', 'debug'],
      prefix: 'Bathelec API',
    }),
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useBodyParser('json', { limit: JSON_BODY_LIMIT_BYTES });

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
      'https://web-production-f7934.up.railway.app',
      'https://abrisur.up.railway.app',
      'https://web-staging-406d.up.railway.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
