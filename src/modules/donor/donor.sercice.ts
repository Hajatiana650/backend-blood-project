import {
	ConflictException,
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { Prisma, NotificationStatus } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';

const MIN_DONATION_DELAY_DAYS = 56;

@Injectable()
export class DonorService {
	constructor(private readonly prisma: PrismaService) {}

	private readonly donorInclude = {
		user: {
			select: {
				id_user: true,
				name: true,
				firstname: true,
				email: true,
				role: true,
				phone_number: true,
			},
		},
		bloodGroup: true,
		analyses: {
			orderBy: {
				analysis_date: 'desc' as const,
			},
		},
		donations: {
			orderBy: {
				donation_date: 'desc' as const,
			},
		},
		notifications: {
			orderBy: {
				date_notification: 'desc' as const,
			},
		},
	} satisfies Prisma.DonorInclude;

	async findAll() {
		const donors = await this.prisma.donor.findMany({
			include: this.donorInclude,
			orderBy: {
				id_donor: 'desc',
			},
		});

		return {
			statusCode: 200,
			message: 'Donors retrieved successfully',
			data: donors,
		};
	}

	async findOne(id_donor: number) {
		const donor = await this.prisma.donor.findUnique({
			where: { id_donor },
			include: this.donorInclude,
		});

		if (!donor) {
			throw new NotFoundException('Donor not found');
		}

		return {
			statusCode: 200,
			message: 'Donor retrieved successfully',
			data: donor,
		};
	}

	async create(data: CreateDonorDto) {
		await this.ensureUserExists(data.id_user);
		await this.ensureBloodGroupExists(data.id_blood);
		await this.ensureDonorNotAlreadyLinked(data.id_user, data.CIN);

		const donor = await this.prisma.donor.create({
			data: {
				...data,
				isApte: false,
			},
			include: this.donorInclude,
		});

		return {
			statusCode: 201,
			message: 'Donor created successfully',
			data: donor,
		};
	}

	async update(id_donor: number, data: UpdateDonorDto) {
		await this.findOne(id_donor);

		if (data.id_user !== undefined || data.CIN !== undefined) {
			await this.ensureDonorUpdateIsUnique(id_donor, data.id_user, data.CIN);
		}

		if (data.id_user !== undefined) {
			await this.ensureUserExists(data.id_user);
		}

		if (data.id_blood !== undefined) {
			await this.ensureBloodGroupExists(data.id_blood);
		}

		const updatedDonor = await this.prisma.donor.update({
			where: { id_donor },
			data,
			include: this.donorInclude,
		});

		return {
			statusCode: 200,
			message: 'Donor updated successfully',
			data: updatedDonor,
		};
	}

	async remove(id_donor: number) {
		await this.findOne(id_donor);

		await this.prisma.donor.delete({
			where: { id_donor },
		});

		return {
			statusCode: 200,
			message: 'Donor deleted successfully',
			data: true,
		};
	}

	async getProfile(id_donor: number) {
		return this.findOne(id_donor);
	}

	async getAnalyses(id_donor: number) {
		const donor = await this.findDonorWithActivity(id_donor);

		return {
			statusCode: 200,
			message: 'Donor analyses retrieved successfully',
			data: donor.analyses,
		};
	}

	async getDonations(id_donor: number) {
		const donor = await this.findDonorWithActivity(id_donor);

		return {
			statusCode: 200,
			message: 'Donor donations retrieved successfully',
			data: donor.donations,
		};
	}

	async getNotifications(id_donor: number) {
		const donor = await this.findDonorWithActivity(id_donor);

		return {
			statusCode: 200,
			message: 'Donor notifications retrieved successfully',
			data: donor.notifications,
		};
	}

	async getDashboard(id_donor: number) {
		const donor = await this.findDonorWithActivity(id_donor);
		const latestDonation = donor.donations[0] ?? null;
		const latestAnalysis = donor.analyses[0] ?? null;
		const urgentNotifications = donor.notifications.filter(
			(notification) => notification.status_notification === NotificationStatus.not_read,
		);

		const nextDonationPossibleAt = latestDonation
			? this.addDays(latestDonation.donation_date, MIN_DONATION_DELAY_DAYS)
			: null;

		return {
			statusCode: 200,
			message: 'Donor dashboard retrieved successfully',
			data: {
				donor,
				profileSummary: {
					fullName: `${donor.user.firstname} ${donor.user.name}`,
					bloodGroup: donor.bloodGroup.type_blood,
					isApte: donor.isApte,
					availability: donor.availability,
					donationCount: donor.donations.length,
				},
				schedule: {
					nextDonationPossibleAt,
					nextAnalysisPlannedAt: this.addDays(new Date(), 30),
				},
				history: {
					latestAnalysis,
					latestDonation,
				},
				notifications: {
					urgent: urgentNotifications,
					total: donor.notifications.length,
				},
				badges: this.buildBadges(donor.donations.length, donor.isApte),
			},
		};
	}

	private async findDonorWithActivity(id_donor: number) {
		const donor = await this.prisma.donor.findUnique({
			where: { id_donor },
			include: this.donorInclude,
		});

		if (!donor) {
			throw new NotFoundException('Donor not found');
		}

		return donor;
	}

	private async ensureUserExists(id_user: number) {
		const user = await this.prisma.user.findUnique({
			where: { id_user },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user.role !== 'donor') {
			throw new BadRequestException('The linked user must have donor role');
		}
	}

	private async ensureBloodGroupExists(id_blood: number) {
		const bloodGroup = await this.prisma.bloodGroup.findUnique({
			where: { id_blood },
		});

		if (!bloodGroup) {
			throw new NotFoundException('Blood group not found');
		}
	}

	private async ensureDonorNotAlreadyLinked(id_user: number, CIN: string) {
		const existingDonor = await this.prisma.donor.findFirst({
			where: {
				OR: [{ id_user }, { CIN }],
			},
		});

		if (existingDonor) {
			throw new ConflictException('Donor already exists for this user or CIN');
		}
	}

	private async ensureDonorUpdateIsUnique(
		id_donor: number,
		id_user?: number,
		CIN?: string,
	) {
		const conditions: Prisma.DonorWhereInput[] = [];

		if (id_user !== undefined) {
			conditions.push({ id_user });
		}

		if (CIN !== undefined) {
			conditions.push({ CIN });
		}

		if (conditions.length === 0) {
			return;
		}

		const existingDonor = await this.prisma.donor.findFirst({
			where: {
				AND: [{ id_donor: { not: id_donor } }, { OR: conditions }],
			},
		});

		if (existingDonor) {
			throw new ConflictException('Donor already exists for this user or CIN');
		}
	}

	private addDays(date: Date, days: number) {
		const nextDate = new Date(date);
		nextDate.setDate(nextDate.getDate() + days);
		return nextDate;
	}

	private buildBadges(donationCount: number, isApte: boolean) {
		const badges = [] as Array<{ label: string; achieved: boolean }>;

		badges.push({ label: 'Donneur actif', achieved: donationCount >= 1 });
		badges.push({ label: 'Donneur engagé', achieved: donationCount >= 3 });
		badges.push({ label: 'Donneur fidèle', achieved: donationCount >= 5 });
		badges.push({ label: 'Apte laboratoire', achieved: isApte });

		return badges;
	}
}
