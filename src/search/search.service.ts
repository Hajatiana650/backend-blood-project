import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  // Recherche principale : groupe sanguin + adresse
  async search(type_blood?: string, address?: string) {
    const where: any = {
      isApte: true,
      availability: true,
    };

    if (type_blood) {
      where.blood_group = { type_blood };
    }

    if (address) {
      where.address = {
        contains: address,
        mode: 'insensitive',
      };
    }

    const donors = await this.prisma.donor.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            firstname: true,
            phone_number: true,
            email: true,
          },
        },
        blood_group: true,
      },
      orderBy: { id_donor: 'asc' },
    });

    return {
      total: donors.length,
      filters: { type_blood, address },
      donors,
    };
  }

  // Recherche vocale
  async searchByVoice(text: string) {
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const foundBloodGroup = bloodGroups.find(bg =>
      text.toUpperCase().includes(bg.toUpperCase()),
    );

    const cities = [
      'Antananarivo', 'Fianarantsoa', 'Toamasina',
      'Mahajanga', 'Toliara', 'Antsiranana',
      'Tana', 'Fianar', 'Tamatave',
    ];
    const foundCity = cities.find(city =>
      text.toLowerCase().includes(city.toLowerCase()),
    );

    if (!foundBloodGroup && !foundCity) {
      return {
        total: 0,
        message: 'Aucun critère détecté. Exemple : "Donneur A+ à Antananarivo"',
        donors: [],
      };
    }

    return this.search(foundBloodGroup, foundCity);
  }
}
