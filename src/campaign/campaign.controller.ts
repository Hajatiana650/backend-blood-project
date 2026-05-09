import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Campaign')
@Controller('campaign')
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  // GET /campaign
  @Get()
  findAll() { return this.campaignService.findAll(); }

  // GET /campaign/active
  @Get('active')
  getActive() { return this.campaignService.getActive(); }

  // GET /campaign/upcoming
  @Get('upcoming')
  getUpcoming() { return this.campaignService.getUpcoming(); }

  // POST /campaign/auto
  @Post('auto')
  autoCreate() { return this.campaignService.autoCreateIfUrgence(); }

  // POST /campaign
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Campagne Don de Sang Tana' },
        description: { type: 'string', example: 'Campagne de collecte de sang à Antananarivo' },
        start_date: { type: 'string', example: '2026-05-10' },
        end_date: { type: 'string', example: '2026-05-17' },
      },
    },
  })
  create(@Body() body: {
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
  }) {
    return this.campaignService.create(body);
  }

  // PATCH /campaign/:id
  @Patch(':id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        start_date: { type: 'string' },
        end_date: { type: 'string' },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      title?: string;
      description?: string;
      start_date?: string;
      end_date?: string;
    },
  ) {
    return this.campaignService.update(id, body);
  }

  // DELETE /campaign/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.campaignService.remove(id);
  }
}
