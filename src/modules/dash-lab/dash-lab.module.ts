import { Module } from '@nestjs/common';
import { DashLabService } from './dash-lab.service';
import { DashLabController } from './dash-lab.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DashLabController],
  providers: [DashLabService, PrismaService],
})
export class DashLabModule {}
