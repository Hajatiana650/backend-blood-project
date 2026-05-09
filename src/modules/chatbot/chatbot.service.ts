import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatbotService {
  constructor(private prisma: PrismaService) {}

  async processMessage(message: string): Promise<string> {
    const msg = message.toLowerCase().trim();

    // Stock sanguin
    if (msg.includes('stock') || msg.includes('poche') || msg.includes('disponible')) {
      return this.getStockInfo();
    }

    // Donneur par groupe sanguin
    const bloodGroups = ['a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-'];
    const foundGroup = bloodGroups.find(bg => msg.includes(bg));
    if (foundGroup || msg.includes('donneur') || msg.includes('don')) {
      return this.getDonorInfo(foundGroup?.toUpperCase());
    }

    // Urgence
    if (msg.includes('urgence') || msg.includes('urgent')) {
      return this.getUrgenceInfo();
    }

    // Campagne
    if (msg.includes('campagne') || msg.includes('collecte')) {
      return this.getCampaignInfo();
    }

    // Analyse
    if (msg.includes('analyse') || msg.includes('test') || msg.includes('apte')) {
      return 'Pour les analyses, contactez le laboratoire. Un donneur est déclaré apte après validation du labo.';
    }

    // Délai entre dons
    if (msg.includes('délai') || msg.includes('attendre') || msg.includes('prochain don')) {
      return 'Le délai minimum entre deux dons de sang est de 56 jours (8 semaines) pour les hommes et 84 jours (12 semaines) pour les femmes.';
    }

    // Groupe sanguin compatible
    if (msg.includes('compatible') || msg.includes('compatibilité')) {
      return this.getCompatibilityInfo(msg);
    }

    // Aide générale
    return this.getHelp();
  }

  private async getStockInfo(): Promise<string> {
    const stocks = await this.prisma.stock.findMany({
      include: { blood_group: true },
      orderBy: { bags: 'asc' },
    });

    if (stocks.length === 0) {
      return 'Aucun stock enregistré pour le moment.';
    }

    let response = '📦 Stock sanguin actuel :\n';
    stocks.forEach(s => {
      const emoji =
        s.status_stock === 'urgence' ? '🔴' :
        s.status_stock === 'low' ? '🟡' : '🟢';
      response += `${emoji} ${s.blood_group.type_blood} : ${s.bags} poches (${s.status_stock})\n`;
    });

    const urgences = stocks.filter(s => s.status_stock === 'urgence');
    if (urgences.length > 0) {
      response += `\n⚠️ URGENCE : ${urgences.map(u => u.blood_group.type_blood).join(', ')} en stock critique !`;
    }

    return response;
  }

  private async getDonorInfo(bloodGroup?: string): Promise<string> {
    const where: any = { isApte: true, availability: true };
    if (bloodGroup) {
      where.blood_group = { type_blood: bloodGroup };
    }

    const donors = await this.prisma.donor.findMany({
      where,
      include: {
        user: { select: { name: true, firstname: true, phone_number: true } },
        blood_group: true,
      },
      take: 5,
    });

    if (donors.length === 0) {
      return bloodGroup
        ? `Aucun donneur disponible pour le groupe ${bloodGroup} actuellement.`
        : 'Aucun donneur disponible actuellement.';
    }

    let response = bloodGroup
      ? `👤 Donneurs disponibles pour ${bloodGroup} :\n`
      : `👤 Donneurs disponibles :\n`;

    donors.forEach(d => {
      response += `- ${d.user.firstname} ${d.user.name} | ${d.blood_group?.type_blood || 'N/A'} | 📞 ${d.user.phone_number || 'N/A'}\n`;
    });

    return response;
  }

  private async getUrgenceInfo(): Promise<string> {
    const urgences = await this.prisma.stock.findMany({
      where: { status_stock: 'urgence' },
      include: { blood_group: true },
    });

    if (urgences.length === 0) {
      return '✅ Aucune urgence en ce moment. Tous les stocks sont normaux.';
    }

    let response = '🚨 URGENCE - Stocks critiques :\n';
    urgences.forEach(u => {
      response += `🔴 ${u.blood_group.type_blood} : seulement ${u.bags} poches restantes !\n`;
    });
    response += '\nContactez immédiatement les donneurs compatibles.';

    return response;
  }

  private async getCampaignInfo(): Promise<string> {
    const now = new Date();
    const campaigns = await this.prisma.campaign.findMany({
      where: { end_date: { gte: now } },
      orderBy: { start_date: 'asc' },
    });

    if (campaigns.length === 0) {
      return 'Aucune campagne de don en cours actuellement.';
    }

    let response = '📢 Campagnes en cours :\n';
    campaigns.forEach(c => {
      response += `- ${c.title} : du ${c.start_date.toLocaleDateString()} au ${c.end_date.toLocaleDateString()}\n`;
      if (c.description) response += `  ${c.description}\n`;
    });

    return response;
  }

  private getCompatibilityInfo(msg: string): string {
    const compatibilite: Record<string, string> = {
      'O-': 'O- est donneur universel — compatible avec tous les groupes.',
      'O+': 'O+ est compatible avec A+, B+, AB+, O+.',
      'A+': 'A+ est compatible avec A+, AB+.',
      'A-': 'A- est compatible avec A+, A-, AB+, AB-.',
      'B+': 'B+ est compatible avec B+, AB+.',
      'B-': 'B- est compatible avec B+, B-, AB+, AB-.',
      'AB+': 'AB+ est receveur universel — peut recevoir de tous les groupes.',
      'AB-': 'AB- peut recevoir de A-, B-, AB-, O-.',
    };

    const bloodGroups = ['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    const found = bloodGroups.find(bg => msg.toUpperCase().includes(bg));

    if (found) return compatibilite[found];
    return 'Précisez le groupe sanguin (ex: A+, O-, AB+) pour connaître les compatibilités.';
  }

  private getHelp(): string {
    return `🤖 Bonjour ! Je suis l'assistant de gestion du sang. Je peux vous aider avec :

1️⃣  Stock sanguin → "Quel est le stock ?"
2️⃣  Donneurs disponibles → "Donneurs A+" ou "Donneurs disponibles"
3️⃣  Urgences → "Y a-t-il des urgences ?"
4️⃣  Campagnes → "Campagnes en cours"
5️⃣  Compatibilité → "Compatibilité O-"
6️⃣  Délai entre dons → "Quel est le délai entre deux dons ?"

Comment puis-je vous aider ?`;
  }
}
