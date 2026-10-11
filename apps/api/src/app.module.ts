import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DerivationsModule } from './derivations/derivations.module';
import { ConfigModule } from '@nestjs/config';
import { CompletedDerivationModule } from './completed-derivation/completed-derivations.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteTeamsModule } from './site-teams/site-teams.module';
import { VehicleDocumentsModule } from './vehicle-documents/vehicle-documents.module';
import { OfficialDocumentsModule } from './official-documents/official-documents.module';
import { HabilitationsModule } from './habilitations/habilitations.module';
import { SpecialHabilitationsModule } from './special-habilitations/special-habilitations.module';
import { MarketModule } from './market/market.module';
import { ChantiersModule } from './chantiers/chantiers.module';
import { ChantierDocumentsModule } from './chantier-documents/chantier-documents.module';

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
    SiteTeamsModule,
    VehicleDocumentsModule,
    OfficialDocumentsModule,
    HabilitationsModule,
    SpecialHabilitationsModule,
    MarketModule,
    ChantiersModule,
    ChantierDocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
