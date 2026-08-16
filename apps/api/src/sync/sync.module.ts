import {Module} from '@nestjs/common';import {PrismaModule} from '../prisma/prisma.module';import {AuthModule} from '../auth/auth.module';import {SyncController} from './sync.controller';
@Module({imports:[PrismaModule,AuthModule],controllers:[SyncController]}) export class SyncModule{}
