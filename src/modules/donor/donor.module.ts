import { Module } from '@nestjs/common';
import { DonorController } from './donor.controller';
import { DonorService } from './donor.sercice';
import { PrismaService } from 'src/prisma.service';

@Module({
	controllers: [DonorController],
	providers: [DonorService, PrismaService],
	exports: [DonorService],
})
export class DonorModule {}
