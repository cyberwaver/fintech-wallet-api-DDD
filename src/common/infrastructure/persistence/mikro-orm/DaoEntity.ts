import { BaseEntity, PrimaryKey } from '@mikro-orm/core';

export class DaoEntity extends BaseEntity {
  @PrimaryKey()
  id!: string;
}
