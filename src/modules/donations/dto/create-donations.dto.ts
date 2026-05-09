import { ApiProperty } from "@nestjs/swagger";

export class CreateDonationDto {
  @ApiProperty()
  id_donor!: number;

  @ApiProperty()
  bags_qty!: number;
}