import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDonorDto } from './dto/update-donor.dto';

@Injectable()
export class DonorService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.donor.findMany({
      include: {
        user: { select: { name: true, firstname: true, email: true, phone_number: true } },
        blood_group: true,
      },
    });
  }

  async findOne(id: number) {
    const donor = await this.prisma.donor.findUnique({
      where: { id_donor: id },
      include: { user: true, blood_group: true, analyses: true, donations: true },
    });
    if (!donor) throw new NotFoundException('Donneur introuvable');
    return donor;
  }

  async update(id: number, dto: UpdateDonorDto) {
    return this.prisma.donor.update({
      where: { id_donor: id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.donor.delete({ where: { id_donor: id } });
  }
}
