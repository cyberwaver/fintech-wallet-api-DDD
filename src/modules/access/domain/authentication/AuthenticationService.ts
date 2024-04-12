import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IHashingService } from 'src/common/infrastructure/IHashingService';
import { IJWTService } from 'src/common/infrastructure/IJWTService';
import { AuthenticationType } from './AuthenticationType';
import { IAuthenticationsRepository } from './IAuthenticationsRepository';
import { Result } from '@Common/utils/Result';
import { AuthenticationSubject } from './AuthenticationSubject';
import { Injectable } from '@nestjs/common';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type AccessTokenPayload = {
  authId: UniqueEntityID;
  type: AuthenticationType;
  firstName: string;
  lastName: string;
  email: string;
};

type PasswordResetTokenVerifyResult = {
  email: string;
  type: string;
};

type AccessTokenVerifyResult = AccessTokenPayload;

type RefreshTokenVerifyResult = {
  authId: string;
  type: string;
};

@Injectable()
export class AuthenticationService {
  constructor(
    private authsRepo: IAuthenticationsRepository,
    private hashingService: IHashingService,
    private tokenService: IJWTService,
  ) {}

  async authExists(email: string, type: AuthenticationType): Promise<boolean> {
    const result = await this.authsRepo.authExists(email, type.value);
    if (result.IS_FAILURE) return false;
    return result.value;
  }

  async hashPassword(password: string): Promise<string> {
    return this.hashingService.hashPassword(password);
  }

  async comparePassword(password: string, passwordHash: string): Promise<boolean> {
    return this.hashingService.comparePassword(password, passwordHash);
  }

  async generateAuthTokens(data: AccessTokenPayload, type: AuthenticationType): Promise<Result<AuthTokens>> {
    const accessTokenResult = await this.tokenService.sign(data, {
      subject: AuthenticationSubject.Access.toString(),
      audience: type.value,
      ttl: 60 * 30 * 1000,
    });
    const refreshTokenResult = await this.tokenService.sign(
      {
        authId: data.authId,
        type: data.type,
      },
      {
        subject: AuthenticationSubject.Refresh.toString(),
        audience: type.value,
        ttl: 60 * 30 * 1000,
      },
    );

    const result = Result.combine(accessTokenResult, accessTokenResult);
    if (result.IS_FAILURE) return Result.fail(result.error);

    return Result.ok({ accessToken: accessTokenResult.value, refreshToken: refreshTokenResult.value });
  }

  async verifyAccessToken(token: string, type: AuthenticationType): Promise<Result<AccessTokenPayload>> {
    return this.tokenService.verify<AccessTokenVerifyResult>(token, {
      subject: AuthenticationSubject.Access.toString(),
      audience: type.value,
    });
  }

  async verifyRefreshToken(
    token: string,
    type: AuthenticationType,
  ): Promise<Result<RefreshTokenVerifyResult>> {
    return this.tokenService.verify<RefreshTokenVerifyResult>(token, {
      subject: AuthenticationSubject.Refresh.toString(),
      audience: type.value,
    });
  }

  async generatePasswordResetToken(email: string, type: AuthenticationType): Promise<Result<string>> {
    return this.tokenService.sign(
      { email, type: type.value },
      { subject: AuthenticationSubject.PasswordReset.toString(), audience: type.value, ttl: '24h' },
    );
  }

  async verifyPasswordResetToken(
    token: string,
    type: AuthenticationType | string,
  ): Promise<Result<PasswordResetTokenVerifyResult>> {
    return this.tokenService.verify<PasswordResetTokenVerifyResult>(token, {
      subject: AuthenticationSubject.PasswordReset.toString(),
      audience: new AuthenticationType(type).value,
    });
  }
}
