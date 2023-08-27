import { DomainEvent } from 'src/common/domain/event/DomainEvent';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { UserOnboardingRuleValidatedDTO } from '../dto/dtos.index';

export class UserOnboardingRuleValidationRecordedEvent extends DomainEvent {
  public payload: UserOnboardingRuleValidatedDTO & { userId: UniqueEntityID };
  constructor(request: UserOnboardingRuleValidatedDTO, userId: UniqueEntityID) {
    super(userId);
    this.payload = { ...request, userId };
  }
}
