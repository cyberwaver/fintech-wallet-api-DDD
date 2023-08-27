import { IsNotEmpty } from 'class-validator';

export class CreateWalletCommand {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  ownerId: string;

  @IsNotEmpty()
  type: string;
}
