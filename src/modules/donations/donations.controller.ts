import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DonationsService } from "./donations.service";
import { CreateDonationDto } from "./dto/create-donations.dto";

@ApiTags("donations")
@Controller("donations")
export class DonationsController {
  constructor(private readonly donationService: DonationsService) {}

  @Get()
  @ApiOperation({ summary: "Lister tous les dons" })
  async findAll() {
    return this.donationService.findAll();
  }

  @Post()
  @ApiOperation({ summary: "Créer une donation" })
  @ApiBody({ type: CreateDonationDto })
  async create(@Body() dto: CreateDonationDto) {
    return this.donationService.create(dto);
  }
}