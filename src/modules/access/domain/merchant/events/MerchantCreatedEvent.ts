import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewMerchantDTO } from '../dto/dtos.index';

export class MerchantCreatedEvent extends DomainEvent {
  public payload: NewMerchantDTO & { merchantId: UniqueEntityID; createdAt: Date };
  constructor(data: NewMerchantDTO, merchantId: UniqueEntityID = new UniqueEntityID()) {
    super(merchantId);
    this.payload = { ...data, merchantId, createdAt: new Date() };
  }
}
