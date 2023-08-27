import { IsNumber } from 'class-validator';
import { AddressDTO } from 'src/common/domain/dtos/AddressDTO';

export class UserUpdateDTO {
  firstName?: string;
  lastName?: string;
  @IsNumber()
  phone?: string;
  address?: AddressDTO;
}
