type JWTServiceOption = {
  subject?: string;
  audience?: string;
  ttl?: number;
};

export interface IJWTService {
  sign(data: unknown, option?: JWTServiceOption): Promise<string>;
  verify<T>(token: string, option?: JWTServiceOption): Promise<Result<T>>;
}
