import { Entity } from '@Common/domain/Entity';
import { Identifier } from '@Common/domain/Identifier';
import { UniqueEntityID } from '@Common/domain/UniqueEntityID';
import { ValueObject } from '@Common/domain/ValueObject';

export const convertDomainPropsToObject = <P extends { id: UniqueEntityID }>(props: P) => {
  const obj = Object.assign({}, props);
  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    if (value instanceof Identifier) value = value.value;
    if (value instanceof ValueObject) value = value.value;
    else if (value instanceof Entity) value = convertDomainPropsToObject(value.getProps());
    obj[key] = value;
  });
  return obj;
};
