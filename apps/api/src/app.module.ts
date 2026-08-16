import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { DigimonModule } from './digimon/digimon.module';
import { EvolutionModule } from './evolution/evolution.module';
import { AuthModule } from './auth/auth.module';
import { SyncModule } from './sync/sync.module';

@Module({ imports: [PrismaModule, DigimonModule, EvolutionModule, AuthModule, SyncModule] })
export class AppModule {}
