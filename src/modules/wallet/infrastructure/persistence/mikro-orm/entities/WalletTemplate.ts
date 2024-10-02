import { DaoEntity } from '@Common/infrastructure/persistence/mikro-orm/DaoEntity';
import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class WalletTemplate extends DaoEntity {
  @PrimaryKey()
  id!: string;

  @Property()
  type!: string;

  @Property()
  accountId?: string;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  email!: string;

  @Property()
  password: string;

  @Property()
  emailVerifiedAt?: Date;

  @Property()
  passwordLastResetAt?: Date;

  @Property()
  createdAt: Date;
}
