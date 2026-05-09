import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CrudService } from 'src/services/crud-service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';

@Injectable()
export class AnalysisService extends CrudService<
	PrismaService['analysis'],
	CreateAnalysisDto,
	Prisma.AnalysisUncheckedUpdateInput,
	Prisma.AnalysisWhereUniqueInput
> {
	constructor(private readonly prisma: PrismaService) {
		super(prisma.analysis, {
			donor: true,
		}, {
			analysis_date: 'desc',
		});
	}

	async findAll() {
		return super.findAll();
	}

	async findOne(id_analysis: number) {
		return super.findBySpecificColumn({ id_analysis });
	}

	async create(data: CreateAnalysisDto) {
		const donor = await this.prisma.donor.findUnique({
			where: { id_donor: data.id_donor },
		});

		if (!donor) {
			throw new NotFoundException('Donor not found');
		}

		return super.create({
			...data,
			analysis_date: data.analysis_date
				? new Date(data.analysis_date)
				: new Date(),
		});
	}
}
