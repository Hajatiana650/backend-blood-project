import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
      include: {
        user: true,
        blood_group: true,
        analyses: true,
        donations: true,
      },
    });
    if (!donor) throw new NotFoundException('Donneur introuvable');
    return donor;
  }

  // Profil complet du donneur
  async getProfil(id_user: number) {
    const donor = await this.prisma.donor.findUnique({
      where: { id_user },
      include: {
        user: {
          select: {
            name: true,
            firstname: true,
            email: true,
            phone_number: true,
            role: true,
          },
        },
        blood_group: true,
      },
    });
    if (!donor) throw new NotFoundException('Profil introuvable');

    return {
      nom: donor.user.name,
      prenom: donor.user.firstname,
      email: donor.user.email,
      telephone: donor.user.phone_number,
      adresse: donor.address,
      profession: donor.job,
      poids: donor.weight,
      disponible: donor.availability,
      isApte: donor.isApte,
      photo: donor.photo,
      groupe_sanguin: donor.blood_group?.type_blood || 'Non défini',
      date_naissance: donor.birth_date,
      CIN: donor.CIN,
    };
  }

  // Modifier profil
  async updateProfil(id_user: number, dto: {
    phone_number?: string;
    address?: string;
    job?: string;
    weight?: number;
    availability?: boolean;
    photo?: string;
  }) {
    const donor = await this.prisma.donor.findUnique({ where: { id_user } });
    if (!donor) throw new NotFoundException('Donneur introuvable');

    // Mettre à jour téléphone dans User
    if (dto.phone_number) {
      await this.prisma.user.update({
        where: { id_user },
        data: { phone_number: dto.phone_number },
      });
    }

    // Mettre à jour infos Donor
    return this.prisma.donor.update({
      where: { id_user },
      data: {
        address: dto.address,
        job: dto.job,
        weight: dto.weight,
        availability: dto.availability,
        photo: dto.photo,
      },
      include: {
        user: { select: { name: true, firstname: true, email: true, phone_number: true } },
        blood_group: true,
      },
    });
  }

  // Historique des dons
  async getHistoriqueDons(id_user: number) {
    const donor = await this.prisma.donor.findUnique({ where: { id_user } });
    if (!donor) throw new NotFoundException('Donneur introuvable');

    const donations = await this.prisma.donation.findMany({
      where: { id_donor: donor.id_donor },
      orderBy: { donation_date: 'desc' },
    });

    return {
      total_dons: donations.length,
      total_poches: donations.reduce((sum, d) => sum + d.bags_qty, 0),
      dons: donations,
    };
  }

  // Historique des analyses
  async getHistoriqueAnalyses(id_user: number) {
    const donor = await this.prisma.donor.findUnique({ where: { id_user } });
    if (!donor) throw new NotFoundException('Donneur introuvable');

    return this.prisma.analysis.findMany({
      where: { id_donor: donor.id_donor },
      orderBy: { analysis_date: 'desc' },
    });
  }

  // Campagnes disponibles pour le donneur
  async getCampaigns() {
    const now = new Date();
    return this.prisma.campaign.findMany({
      where: { end_date: { gte: now } },
      orderBy: { start_date: 'asc' },
    });
  }

  async update(id: number, dto: any) {
    return this.prisma.donor.update({
      where: { id_donor: id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.donor.delete({ where: { id_donor: id } });
  }
}
