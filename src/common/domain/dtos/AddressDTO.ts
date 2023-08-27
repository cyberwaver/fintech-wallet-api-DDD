import { IsNumber } from 'class-validator';

export class AddressDTO {
  @IsNumber()
  houseNo: string;
  street: string;
  city: string;
  state: string;
  country: string;
}
