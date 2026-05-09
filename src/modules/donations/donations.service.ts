import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: { id_donor: number; bags_qty: number }) {
    return this.prisma.donation.create({
      data: {
        id_donor: dto.id_donor,
        bags_qty: dto.bags_qty,
        donation_date: new Date(),
      },
      include: {
        donor: {
          include: {
            user: true,
            bloodGroup: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.donation.findMany({
      include: {
        donor: {
          include: {
            user: true,
            bloodGroup: true,
          },
        },
      },
      orderBy: {
        donation_date: "desc",
      },
    });
  }
}