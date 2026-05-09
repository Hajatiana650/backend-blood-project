import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  // Liste toutes les campagnes
  async findAll() {
    return this.prisma.campaign.findMany({
      orderBy: { start_date: 'desc' },
    });
  }

  // Campagnes en cours
  async getActive() {
    const now = new Date();
    return this.prisma.campaign.findMany({
      where: {
        start_date: { lte: now },
        end_date: { gte: now },
      },
      orderBy: { start_date: 'asc' },
    });
  }

  // Campagnes à venir
  async getUpcoming() {
    const now = new Date();
    return this.prisma.campaign.findMany({
      where: { start_date: { gt: now } },
      orderBy: { start_date: 'asc' },
    });
  }

  // Créer une campagne
  async create(data: {
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
  }) {
    return this.prisma.campaign.create({
      data: {
        title: data.title,
        description: data.description,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
      },
    });
  }

  // Créer campagne automatique si stock critique
  async autoCreateIfUrgence() {
    const urgences = await this.prisma.stock.findMany({
      where: { status_stock: 'urgence' },
      include: { blood_group: true },
    });

    if (urgences.length === 0) {
      return { message: 'Aucune urgence détectée. Pas de campagne créée.' };
    }

    const types = urgences.map(u => u.blood_group.type_blood).join(', ');
    const now = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 7);

    const campaign = await this.prisma.campaign.create({
      data: {
        title: `🚨 Campagne urgente - ${types}`,
        description: `Stock critique détecté pour les groupes : ${types}. Don urgent requis !`,
        start_date: now,
        end_date: end,
      },
    });

    return {
      message: 'Campagne créée automatiquement suite à un stock critique.',
      campaign,
      groupes_concernes: types,
    };
  }

  // Modifier une campagne
  async update(id: number, data: {
    title?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
  }) {
    return this.prisma.campaign.update({
      where: { id_campaign: id },
      data: {
        title: data.title,
        description: data.description,
        start_date: data.start_date ? new Date(data.start_date) : undefined,
        end_date: data.end_date ? new Date(data.end_date) : undefined,
      },
    });
  }

  // Supprimer une campagne
  async remove(id: number) {
    return this.prisma.campaign.delete({
      where: { id_campaign: id },
    });
  }
}
