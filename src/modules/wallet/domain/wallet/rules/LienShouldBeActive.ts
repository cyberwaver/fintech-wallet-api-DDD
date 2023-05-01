import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletLien } from '../WalletLien';

export class LienShouldBeActive extends BusinessRule {
  message = 'Lien is not eligible for release';
  constructor(private lien: WalletLien) {
    super();
  }

  public isBroken(): boolean {
    return !this.lien.status.IS_ACTIVE;
  }
}
