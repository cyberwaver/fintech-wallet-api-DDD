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
import { MerchantId } from './MerchantId';

export class MerchantProps {
  id: MerchantId;
  authId: UniqueEntityID;
  name: string;
  email: string;
  @Type(() => MerchantStatus)
  status: MerchantStatus;
  abbr: string;
  keyPrefix: string;
  currencyCode: string;
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
    await this.checkRule(new MerchantShouldBeInactive(this.state.status));
    this.apply(new MerchantActivatedEvent(this.ID));
  }

  public async deactivate(): Promise<void> {
    await this.checkRule(new MerchantShouldBeActive(this.state.status));
    this.apply(new MerchantDeactivatedEvent(this.ID));
  }

  public async completeOnboarding(): Promise<void> {
    await this.checkRule(new MerchantShouldBePendingOnboarding(this.state.status));
    this.apply(new MerchantOnboardingCompletedEvent(this.ID));
  }

  public static async create(request: NewMerchantDTO, merchantService: MerchantService): Promise<Merchant> {
    const merchant = new Merchant();
    request.keyPrefix = await merchantService.deriveUniqueKeyPrefix(request.abbr, request.name);
    merchant.apply(new MerchantCreatedEvent(request));
    return merchant;
  }

  private $onMerchantActivatedEvent() {
    this.state.status = MerchantStatus.Active;
  }

  private $onMerchantDeactivatedEvent() {
    this.state.status = MerchantStatus.Inactive;
  }

  private $onMerchantOnboardingCompletedEvent($event: MerchantOnboardingCompletedEvent) {
    this.state.status = MerchantStatus.Active;
    this.state.onboardedAt = $event.payload.onboardedAt;
  }

  private $onMerchantCreatedEvent($event: MerchantCreatedEvent) {
    this.state.id = $event.payload.id;
    this.state.name = $event.payload.name;
    this.state.authId = new UniqueEntityID($event.payload.authId);
    this.state.email = $event.payload.email;
    this.state.currencyCode = $event.payload.currencyCode;
    this.state.status = MerchantStatus.Pending;
    this.state.createdAt = $event.payload.createdAt;
  }
}
