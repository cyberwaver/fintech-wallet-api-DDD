import { plainToClass, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Entity } from 'src/common/domain/Entity';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewBankAccountDTO } from './dto/NewBankAccountDTO';

class BankAccountProps {
  @Type(() => UniqueEntityID)
  id: UniqueEntityID;
  @IsNumber()
  accountNo: string;
  accountName: string;
  bankName: string;
  @IsNumber()
  bankCode: string;
  isDefault: boolean;
  isValidated: boolean;
  createdAt: Date;
}

export class BankAccount extends Entity<BankAccountProps> {
  constructor(props?: BankAccountProps) {
    super(props);
  }

  public validate(): void {
    this.props.isValidated = true;
  }

  public setAsDefault(): void {
    this.props.isDefault = true;
  }

  public unsetAsDefault(): void {
    this.props.isDefault = false;
  }

  public static create(request: NewBankAccountDTO): BankAccount {
    const accountProps = plainToClass(BankAccountProps, request);
    accountProps.id = new UniqueEntityID();
    accountProps.createdAt = new Date();
    return new BankAccount(accountProps);
  }
}
