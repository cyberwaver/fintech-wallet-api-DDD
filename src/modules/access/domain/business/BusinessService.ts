import { IBusinessesRepository } from './IBusinessesRepository';

export class BusinessService {
  constructor(private businessesRepo: IBusinessesRepository) {}

  public async deriveUniqueKeyPrefix(abbr: string, name: string): Promise<string> {
    let keyPrefix: string;
    if (!abbr) abbr = name.substring(0, name.length < 3 ? name.length : 3);
    abbr = abbr.toUpperCase();

    let startIndex = 0;
    do {
      const businessExists = await this.businessesRepo.anyExistsWithKeyPrefix(abbr);
      if (businessExists) abbr = `${abbr}${++startIndex}`;
      else keyPrefix = abbr;
    } while (!keyPrefix);

    return keyPrefix;
  }
}
