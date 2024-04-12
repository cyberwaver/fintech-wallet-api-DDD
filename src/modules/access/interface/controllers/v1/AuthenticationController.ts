import { CreateAuthenticationCommand } from '@Access/application/commands/CreateAuthentication/CreateAuthenticationCommand';
import { GenerateAuthTokensCommand } from '@Access/application/commands/GenerateAuthTokens/GenerateAuthTokensCommand';
import { RequestPasswordResetCommand } from '@Access/application/commands/RequestPasswordReset/RequestPasswordResetCommand';
import { ResetPasswordCommand } from '@Access/application/commands/ResetPassword/ResetPasswordCommand';
import CreateAuthenticationRequestDTO from '@Access/application/dtos/CreateAuthenticationRequestDTO';
import GenerateAuthTokensRequestDTO from '@Access/application/dtos/GenerateAuthTokensRequestDTO';
import RequestPasswordResetDTO from '@Access/application/dtos/RequestPasswordResetDTO';
import ResetPasswordDTO from '@Access/application/dtos/ResetPasswordDTO';
import { AuthTokens } from '@Access/domain/authentication/AuthenticationService';
import ResponseEntity from '@Common/interface/ResponseEntity';
import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthenticationController {
  constructor(private commandBus: CommandBus) {}

  @Post('/create')
  async create(@Body() dto: CreateAuthenticationRequestDTO): Promise<ResponseEntity<string>> {
    const result = await this.commandBus.execute(plainToInstance(CreateAuthenticationCommand, dto));
    if (result.IS_FAILURE) throw result.error;
    return ResponseEntity.created('Authentication created');
  }

  @Post('/tokens')
  async generateAuthTokens(@Body() dto: GenerateAuthTokensRequestDTO): Promise<ResponseEntity<AuthTokens>> {
    const result = await this.commandBus.execute(plainToInstance(GenerateAuthTokensCommand, dto));
    if (result.IS_FAILURE) throw result.error;
    return ResponseEntity.ok(result.value);
  }

  @Post('/password-reset-request')
  async requestPasswordReset(@Body() dto: RequestPasswordResetDTO): Promise<ResponseEntity<string>> {
    const result = await this.commandBus.execute(plainToInstance(RequestPasswordResetCommand, dto));
    if (result.IS_FAILURE) throw result.error;
    return ResponseEntity.ok('Password reset requested successfully');
  }

  @Post('/password-reset')
  async resetPassword(@Body() dto: ResetPasswordDTO): Promise<ResponseEntity<string>> {
    const result = await this.commandBus.execute(plainToInstance(ResetPasswordCommand, dto));
    if (result.IS_FAILURE) throw result.error;
    return ResponseEntity.ok('Password reset successfully');
  }
}
