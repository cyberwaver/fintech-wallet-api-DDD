import { plainToClass } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ValueObject } from './ValueObject';

class AddressProps {
  @IsNumber()
  houseNo: string;
  street: string;
  city: string;
  state: string;
  country: string;
}

export class Address extends ValueObject<AddressProps> {
  constructor(value: unknown) {
    super(plainToClass(AddressProps, value));
  }
}
