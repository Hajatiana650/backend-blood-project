import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DonorModule } from './donor/donor.module';
import { SearchModule } from './search/search.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { StockModule } from './stock/stock.module';
import { CampaignModule } from './campaign/campaign.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DonorModule,
    SearchModule,
    ChatbotModule,
    StockModule,
    CampaignModule,
    DashboardModule,
  ],
})
export class AppModule {}
