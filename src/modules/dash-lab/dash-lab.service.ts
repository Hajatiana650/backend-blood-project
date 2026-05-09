import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class DashLabService {
  constructor(private prisma: PrismaService) {}

  async getLabDashboard() {
    // 1. Analyses count
    const analysesCount = await this.prisma.analysis.count();

    // 2. Donneurs aptes
    const aptDonors = await this.prisma.donor.count({
      where: {
        isApte: true,
      },
    });

    // 3. Donneurs NON aptes
    const inaptDonors = await this.prisma.donor.count({
      where: {
        isApte: false,
      },
    });

    // 4. Donneurs avec analyses (pour déterminer pending)
    const analyzedDonorIds = await this.prisma.analysis.findMany({
      select: {
        id_donor: true,
      },
      distinct: ["id_donor"],
    });

    const analyzedIds = analyzedDonorIds.map((a) => a.id_donor);

    // 5. Donneurs en attente = sans analyse
    const pendingDonors = await this.prisma.donor.findMany({
      where: {
        id_donor: {
          notIn: analyzedIds,
        },
      },
      select: {
        id_donor: true,
        weight: true,

        user: {
          select: {
            firstname: true,
            name: true,
          },
        },

        bloodGroup: {
          select: {
            type_blood: true,
          },
        },
      },
    });

    const pendingCount = pendingDonors.length;

    return {
      analysesCount,
      pendingCount,
      aptDonors,
      pendingDonors,
    };
  }
}