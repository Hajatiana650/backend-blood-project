import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  private getStatus(bags: number): 'normal' | 'low' | 'urgence' {
    if (bags < 5) return 'urgence';
    if (bags < 15) return 'low';
    return 'normal';
  }

  async findAll() {
    return this.prisma.stock.findMany({
      include: { blood_group: true },
      orderBy: { bags: 'asc' },
    });
  }

  async findByBloodGroup(id_blood: number) {
    return this.prisma.stock.findFirst({
      where: { id_blood },
      include: { blood_group: true },
    });
  }

  async addBags(id_blood: number, qty: number) {
    const stock = await this.prisma.stock.findFirst({ where: { id_blood } });
    if (stock) {
      const newBags = stock.bags + qty;
      return this.prisma.stock.update({
        where: { id_stock: stock.id_stock },
        data: { bags: newBags, status_stock: this.getStatus(newBags) },
        include: { blood_group: true },
      });
    }
    return this.prisma.stock.create({
      data: { id_blood, bags: qty, status_stock: this.getStatus(qty) },
      include: { blood_group: true },
    });
  }

  async removeBags(id_blood: number, qty: number) {
    const stock = await this.prisma.stock.findFirst({ where: { id_blood } });
    if (!stock) return { message: 'Stock introuvable.' };
    if (stock.bags < qty) return { message: `Stock insuffisant. Disponible : ${stock.bags} poches.` };

    const newBags = stock.bags - qty;
    const status = this.getStatus(newBags);
    const updated = await this.prisma.stock.update({
      where: { id_stock: stock.id_stock },
      data: { bags: newBags, status_stock: status },
      include: { blood_group: true },
    });

    let alert = '';
    if (status === 'urgence') alert = `🚨 URGENCE : Stock ${updated.blood_group.type_blood} critique ! ${newBags} poches restantes !`;
    else if (status === 'low') alert = `⚠️ ATTENTION : Stock ${updated.blood_group.type_blood} faible ! ${newBags} poches.`;

    return { stock: updated, alert };
  }

  async getUrgences() {
    return this.prisma.stock.findMany({
      where: { status_stock: 'urgence' },
      include: { blood_group: true },
    });
  }

  async getLowStocks() {
    return this.prisma.stock.findMany({
      where: { status_stock: { in: ['low', 'urgence'] } },
      include: { blood_group: true },
      orderBy: { bags: 'asc' },
    });
  }

  async getSummary() {
    const stocks = await this.prisma.stock.findMany({ include: { blood_group: true } });
    const total = stocks.reduce((sum, s) => sum + s.bags, 0);
    return {
      total_poches: total,
      normal: stocks.filter(s => s.status_stock === 'normal').length,
      faible: stocks.filter(s => s.status_stock === 'low').length,
      urgence: stocks.filter(s => s.status_stock === 'urgence').length,
      details: stocks,
      alertes: stocks.filter(s => s.status_stock === 'urgence').map(u => `🚨 ${u.blood_group.type_blood} : ${u.bags} poches`),
    };
  }
}
