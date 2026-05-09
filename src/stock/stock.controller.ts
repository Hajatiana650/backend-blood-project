import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { StockService } from './stock.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Stock')
@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get()
  findAll() { return this.stockService.findAll(); }

  @Get('summary')
  getSummary() { return this.stockService.getSummary(); }

  @Get('urgences')
  getUrgences() { return this.stockService.getUrgences(); }

  @Get('low')
  getLowStocks() { return this.stockService.getLowStocks(); }

  @Get(':id_blood')
  findByBloodGroup(@Param('id_blood', ParseIntPipe) id_blood: number) {
    return this.stockService.findByBloodGroup(id_blood);
  }

  @Post('add')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id_blood: { type: 'number', example: 1 },
        qty: { type: 'number', example: 10 },
      },
    },
  })
  addBags(@Body() body: { id_blood: number; qty: number }) {
    return this.stockService.addBags(body.id_blood, body.qty);
  }

  @Post('remove')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id_blood: { type: 'number', example: 1 },
        qty: { type: 'number', example: 5 },
      },
    },
  })
  removeBags(@Body() body: { id_blood: number; qty: number }) {
    return this.stockService.removeBags(body.id_blood, body.qty);
  }
}
