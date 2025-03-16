import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { DerivationsModule } from './derivations/derivations.module';
import { ConfigModule } from '@nestjs/config';
import { CompletedDerivationModule } from './completed-derivation/completed-derivation.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_MONGO_URL),
    AuthModule,
    UsersModule,
    DerivationsModule,
    CompletedDerivationModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
