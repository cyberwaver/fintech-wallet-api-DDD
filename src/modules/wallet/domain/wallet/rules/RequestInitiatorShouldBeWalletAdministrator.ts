import * as _ from 'lodash';
import { BusinessRule } from 'src/common/domain/rule/BusinessRule';
import { WalletHolder } from '../WalletHolder';

export class RequestInitiatorShouldBeWalletAdministrator extends BusinessRule {
  message = 'Request can only be initiated by wallet administrator.';
  constructor(private initiator: WalletHolder, message?: string) {
    super();
    this.message = message ?? this.message;
  }

  public isBroken(): boolean {
    return !this.initiator.IS_ADMIN;
  }
}
