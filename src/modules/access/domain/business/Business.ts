import { Type } from 'class-transformer';
import { AggregateRoot } from 'src/common/domain/AggregateRoot';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { BusinessService } from './BusinessService';
import { NewBusinessDTO } from './dto/dtos.index';
import {
  BusinessActivatedEvent,
  BusinessCreatedEvent,
  BusinessDeactivatedEvent,
  BusinessOnboardingCompletedEvent,
} from './events/events.index';
import { BusinessStatus } from './BusinessStatus';
import {
  BusinessShouldBeActive,
  BusinessShouldBeInactive,
  BusinessShouldBePendingOnboarding,
} from './rules/rules.index';
import { BusinessId } from './BusinessId';

export class BusinessProps {
  id: BusinessId;
  authId: UniqueEntityID;
  name: string;
  email: string;
  @Type(() => BusinessStatus)
  status: BusinessStatus;
  abbr: string;
  keyPrefix: string;
  logoUploadId: string;
  logoUploadURL: string;
  onboardedAt: Date;
  createdAt: Date;
}

export class Business extends AggregateRoot<BusinessProps> {
  constructor(props?: BusinessProps) {
    super(props);
  }

  public async activate(): Promise<void> {
    await this.checkRule(new BusinessShouldBeInactive(this.props.status));
    this.apply(new BusinessActivatedEvent(this.ID));
  }

  public async deactivate(): Promise<void> {
    await this.checkRule(new BusinessShouldBeActive(this.props.status));
    this.apply(new BusinessDeactivatedEvent(this.ID));
  }

  public async completeOnboarding(): Promise<void> {
    await this.checkRule(new BusinessShouldBePendingOnboarding(this.props.status));
    this.apply(new BusinessOnboardingCompletedEvent(this.ID));
  }

  public static async create(request: NewBusinessDTO, businessService: BusinessService): Promise<Business> {
    const business = new Business();
    request.keyPrefix = await businessService.deriveUniqueKeyPrefix(request.abbr, request.name);
    business.apply(new BusinessCreatedEvent(request));
    return business;
  }

  private $onBusinessActivatedEvent() {
    this.props.status = BusinessStatus.Active;
  }

  private $onBusinessDeactivatedEvent() {
    this.props.status = BusinessStatus.Inactive;
  }

  private $onBusinessOnboardingCompletedEvent($event: BusinessOnboardingCompletedEvent) {
    this.props.status = BusinessStatus.Active;
    this.props.onboardedAt = $event.payload.onboardedAt;
  }

  private $onBusinessCreatedEvent($event: BusinessCreatedEvent) {
    this.props.id = $event.payload.id;
    this.props.name = $event.payload.name;
    this.props.authId = new UniqueEntityID($event.payload.authId);
    this.props.email = $event.payload.email;
    this.props.abbr = $event.payload.abbr;
    this.props.keyPrefix = $event.payload.keyPrefix;
    this.props.status = BusinessStatus.Pending;
    this.props.createdAt = $event.payload.createdAt;
  }
}
