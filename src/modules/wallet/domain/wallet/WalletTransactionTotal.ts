import { Amount } from 'src/common/domain/Amount';
import { ValueObject } from 'src/common/domain/ValueObject';
import { WalletLimitType } from './WalletLimitType';
import { WalletTransactionType } from './WalletTransactionType';

type WalletTransactionTotalProps = {
  depositPerDay: number;
  withdrawalPerDay: number;
  transferFromPerDay: number;
  transferToPerDay: number;
  purchasePerDay: number;
  depositPerWeek: number;
  withdrawalPerWeek: number;
  transferFromPerWeek: number;
  transferToPerWeek: number;
  purchasePerWeek: number;
  depositPerMonth: number;
  withdrawalPerMonth: number;
  transferFromPerMonth: number;
  transferToPerMonth: number;
  purchasePerMonth: number;
};

export class WalletTransactionTotal extends ValueObject<WalletTransactionTotalProps> {
  constructor(value: WalletTransactionTotalProps) {
    super(value);
  }

  public getValue(limitType: WalletLimitType, transactionType: WalletTransactionType): Amount {
    return new Amount(this.getValueObj(limitType, transactionType).value ?? Infinity);
  }

  public increment(transactionType: WalletTransactionType): WalletTransactionTotal {
    const day = this.getValueObj(WalletLimitType.Daily, transactionType);
    const week = this.getValueObj(WalletLimitType.Weekly, transactionType);
    const month = this.getValueObj(WalletLimitType.Monthly, transactionType);
    return this.merge({
      [day.field]: day.value + 1,
      [week.field]: week.value + 1,
      [month.field]: month.value + 1,
    });
  }

  public merge(value: Record<string, unknown>): WalletTransactionTotal {
    return new WalletTransactionTotal({ ...this.value, ...value });
  }

  private getValueObj(
    limitType: WalletLimitType,
    transactionType: WalletTransactionType,
  ): { value: number; field: string } {
    const limit = this.TABLE[limitType.value];
    return limit?.[transactionType.value];
  }

  private TABLE = {
    [WalletLimitType.Daily.value]: {
      [WalletTransactionType.Deposit.value]: {
        value: this.value.depositPerDay,
        field: 'depositPerDay',
      },
      [WalletTransactionType.Purchase.value]: {
        value: this.value.purchasePerDay,
        field: 'purchasePerDay',
      },
      [WalletTransactionType.Withdrawal.value]: {
        value: this.value.withdrawalPerDay,
        field: 'withdrawalPerDay',
      },
      [WalletTransactionType.TransferFrom.value]: {
        value: this.value.transferFromPerDay,
        field: 'transferFromPerDay',
      },
      [WalletTransactionType.TransferTo.value]: {
        value: this.value.transferToPerDay,
        field: 'transferToPerDay',
      },
    },
    [WalletLimitType.Weekly.value]: {
      [WalletTransactionType.Deposit.value]: {
        value: this.value.depositPerWeek,
        field: 'depositPerWeek',
      },
      [WalletTransactionType.Purchase.value]: {
        value: this.value.purchasePerWeek,
        field: 'purchasePerWeek',
      },
      [WalletTransactionType.Withdrawal.value]: {
        value: this.value.withdrawalPerWeek,
        field: 'withdrawalPerWeek',
      },
      [WalletTransactionType.TransferFrom.value]: {
        value: this.value.transferFromPerWeek,
        field: 'transferFromPerWeek',
      },
      [WalletTransactionType.TransferTo.value]: {
        value: this.value.transferToPerWeek,
        field: 'transferToPerWeek',
      },
    },
    [WalletLimitType.Monthly.value]: {
      [WalletTransactionType.Deposit.value]: {
        value: this.value.depositPerMonth,
        field: 'depositPerMonth',
      },
      [WalletTransactionType.Purchase.value]: {
        value: this.value.purchasePerMonth,
        field: 'purchasePerMonth',
      },
      [WalletTransactionType.Withdrawal.value]: {
        value: this.value.withdrawalPerMonth,
        field: 'withdrawalPerMonth',
      },
      [WalletTransactionType.TransferFrom.value]: {
        value: this.value.transferFromPerMonth,
        field: 'transferFromPerMonth',
      },
      [WalletTransactionType.TransferTo.value]: {
        value: this.value.transferToPerMonth,
        field: 'transferToPerMonth',
      },
    },
  };
}
