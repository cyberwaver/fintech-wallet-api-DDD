import { AggregateRoot as AggRoot } from '@Common/domain/AggregateRoot';
import { UniqueEntityID } from '@Common/domain/UniqueEntityID';
import { SetMetadata } from '@nestjs/common';

export const AggregateRoot = <T extends { id: UniqueEntityID }>(clazz: typeof AggRoot<T>) =>
  SetMetadata('aggregate', clazz);
