import { IsNumber } from 'class-validator';
import { AddressDTO } from 'src/common/domain/dtos/AddressDTO';

export class UserOnboardingUpdateDTO {
  firstName?: string;
  lastName?: string;
  @IsNumber()
  phone?: string;
  @IsNumber()
  bvn?: string;
  address?: AddressDTO;
}
