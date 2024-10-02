import ResponseEntity from '@Common/interface/ResponseEntity';
import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import CreateWalletTemplateDTO from './dto/CreateWalletTemplateDTO';
import { CreateWalletCommand } from '@Wallet/application/commands/CreateWallet/CreateWalletCommand';
import UpdateWalletTemplateDTO from './dto/UpdateWalletTemplateDTO';
import { UpdateWalletTemplateCommand } from '@Wallet/application/commands/UpdateWalletTemplate/UpdateWalletTemplateCommand';

@Controller('wallet/template')
export class WalletTemplateController {
  constructor(private commandBus: CommandBus) {}

  @Post('/')
  async create(@Body() dto: CreateWalletTemplateDTO): Promise<ResponseEntity<string>> {
    const result = await this.commandBus.execute(plainToInstance(CreateWalletCommand, dto));
    if (result.IS_FAILURE) throw result.error;
    return ResponseEntity.created('Wallet template created successfully');
  }

  @Patch('/')
  async update(@Body() dto: UpdateWalletTemplateDTO): Promise<ResponseEntity<string>> {
    const result = await this.commandBus.execute(plainToInstance(UpdateWalletTemplateCommand, dto));
    if (result.IS_FAILURE) throw result.error;
    return ResponseEntity.ok('Wallet template updated successfully');
  }
}
