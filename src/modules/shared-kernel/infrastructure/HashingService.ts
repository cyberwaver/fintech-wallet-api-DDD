import * as bcrypt from 'bcrypt';
import { IHashingService } from '@Common/infrastructure/IHashingService';

export default class HashingService implements IHashingService {
  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  comparePassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
