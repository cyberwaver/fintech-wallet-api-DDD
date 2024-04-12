import { ApplicationException } from '@Common/exceptions/ApplicationException';
import { IJWTService } from '@Common/infrastructure/IJWTService';
import { Result } from '@Common/utils/Result';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { DateTime, Duration } from 'luxon';

@Injectable()
export default class JWTService implements IJWTService {
  constructor(private configService: ConfigService) {}

  sign(
    data: unknown,
    option?: { subject?: string; audience?: string; ttl?: number | string },
  ): Promise<Result<string>> {
    const _option = {
      expiresIn: option.ttl,
      subject: option.subject,
      audience: option.audience,
      algorithm: 'RS256',
    };

    if (typeof option.ttl == 'number') {
      _option.expiresIn = DateTime.now()
        .plus(Duration.fromMillis(option.ttl * 1000))
        .toMillis();
      _option.expiresIn = _option.expiresIn / 1000;
    }

    return Result.resolve(jwt.sign(data, this.configService.get<string>('rsa.private'), _option));
  }

  verify<T>(token: string, option: { subject?: string; audience?: string } = {}): Promise<Result<T, Error>> {
    return Result.resolve(
      new Promise((resolve, reject) => {
        jwt.verify(
          token,
          this.configService.get<string>('rsa.public'),
          { algorithms: ['RS256'], ...option },
          (err, decoded) => {
            if (!err) return resolve(decoded);
            return reject(new ApplicationException('Token has expired or its invalid'));
          },
        );
      }),
    );
  }
}
