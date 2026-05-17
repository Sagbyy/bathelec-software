import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DerivationsModule } from './derivations/derivations.module';
import { ConfigModule } from '@nestjs/config';
import { CompletedDerivationModule } from './completed-derivation/completed-derivations.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersGroupsModule } from './users-groups/users-groups.module';
import { VehicleDocumentsModule } from './vehicle-documents/vehicle-documents.module';
import { OfficialDocumentsModule } from './official-documents/official-documents.module';

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
    UsersGroupsModule,
    VehicleDocumentsModule,
    OfficialDocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
