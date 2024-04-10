import { Type } from 'class-transformer';
import { AggregateRoot } from 'src/common/domain/AggregateRoot';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { NewUserDTO, UserOnboardingRuleValidatedDTO, UserOnboardingUpdateDTO } from './dto/dtos.index';
import {
  UserActivatedEvent,
  UserCreatedEvent,
  UserDeactivatedEvent,
  UserOnboardingCompletedEvent,
  UserOnboardingCompletionInitiatedEvent,
  UserOnboardingRuleValidationRecordedEvent,
  UserOnboardingUpdatedEvent,
  UserOnboardingValidationFailedEvent,
} from './events/events.index';
import { UserStatus } from './UserStatus';
import {
  UserOnboardingShouldBeValidating,
  UserShouldBeActive,
  UserShouldBeInactive,
  UserShouldBeOnboarding,
} from './rules/rules.index';
import { Address } from 'src/common/domain/Address';
import { BankAccount } from 'src/modules/access/domain/user/BankAccount';
import { ValidationRule } from './ValidationRule';

export class UserProps {
  @Type(() => UniqueEntityID)
  id: UniqueEntityID;
  @Type(() => UniqueEntityID)
  authId: UniqueEntityID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  @Type(() => UserStatus)
  status: UserStatus;
  bvn: string;
  @Type(() => Address)
  address: Address;
  @Type(() => BankAccount)
  bankAccounts: BankAccount[];
  avatarUploadId: string;
  avatarUploadURL: string;
  @Type(() => ValidationRule)
  validationRules: ValidationRule[];
  onboardedAt: Date;
  createdAt: Date;
}

export class User extends AggregateRoot<UserProps> {
  constructor(props?: UserProps) {
    super(props);
  }

  public get status(): UserStatus {
    return this.props.status;
  }

  public async activate(): Promise<void> {
    await this.checkRule(new UserShouldBeInactive(this.props.status));
    this.apply(new UserActivatedEvent(this.ID));
  }

  public async deactivate(): Promise<void> {
    await this.checkRule(new UserShouldBeActive(this.props.status));
    this.apply(new UserDeactivatedEvent(this.ID));
  }

  public async updateOnboarding(request: UserOnboardingUpdateDTO): Promise<void> {
    await this.checkRule(new UserShouldBeOnboarding(this.props.status));
    this.apply(new UserOnboardingUpdatedEvent(request, this.ID));
  }

  public async initiateOnboardingCompletion(): Promise<void> {
    await this.checkRule(new UserShouldBeOnboarding(this.props.status));
    this.apply(new UserOnboardingCompletionInitiatedEvent(this.ID));
  }

  public async recordOnboardingRuleValidation(request: UserOnboardingRuleValidatedDTO): Promise<void> {
    await this.checkRule(new UserOnboardingShouldBeValidating(this.props.status));
    this.apply(new UserOnboardingRuleValidationRecordedEvent(request, this.ID));
    if (!request.passed) this.apply(new UserOnboardingValidationFailedEvent(this.ID));
  }

  public async completeOnboarding(): Promise<void> {
    await this.checkRule(new UserOnboardingShouldBeValidating(this.props.status));
    this.apply(new UserOnboardingCompletedEvent(this.ID));
  }

  public static async create(request: NewUserDTO): Promise<User> {
    const user = new User();
    user.apply(new UserCreatedEvent(request));
    return user;
  }

  private $onUserActivatedEvent() {
    this.props.status = UserStatus.Active;
  }

  private $onUserDeactivatedEvent() {
    this.props.status = UserStatus.Inactive;
  }

  private $onUserOnboardingUpdatedEvent($event: UserOnboardingUpdatedEvent) {
    this.props.firstName = $event.payload.firstName;
    this.props.lastName = $event.payload.lastName;
    this.props.phone = $event.payload.phone;
    this.props.bvn = $event.payload.bvn;
    this.props.address = new Address($event.payload.address);
  }

  private $onUserOnboardingCompletionInitiatedEvent() {
    this.props.status = UserStatus.Validating;
    this.props.validationRules.push(ValidationRule.CheckBVN);
    this.props.validationRules.push(ValidationRule.CheckDefaultBankAccount);
  }

  private $onUserOnboardingRuleValidationRecordedEvent($event: UserOnboardingRuleValidationRecordedEvent) {
    const rule = this.props.validationRules.find((rule) => rule.value.label == $event.payload.label);
    if (!rule) return;
    this.props.validationRules = this.props.validationRules.filter(
      (rule) => rule.value.label !== $event.payload.label,
    );
    this.props.validationRules.push(new ValidationRule($event.payload));
  }

  private $onUserOnboardingCompletedEvent($event: UserOnboardingCompletedEvent) {
    this.props.status = UserStatus.Active;
    this.props.onboardedAt = $event.payload.onboardedAt;
  }

  private $onUserOnboardingValidationFailedEvent() {
    this.props.status = UserStatus.ValidationFailed;
  }

  private $onUserCreatedEvent($event: UserCreatedEvent) {
    this.props.id = $event.payload.id;
    this.props.email = $event.payload.email;
    this.props.firstName = $event.payload.firstName;
    this.props.lastName = $event.payload.lastName;
    this.props.authId = new UniqueEntityID($event.payload.authId);
    this.props.status = UserStatus.Pending;
    this.props.createdAt = $event.payload.createdAt;
  }
}
