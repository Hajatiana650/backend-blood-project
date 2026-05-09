import { Module } from '@nestjs/common';
import { BloodGroupController } from './blood-group.controller';
import { BloodGroupService } from './blood-group.service';
import { PrismaService } from 'src/prisma.service';

@Module({
	controllers: [BloodGroupController],
	providers: [BloodGroupService, PrismaService],
	exports: [BloodGroupService],
})
export class BloodGroupModule {}
