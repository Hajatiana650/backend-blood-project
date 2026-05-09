import { ApiProperty } from "@nestjs/swagger";

export class PendingDonorDto {
  @ApiProperty()
  id_donor!: number;

  @ApiProperty()
  weight!: number;

  @ApiProperty({
    example: {
      firstname: "Jean",
      name: "Rakoto",
    },
  })
  user!: {
    firstname: string;
    name: string;
  };

  @ApiProperty({
    example: {
      type_blood: "A_POS",
    },
  })
  bloodGroup!: {
    type_blood: string;
  };
}