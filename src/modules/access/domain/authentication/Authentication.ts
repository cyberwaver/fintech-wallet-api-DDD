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

class AuthType {
  type: string;
}

export class AuthenticationProps {
  @Transform(({ value }) => new AuthenticationId(value))
  @Type(() => AuthenticationId)
  id: AuthenticationId;
  @Transform(({ value }) => new AuthenticationType(value))
  @Type(() => AuthenticationType)
  type: AuthenticationType;
  @Type(() => AuthType)
  typo: AuthType;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailVerifiedAt: Date;
  passwordLastResetAt: Date;
  createdAt: Date;
}

export class Authentication extends AggregateRoot<AuthenticationProps> {
  constructor(props?: AuthenticationProps) {
    super(props);
  }

  public async generateTokens(password: string, authService: AuthenticationService): Promise<AuthTokens> {
    const passwordMatches = await authService.comparePassword(password, this.props.password);
    if (!passwordMatches) throw new InvalidCredentialException('Password incorrect.');
    const result = await authService.generateAuthTokens(
      {
        authId: this.props.id,
        type: this.props.type,
        firstName: this.props.firstName,
        lastName: this.props.lastName,
        email: this.props.email,
      },
      this.props.type,
    );
    if (result.IS_FAILURE) throw result.error;

    return result.value;
  }

  public async requestPasswordReset(authService: AuthenticationService): Promise<void> {
    const result = await authService.generatePasswordResetToken(this.props.email, this.props.type);
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

  private $onAuthenticationPasswordResetEvent($event: AuthenticationPasswordResetEvent) {
    this.props.password = $event.payload.passwordHash;
    this.props.passwordLastResetAt = new Date();
  }

  private $onAuthenticationCreatedEvent($event: AuthenticationCreatedEvent) {
    this.props.id = $event.payload.id;
    this.props.type = new AuthenticationType($event.payload.type);
    this.props.firstName = $event.payload.firstName;
    this.props.lastName = $event.payload.lastName;
    this.props.email = $event.payload.email;
    this.props.password = $event.payload.passwordHash;
    this.props.createdAt = new Date();
  }
}
