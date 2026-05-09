import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CrudService } from 'src/services/crud-service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, CrudService],
})
export class UsersModule {}
