import { Controller, Get, Logger } from "@nestjs/common";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { DashLabService } from "./dash-lab.service";

@ApiTags("dashboard")
@Controller("dashboard")
export class DashLabController {
  private readonly logger = new Logger(DashLabController.name);

  constructor(private readonly dashboardService: DashLabService) {}

  @Get("lab")
  @ApiOperation({ summary: "Récupérer le dashboard du laboratoire" })
  @ApiResponse({
    status: 200,
    description: "Statistiques du dashboard labo",
    schema: {
      example: {
        analysesCount: 10,
        pendingCount: 5,
        aptDonors: 20,
        pendingDonors: [
          {
            id_donor: 1,
            weight: 70,
            user: {
              firstname: "Jean",
              name: "Rakoto",
            },
            bloodGroup: {
              type_blood: "A_POS",
            },
          },
        ],
      },
    },
  })
  async getLabDashboard() {
    this.logger.log("Fetching lab dashboard data");
    return this.dashboardService.getLabDashboard();
  }
}