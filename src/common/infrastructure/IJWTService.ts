import { Result } from '@Common/utils/Result';

type JWTServiceOption = {
  subject?: string;
  audience?: string;
  ttl?: string | number;
};

export abstract class IJWTService {
  abstract sign(data: unknown, option?: JWTServiceOption): Promise<Result<string>>;
  abstract verify<T>(token: string, option?: JWTServiceOption): Promise<Result<T>>;
}
