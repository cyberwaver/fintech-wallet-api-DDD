import { UniqueEntityID } from 'src/common/domain/UniqueEntityID';
import { IMerchantsRepository } from './IMerchantsRepository';

export class MerchantService {
  constructor(private merchantsRepo: IMerchantsRepository) {}

  public async deriveUniqueKeyPrefix(abbr: string, name: string): Promise<string> {
    let keyPrefix;
    if (!abbr) abbr = name.substr(0, name.length < 3 ? name.length : 3);
    abbr = abbr.toUpperCase();

    let startIndex = 0;
    do {
      const merchantExists = await this.merchantsRepo.anyExistsWithKeyPrefix(abbr);
      if (merchantExists) abbr = `${abbr}${++startIndex}`;
      else keyPrefix = abbr;
    } while (!keyPrefix);

    return keyPrefix;
  }
}
