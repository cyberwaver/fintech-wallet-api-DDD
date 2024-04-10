import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { NewMerchantDTO } from '../dto/dtos.index';
import { MerchantId } from '../MerchantId';

export class MerchantCreatedEvent extends DomainEvent {
  public payload: NewMerchantDTO & { id: MerchantId; createdAt: Date };
  constructor(data: NewMerchantDTO, id = new MerchantId()) {
    super(id);
    this.payload = { ...data, id, createdAt: new Date() };
  }
}
