import { Transform, Type } from 'class-transformer';
import { AggregateRoot } from 'src/common/domain/AggregateRoot';
import { AuthenticationService, AuthTokens } from './AuthenticationService';
import { AuthenticationType } from './AuthenticationType';
import { NewAuthenticationDTO, PasswordResetDTO } from './dto/dtos.index';
import {
  AuthenticationCreatedEvent,
  AuthenticationPasswordResetEvent,
  AuthenticationPasswordResetRequestedEvent,
} from './events/events.index';
import { AuthEmailShouldBeUniquePerType } from './rules/rules.index';
import { AuthenticationId } from './AuthenticationId';
import { InvalidCredentialException } from '@Common/exceptions/InvalidCredentialException';

export class AuthenticationState {
  @Transform(({ value }) => new AuthenticationId(value))
  @Type(() => AuthenticationId)
  id: AuthenticationId;
  @Transform(({ value }) => new AuthenticationType(value))
  @Type(() => AuthenticationType)
  type: AuthenticationType;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailVerifiedAt: Date;
  passwordLastResetAt: Date;
  createdAt: Date;

  private $onAuthenticationPasswordResetEvent($event: AuthenticationPasswordResetEvent) {
    this.password = $event.payload.passwordHash;
    this.passwordLastResetAt = new Date();
  }

  private $onAuthenticationCreatedEvent($event: AuthenticationCreatedEvent) {
    this.id = $event.payload.id;
    this.type = new AuthenticationType($event.payload.type);
    this.firstName = $event.payload.firstName;
    this.lastName = $event.payload.lastName;
    this.email = $event.payload.email;
    this.password = $event.payload.passwordHash;
    this.createdAt = new Date();
  }
}

export class Authentication extends AggregateRoot<AuthenticationState> {
  constructor(state?: AuthenticationState) {
    super(state ?? new AuthenticationState());
  }

  get type(): AuthenticationType {
    return this.state.type;
  }

  get email(): string {
    return this.state.email;
  }

  get password(): string {
    return this.state.password;
  }

  get firstName(): string {
    return this.state.firstName;
  }

  get lastName(): string {
    return this.state.lastName;
  }

  public async requestPasswordReset(authService: AuthenticationService): Promise<void> {
    const result = await authService.generatePasswordResetToken(this.state.email, this.state.type);
    if (result.IS_FAILURE) throw result.error;
    this.apply(new AuthenticationPasswordResetRequestedEvent(result.value, this.ID));
  }

  public async resetPassword(request: PasswordResetDTO, authService: AuthenticationService): Promise<void> {
    const passwordHash = await authService.hashPassword(request.password);
    this.apply(new AuthenticationPasswordResetEvent({ passwordHash }, this.ID));
  }

  public static async create(
    request: NewAuthenticationDTO,
    authService: AuthenticationService,
  ): Promise<Authentication> {
    const authentication = new Authentication();
    await authentication.checkRule(
      new AuthEmailShouldBeUniquePerType(request.email, request.type, authService),
    );
    request.passwordHash = await authService.hashPassword(request.password);
    authentication.apply(new AuthenticationCreatedEvent(request));
    return authentication;
  }
}
