export abstract class IHashingService {
  abstract hashPassword(password: string): Promise<string>;
  abstract comparePassword(password: string, passwordHash: string): Promise<boolean>;
}
