import { Controller, Get, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { DonorService } from './donor.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Donor')
@Controller('donors')
export class DonorController {
  constructor(private donorService: DonorService) {}

  @Get()
  findAll() { return this.donorService.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donorService.findOne(id);
  }

  // Profil du donneur par id_user
  @Get('profil/:id_user')
  getProfil(@Param('id_user', ParseIntPipe) id_user: number) {
    return this.donorService.getProfil(id_user);
  }

  // Modifier profil
  @Patch('profil/:id_user')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone_number: { type: 'string', example: '034000000' },
        address: { type: 'string', example: 'Antananarivo' },
        job: { type: 'string', example: 'Médecin' },
        weight: { type: 'number', example: 70 },
        availability: { type: 'boolean', example: true },
        photo: { type: 'string', example: 'url_photo' },
      },
    },
  })
  updateProfil(
    @Param('id_user', ParseIntPipe) id_user: number,
    @Body() dto: {
      phone_number?: string;
      address?: string;
      job?: string;
      weight?: number;
      availability?: boolean;
      photo?: string;
    },
  ) {
    return this.donorService.updateProfil(id_user, dto);
  }

  // Historique des dons
  @Get('historique/dons/:id_user')
  getHistoriqueDons(@Param('id_user', ParseIntPipe) id_user: number) {
    return this.donorService.getHistoriqueDons(id_user);
  }

  // Historique des analyses
  @Get('historique/analyses/:id_user')
  getHistoriqueAnalyses(@Param('id_user', ParseIntPipe) id_user: number) {
    return this.donorService.getHistoriqueAnalyses(id_user);
  }

  // Campagnes disponibles
  @Get('campagnes/all')
  getCampaigns() {
    return this.donorService.getCampaigns();
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.donorService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.donorService.remove(id);
  }
}
