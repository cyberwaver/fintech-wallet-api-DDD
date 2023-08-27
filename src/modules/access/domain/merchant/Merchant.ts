import { Type } from 'class-transformer';
import { AggregateRoot } from 'src/common/domain/AggregateRoot';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { MerchantService } from './MerchantService';
import { NewMerchantDTO } from './dto/dtos.index';
import {
  MerchantActivatedEvent,
  MerchantCreatedEvent,
  MerchantDeactivatedEvent,
  MerchantOnboardingCompletedEvent,
} from './events/events.index';
import { MerchantStatus } from './MerchantStatus';
import {
  MerchantShouldBeActive,
  MerchantShouldBeInactive,
  MerchantShouldBePendingOnboarding,
} from './rules/rules.index';

export class MerchantProps {
  id: UniqueEntityID;
  authId: UniqueEntityID;
  name: string;
  email: string;
  @Type(() => MerchantStatus)
  status: MerchantStatus;
  abbr: string;
  keyPrefix: string;
  logoUploadId: string;
  logoUploadURL: string;
  onboardedAt: Date;
  createdAt: Date;
}

export class Merchant extends AggregateRoot<MerchantProps> {
  constructor(props?: MerchantProps) {
    super(props);
  }

  public async activate(): Promise<void> {
    await this.checkRule(new MerchantShouldBeInactive(this.props.status));
    this.apply(new MerchantActivatedEvent(this.ID));
  }

  public async deactivate(): Promise<void> {
    await this.checkRule(new MerchantShouldBeActive(this.props.status));
    this.apply(new MerchantDeactivatedEvent(this.ID));
  }

  public async completeOnboarding(): Promise<void> {
    await this.checkRule(new MerchantShouldBePendingOnboarding(this.props.status));
    this.apply(new MerchantOnboardingCompletedEvent(this.ID));
  }

  public static async create(
    request: NewMerchantDTO,
    merchantService: MerchantService,
  ): Promise<Merchant> {
    const merchant = new Merchant();
    request.keyPrefix = await merchantService.deriveUniqueKeyPrefix(request.abbr, request.name);
    merchant.apply(new MerchantCreatedEvent(request));
    return merchant;
  }

  private $onMerchantActivatedEvent() {
    this.props.status = MerchantStatus.Active;
  }

  private $onMerchantDeactivatedEvent() {
    this.props.status = MerchantStatus.Inactive;
  }

  private $onMerchantOnboardingCompletedEvent($event: MerchantOnboardingCompletedEvent) {
    this.props.status = MerchantStatus.Active;
    this.props.onboardedAt = $event.payload.onboardedAt;
  }

  private $onMerchantCreatedEvent($event: MerchantCreatedEvent) {
    this.mapToProps($event.payload);
    this.props.status = MerchantStatus.Pending;
    this.props.createdAt = $event.payload.createdAt;
  }
}
