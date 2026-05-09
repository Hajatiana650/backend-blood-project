import { Controller, Get, Body, Post, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Prisma } from 'generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  
  private logger = new Logger(UsersController.name);
  
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'list all user' })
  @ApiResponse({ status: 200, description: 'success' })
  async getAllUsers() {
    try {
      this.logger.log('Fetching all users...');
      const result = await this.usersService.getAllUsers();
      this.logger.log('Users fetched successfully');
      return result;
    } catch (error) {
      this.logger.error('Error fetching users:', error);
      throw error;
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Créer un utilisateur',
    description:
      'Création d’un utilisateur avec rôle admin, labo ou donor',
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      donor: {
        summary: 'Exemple Donneur',
        value: {
          name: 'Rakoto',
          firstname: 'Jean',
          email: 'jean@gmail.com',
          password: 'Jean123@',
          role: 'donor',
          phone_number: '0341234567',
        },
      },

      labo: {
        summary: 'Exemple Responsable laboratoire',
        value: {
          name: 'Rabe',
          firstname: 'Sarah',
          email: 'sarah.labo@gmail.com',
          password: 'Sarah123@',
          role: 'labo',
          phone_number: '0320000000',
        },
      },

      admin: {
        summary: 'Exemple Administrateur',
        value: {
          name: 'Admin',
          firstname: 'System',
          email: 'admin@gmail.com',
          password: 'Admin123@',
          role: 'admin',
          phone_number: '0331111111',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',

    schema: {
      example: {
        id_user: 1,
        name: 'Rakoto',
        firstname: 'Jean',
        email: 'jean@gmail.com',
        role: 'donor',
        phone_number: '0341234567',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation échouée',

    schema: {
      example: {
        statusCode: 400,
        message: [
          'email must be an email',
          'password must be longer than or equal to 6 characters',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email déjà utilisé',

    schema: {
      example: {
        statusCode: 409,
        message: 'Email already exists',
        error: 'Conflict',
      },
    },
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
