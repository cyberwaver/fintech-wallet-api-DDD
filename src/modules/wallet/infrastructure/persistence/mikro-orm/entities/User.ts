import { BaseEntity, Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { BankAccount } from './BankAccount';

@Entity({ tableName: 'users' })
export class User extends BaseEntity {
  @PrimaryKey()
  id!: string;

  @Property()
  authId!: string;

  @Property()
  email!: string;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  phone?: string;

  @Property()
  status: string;

  @Property()
  bvn?: string;

  @Property()
  address?: string;

  @OneToMany({ entity: () => BankAccount, mappedBy: 'user' })
  bankAccounts? = new Collection<BankAccount>(this);

  @Property()
  avatarUploadId?: string;

  @Property()
  avatarUploadURL?: string;

  @Property()
  validationRules: unknown[];

  @Property()
  onboardedAt?: Date;

  @Property()
  createdAt: Date;
}
