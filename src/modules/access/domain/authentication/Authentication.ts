import { Type } from 'class-transformer';
import { AggregateRoot } from 'src/common/domain/AggregateRoot';
import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { AuthenticationService, AuthTokens } from './AuthenticationService';
import { AuthenticationType } from './AuthenticationType';
import { NewAuthenticationDTO, PasswordResetDTO } from './dto/dtos.index';
import {
  AuthenticationCreatedEvent,
  AuthenticationPasswordResetEvent,
  AuthenticationPasswordResetRequestedEvent,
} from './events/events.index';
import { AuthEmailShouldBeUniquePerType } from './rules/rules.index';

export class AuthenticationProps {
  id: UniqueEntityID;
  @Type(() => AuthenticationType)
  type: AuthenticationType;
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

  public async matchPassword(
    password: string,
    authService: AuthenticationService,
  ): Promise<boolean> {
    return authService.comparePassword(password, this.props.password);
  }

  public async generateTokens(authService: AuthenticationService): Promise<AuthTokens> {
    return authService.generateAuthTokens(
      {
        authId: this.props.id,
        type: this.props.type,
        firstName: this.props.firstName,
        lastName: this.props.lastName,
        email: this.props.email,
      },
      this.props.type,
    );
  }

  public async requestPasswordReset(authService: AuthenticationService): Promise<void> {
    const token = await authService.generatePasswordResetToken(this.props.email, this.props.type);
    this.apply(new AuthenticationPasswordResetRequestedEvent(token, this.ID));
  }

  public async resetPassword(
    request: PasswordResetDTO,
    authService: AuthenticationService,
  ): Promise<void> {
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
    this.mapToProps($event.payload);
    this.props.password = $event.payload.passwordHash;
    this.props.createdAt = new Date();
  }
}
