import { CreateAuthenticationCommand } from '@Access/application/commands/CreateAuthentication/CreateAuthenticationCommand';
import CreateAuthenticationRequestDTO from '@Access/application/dtos/CreateAuthenticationRequestDTO';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { instanceToInstance, plainToClass, plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthenticationController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  create(@Body() dto: CreateAuthenticationRequestDTO): string {
    this.commandBus.execute(plainToInstance(CreateAuthenticationCommand, dto));
    return 'Authentication created';
  }

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
