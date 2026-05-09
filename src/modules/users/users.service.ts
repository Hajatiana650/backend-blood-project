import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { CrudService } from 'src/services/crud-service';

@Injectable()
export class UsersService extends CrudService<
  PrismaService["user"],
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserWhereUniqueInput
>{
  constructor(private prisma: PrismaService) {
    super(prisma.user);
  }

  async getAllUsers(){
    return super.findAll();
  }

  async createUser(data: Prisma.UserCreateInput){
    return super.create(data);
  }
}
