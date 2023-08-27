import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { UserOnboardingUpdateDTO } from '../dto/UserOnboardingUpdateDTO';

export class UserOnboardingUpdatedEvent extends DomainEvent {
  public payload: UserOnboardingUpdateDTO & { userId: UniqueEntityID };
  constructor(request: UserOnboardingUpdateDTO, userId: UniqueEntityID) {
    super(userId);
    this.payload = { ...request, userId };
  }
}
