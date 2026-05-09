import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiBody, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  // Recherche par groupe sanguin et/ou adresse
  @Get()
  @ApiQuery({ name: 'type_blood', example: 'A+', required: false })
  @ApiQuery({ name: 'address', example: 'Antananarivo', required: false })
  search(
    @Query('type_blood') type_blood?: string,
    @Query('address') address?: string,
  ) {
    return this.searchService.search(type_blood, address);
  }

  // Recherche vocale
  @Post('voice')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          example: 'Je cherche un donneur A+ à Antananarivo',
        },
      },
    },
  })
  searchByVoice(@Body() body: { text: string }) {
    return this.searchService.searchByVoice(body.text);
  }
}
