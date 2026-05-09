import { Controller, Get, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { DonorService } from './donor.service';
import { UpdateDonorDto } from './dto/update-donor.dto';

@Controller('donors')
export class DonorController {
  constructor(private donorService: DonorService) {}

  @Get()
  findAll() { return this.donorService.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.donorService.findOne(id); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDonorDto) {
    return this.donorService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.donorService.remove(id); }
}
