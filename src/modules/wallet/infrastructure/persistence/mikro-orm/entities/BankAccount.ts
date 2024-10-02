import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';
import { User } from './User';

@Entity()
export class BankAccount extends BaseEntity {
  @PrimaryKey()
  id!: string;

  @ManyToOne({ fieldName: 'user_id' })
  user!: Ref<User>;

  @Property()
  accountNo!: string;

  @Property()
  accountName!: string;

  @Property()
  bankName!: string;

  @Property()
  bankCode!: string;

  @Property()
  isDefault: boolean;

  @Property()
  isValidated: boolean;

  @Property()
  createdAt: Date;
}
