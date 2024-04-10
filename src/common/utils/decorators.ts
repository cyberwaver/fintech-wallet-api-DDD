import { AggregateRoot } from '@Common/domain/AggregateRoot';
import { UniqueEntityID } from '@Common/domain/UniqueEntityID';
import { SetMetadata } from '@nestjs/common';

export const ForAggregateRoot = <T extends { id: UniqueEntityID }>(clazz: typeof AggregateRoot<T>) =>
  SetMetadata('aggregate', clazz);
