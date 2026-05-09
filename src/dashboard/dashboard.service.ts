import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Total donneurs
    const totalDonors = await this.prisma.donor.count();

    // Donneurs aptes
    const apteDonors = await this.prisma.donor.count({
      where: { isApte: true },
    });

    // Donneurs disponibles
    const availableDonors = await this.prisma.donor.count({
      where: { isApte: true, availability: true },
    });

    // Dons du mois
    const donsduMois = await this.prisma.donation.count({
      where: {
        donation_date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Total poches données ce mois
    const pochesduMois = await this.prisma.donation.aggregate({
      where: {
        donation_date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: { bags_qty: true },
    });

    // Stock total
    const stocks = await this.prisma.stock.findMany({
      include: { blood_group: true },
      orderBy: { bags: 'asc' },
    });

    const totalPoches = stocks.reduce((sum, s) => sum + s.bags, 0);
    const urgences = stocks.filter(s => s.status_stock === 'urgence');
    const faibles = stocks.filter(s => s.status_stock === 'low');
    const normaux = stocks.filter(s => s.status_stock === 'normal');

    // Groupes sanguins
    const bloodGroups = await this.prisma.bloodGroup.findMany();

    // Donneurs par groupe sanguin
    const donorsByBloodGroup = await this.prisma.donor.groupBy({
      by: ['id_blood'],
      _count: { id_donor: true },
      where: { id_blood: { not: null } },
    });

    const donorsByBloodGroupDetails = await Promise.all(
      donorsByBloodGroup.map(async (d) => {
        const bg = await this.prisma.bloodGroup.findUnique({
          where: { id_blood: d.id_blood! },
        });
        return {
          blood_group: bg?.type_blood || 'N/A',
          count: d._count.id_donor,
        };
      }),
    );

    // Dons par mois (6 derniers mois)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const donsByMonth = await this.prisma.donation.findMany({
      where: { donation_date: { gte: sixMonthsAgo } },
      select: { donation_date: true, bags_qty: true },
    });

    const monthlyStats: Record<string, { dons: number; poches: number }> = {};
    donsByMonth.forEach(d => {
      const key = `${d.donation_date.getFullYear()}-${String(d.donation_date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyStats[key]) monthlyStats[key] = { dons: 0, poches: 0 };
      monthlyStats[key].dons += 1;
      monthlyStats[key].poches += d.bags_qty;
    });

    // Campagnes actives
    const activeCampaigns = await this.prisma.campaign.findMany({
      where: {
        start_date: { lte: now },
        end_date: { gte: now },
      },
    });

    // Sorties du mois
    const sortiesduMois = await this.prisma.bloodOutput.aggregate({
      where: {
        output_date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: { qty: true },
    });

    return {
      donneurs: {
        total: totalDonors,
        aptes: apteDonors,
        disponibles: availableDonors,
        non_aptes: totalDonors - apteDonors,
        par_groupe_sanguin: donorsByBloodGroupDetails,
      },
      dons_du_mois: {
        total_dons: donsduMois,
        total_poches: pochesduMois._sum.bags_qty || 0,
      },
      sorties_du_mois: {
        total_poches: sortiesduMois._sum.qty || 0,
      },
      stock: {
        total_poches: totalPoches,
        normal: normaux.length,
        faible: faibles.length,
        urgence: urgences.length,
        details: stocks.map(s => ({
          blood_group: s.blood_group.type_blood,
          bags: s.bags,
          status: s.status_stock,
        })),
        alertes: urgences.map(u => ({
          blood_group: u.blood_group.type_blood,
          bags: u.bags,
          message: `🚨 URGENCE : Stock ${u.blood_group.type_blood} critique !`,
        })),
      },
      groupes_sanguins: bloodGroups,
      campagnes_actives: activeCampaigns.length,
      statistiques_mensuelles: monthlyStats,
    };
  }
}
