import { Injectable } from '@nestjs/common';
import { BloodType, Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CrudService } from 'src/services/crud-service';
import { CreateBloodGroupDto } from './dto/create-blood-group.dto';
import { BLOOD_COMPATIBILITY } from 'src/utils/blood-compatibility';

@Injectable()
export class BloodGroupService extends CrudService<
  PrismaService['bloodGroup'],
  Prisma.BloodGroupCreateInput,
  Prisma.BloodGroupUpdateInput,
  Prisma.BloodGroupWhereUniqueInput
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.bloodGroup, undefined, {
      type_blood: 'asc',
    });
  }

  canDonate(donor: BloodType, receiver: BloodType): boolean {
    return BLOOD_COMPATIBILITY[donor].includes(receiver);
  }

  canReceive(receiver: BloodType, donor: BloodType): boolean {
    return BLOOD_COMPATIBILITY[donor].includes(receiver);
  }

  getCompatibleDonors(receiver: BloodType): BloodType[] {
    return Object.entries(BLOOD_COMPATIBILITY)

      .filter(([_, receivers]) => receivers.includes(receiver))

      .map(([donor]) => donor as BloodType);
  }

  getCompatibleReceivers(donor: BloodType): BloodType[] {
    return BLOOD_COMPATIBILITY[donor];
  }
  async findAll() {
    return super.findAll();
  }

  async findOne(id_blood: number) {
    return super.findBySpecificColumn({ id_blood });
  }

  async create(data: CreateBloodGroupDto) {
    return super.create(data);
  }

  async deleteBloodGroup(id_blood: number) {
    return super.delete({ id_blood });
  }
}
