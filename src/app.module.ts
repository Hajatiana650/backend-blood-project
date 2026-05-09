import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DonorModule } from './modules/donor/donor.module';
import { BloodGroupModule } from './modules/blood-group/blood-group.module';

@Module({
  imports: [
    UsersModule,
    DonorModule,
    BloodGroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
