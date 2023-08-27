import { ValueObject } from 'src/common/domain/ValueObject';
import { WalletLimitType } from './WalletLimitType';
import { WalletTransactionType } from './WalletTransactionType';
import { WalletTemplateProps } from '../wallet-template/WalletTemplate';
import { Amount } from 'src/common/domain/Amount';

type WalletLimitProps = {
  depositPerTxn: number;
  withdrawalPerTxn: number;
  transferFromPerTxn: number;
  transferToPerTxn: number;
  purchasePerTxn: number;

  depositPerDay: number;
  depositCountPerDay: number;

  withdrawalPerDay: number;
  withdrawalCountPerDay: number;

  transferFromPerDay: number;
  transferFromCountPerDay: number;
  transferToPerDay: number;
  transferToCountPerDay: number;

  purchasePerDay: number;
  purchaseCountPerDay: number;

  depositPerWeek: number;
  depositCountPerWeek: number;

  withdrawalPerWeek: number;
  withdrawalCountPerWeek: number;

  transferFromPerWeek: number;
  transferFromCountPerWeek: number;
  transferToPerWeek: number;
  transferToCountPerWeek: number;

  purchasePerWeek: number;
  purchaseCountPerWeek: number;

  depositPerMonth: number;
  depositCountPerMonth: number;

  withdrawalPerMonth: number;
  withdrawalCountPerMonth: number;

  transferFromPerMonth: number;
  transferFromCountPerMonth: number;
  transferToPerMonth: number;
  transferToCountPerMonth: number;

  purchasePerMonth: number;
  purchaseCountPerMonth: number;
};

export class WalletLimit extends ValueObject<WalletLimitProps> {
  constructor(value: WalletLimitProps, private sessionValue = value) {
    super(value);
  }

  public isAmountExceeded(
    amount: Amount,
    transactionType: WalletTransactionType,
    limitType: WalletLimitType,
  ): boolean {
    const limit = this.getValueObj(limitType, transactionType)?.amount ?? Infinity;
    return amount.isGreaterThan(limit);
  }

  public isCountExceeded(
    count: number,
    transactionType: WalletTransactionType,
    limitType: WalletLimitType,
  ): boolean {
    const limit = this.getValueObj(limitType, transactionType)?.count ?? Infinity;
    return count > limit;
  }

  public merge(value: Record<string, unknown>): WalletLimit {
    return new WalletLimit({ ...this.value, ...value }, { ...this.sessionValue, ...value });
  }

  public rebase(templateLimit: WalletTemplateProps): WalletLimit {
    const baseLimit = {
      depositPerTxn: templateLimit.depositPerTxnLimit,
      withdrawalPerTxn: templateLimit.withdrawalPerTxnLimit,
      transferFromPerTxn: templateLimit.transferFromPerTxnLimit,
      transferToPerTxn: templateLimit.transferToPerTxnLimit,
      purchasePerTxn: templateLimit.purchasePerTxnLimit,

      depositPerDay: templateLimit.depositPerDayLimit,
      depositCountPerDay: templateLimit.depositCountPerDayLimit,

      withdrawalPerDay: templateLimit.withdrawalPerDayLimit,
      withdrawalCountPerDay: templateLimit.withdrawalCountPerDayLimit,

      transferFromPerDay: templateLimit.transferFromPerDayLimit,
      transferFromCountPerDay: templateLimit.transferFromCountPerDayLimit,
      transferToPerDay: templateLimit.transferToPerDayLimit,
      transferToCountPerDay: templateLimit.transferToCountPerDayLimit,

      purchasePerDay: templateLimit.purchasePerDayLimit,
      purchaseCountPerDay: templateLimit.purchaseCountPerDayLimit,

      depositPerWeek: templateLimit.depositPerWeekLimit,
      depositCountPerWeek: templateLimit.depositCountPerWeekLimit,

      withdrawalPerWeek: templateLimit.withdrawalPerWeekLimit,
      withdrawalCountPerWeek: templateLimit.withdrawalCountPerWeekLimit,

      transferFromPerWeek: templateLimit.transferFromPerWeekLimit,
      transferFromCountPerWeek: templateLimit.transferFromCountPerWeekLimit,
      transferToPerWeek: templateLimit.transferToPerWeekLimit,
      transferToCountPerWeek: templateLimit.transferToCountPerWeekLimit,

      purchasePerWeek: templateLimit.purchasePerWeekLimit,
      purchaseCountPerWeek: templateLimit.purchaseCountPerWeekLimit,

      depositPerMonth: templateLimit.depositPerMonthLimit,
      depositCountPerMonth: templateLimit.depositCountPerMonthLimit,

      withdrawalPerMonth: templateLimit.withdrawalPerMonthLimit,
      withdrawalCountPerMonth: templateLimit.withdrawalCountPerMonthLimit,

      transferFromPerMonth: templateLimit.transferFromPerMonthLimit,
      transferFromCountPerMonth: templateLimit.transferFromCountPerMonthLimit,
      transferToPerMonth: templateLimit.transferToPerMonthLimit,
      transferToCountPerMonth: templateLimit.transferToCountPerMonthLimit,

      purchasePerMonth: templateLimit.purchasePerWeekLimit,
      purchaseCountPerMonth: templateLimit.purchaseCountPerWeekLimit,
    };
    return new WalletLimit(this.value, { ...baseLimit, ...this.value });
  }

  private getValueObj(
    limitType: WalletLimitType,
    transactionType: WalletTransactionType,
  ): { amount: number; count?: number } {
    const limit = this.TABLE[limitType.value];
    return limit?.[transactionType.value];
  }

  private TABLE = {
    [WalletLimitType.PerTxn.value]: {
      [WalletTransactionType.Deposit.value]: {
        amount: this.sessionValue.depositPerTxn,
      },
      [WalletTransactionType.Purchase.value]: {
        amount: this.sessionValue.purchasePerTxn,
      },
      [WalletTransactionType.Withdrawal.value]: {
        amount: this.sessionValue.withdrawalPerTxn,
      },
      [WalletTransactionType.TransferFrom.value]: {
        amount: this.sessionValue.transferFromPerTxn,
      },
      [WalletTransactionType.TransferTo.value]: {
        amount: this.sessionValue.transferToPerTxn,
      },
    },
    [WalletLimitType.Daily.value]: {
      [WalletTransactionType.Deposit.value]: {
        amount: this.sessionValue.depositPerDay,
        count: this.sessionValue.depositCountPerDay,
      },
      [WalletTransactionType.Purchase.value]: {
        amount: this.sessionValue.purchasePerDay,
        count: this.sessionValue.purchaseCountPerDay,
      },
      [WalletTransactionType.Withdrawal.value]: {
        amount: this.sessionValue.withdrawalPerDay,
        count: this.sessionValue.withdrawalCountPerDay,
      },
      [WalletTransactionType.TransferFrom.value]: {
        amount: this.sessionValue.transferFromPerDay,
        count: this.sessionValue.transferFromCountPerDay,
      },
      [WalletTransactionType.TransferTo.value]: {
        amount: this.sessionValue.transferToPerDay,
        count: this.sessionValue.transferToCountPerDay,
      },
    },
    [WalletLimitType.Weekly.value]: {
      [WalletTransactionType.Deposit.value]: {
        amount: this.sessionValue.depositPerWeek,
        count: this.sessionValue.depositCountPerWeek,
      },
      [WalletTransactionType.Purchase.value]: {
        amount: this.sessionValue.purchasePerWeek,
        count: this.sessionValue.purchaseCountPerWeek,
      },
      [WalletTransactionType.Withdrawal.value]: {
        amount: this.sessionValue.withdrawalPerWeek,
        count: this.sessionValue.withdrawalCountPerWeek,
      },
      [WalletTransactionType.TransferFrom.value]: {
        amount: this.sessionValue.transferFromPerWeek,
        count: this.sessionValue.transferFromCountPerWeek,
      },
      [WalletTransactionType.TransferTo.value]: {
        amount: this.sessionValue.transferToPerWeek,
        count: this.sessionValue.transferToCountPerWeek,
      },
    },
    [WalletLimitType.Monthly.value]: {
      [WalletTransactionType.Deposit.value]: {
        amount: this.sessionValue.depositPerMonth,
        count: this.sessionValue.depositCountPerMonth,
      },
      [WalletTransactionType.Purchase.value]: {
        amount: this.sessionValue.purchasePerMonth,
        count: this.sessionValue.purchaseCountPerMonth,
      },
      [WalletTransactionType.Withdrawal.value]: {
        amount: this.sessionValue.withdrawalPerMonth,
        count: this.sessionValue.withdrawalCountPerMonth,
      },
      [WalletTransactionType.TransferFrom.value]: {
        amount: this.sessionValue.transferFromPerMonth,
        count: this.sessionValue.transferFromCountPerMonth,
      },
      [WalletTransactionType.TransferTo.value]: {
        amount: this.sessionValue.transferToPerMonth,
        count: this.sessionValue.transferToCountPerMonth,
      },
    },
  };

  public static TABLE = {
    [WalletLimitType.PerTxn.value]: {
      [WalletTransactionType.Deposit.value]: {
        amountMessage: 'transaction limit exceeded for total amount of deposits.',
        countMessage: '',
      },
      [WalletTransactionType.Purchase.value]: {
        amountMessage: 'transaction limit exceeded for total amount of purchases.',
        countMessage: '',
      },
      [WalletTransactionType.Withdrawal.value]: {
        amountMessage: 'transaction limit exceeded for total amount of withdrawals.',
        countMessage: '',
      },
      [WalletTransactionType.TransferFrom.value]: {
        amountMessage: 'transaction limit exceeded for total amount of debit transfers.',
        countMessage: '',
      },
      [WalletTransactionType.TransferTo.value]: {
        amountMessage: 'transaction limit exceeded for total amount of credit transfers.',
        countMessage: '',
      },
    },
    [WalletLimitType.Daily.value]: {
      [WalletTransactionType.Deposit.value]: {
        amountMessage: 'Daily limit exceeded for total amount of deposit transaction.',
        countMessage: 'Daily limit exceeded for number of deposit transactions.',
      },
      [WalletTransactionType.Purchase.value]: {
        amountMessage: 'Daily limit exceeded for total amount of purchase transaction.',
        countMessage: 'Daily limit exceeded for number of purchase transactions.',
      },
      [WalletTransactionType.Withdrawal.value]: {
        amountMessage: 'Daily limit exceeded for total amount of withdrawal transaction.',
        countMessage: 'Daily limit exceeded for number of withdrawal transactions.',
      },
      [WalletTransactionType.TransferFrom.value]: {
        amountMessage: 'Daily limit exceeded for total amount of debit transfer transaction.',
        countMessage: 'Daily limit exceeded for number of debit transfer transactions.',
      },
      [WalletTransactionType.TransferTo.value]: {
        amountMessage: 'Daily limit exceeded for total amount of credit transfer transaction.',
        countMessage: 'Daily limit exceeded for number of credit transfer transactions.',
      },
    },
    [WalletLimitType.Weekly.value]: {
      [WalletTransactionType.Deposit.value]: {
        amountMessage: 'Weekly limit exceeded for total amount of deposit transaction.',
        countMessage: 'Weekly limit exceeded for number of deposit transactions.',
      },
      [WalletTransactionType.Purchase.value]: {
        amountMessage: 'Weekly limit exceeded for total amount of purchase transaction.',
        countMessage: 'Weekly limit exceeded for number of purchase transactions.',
      },
      [WalletTransactionType.Withdrawal.value]: {
        amountMessage: 'Weekly limit exceeded for total amount of withdrawal transaction.',
        countMessage: 'Weekly limit exceeded for number of withdrawal transactions.',
      },
      [WalletTransactionType.TransferFrom.value]: {
        amountMessage: 'Weekly limit exceeded for total amount of debit transfer transaction.',
        countMessage: 'Weekly limit exceeded for number of debit transfer transactions.',
      },
      [WalletTransactionType.TransferTo.value]: {
        amountMessage: 'Weekly limit exceeded for total amount of credit transfer transaction.',
        countMessage: 'Weekly limit exceeded for number of credit transfer transactions.',
      },
    },
    [WalletLimitType.Monthly.value]: {
      [WalletTransactionType.Deposit.value]: {
        amountMessage: 'Monthly limit exceeded for total amount of deposit transaction.',
        countMessage: 'Monthly limit exceeded for number of deposit transactions.',
      },
      [WalletTransactionType.Purchase.value]: {
        amountMessage: 'Monthly limit exceeded for total amount of purchase transaction.',
        countMessage: 'Monthly limit exceeded for number of purchase transactions.',
      },
      [WalletTransactionType.Withdrawal.value]: {
        amountMessage: 'Monthly limit exceeded for total amount of withdrawal transaction.',
        countMessage: 'Monthly limit exceeded for number of withdrawal transactions.',
      },
      [WalletTransactionType.TransferFrom.value]: {
        amountMessage: 'Monthly limit exceeded for total amount of debit transfer transaction.',
        countMessage: 'Monthly limit exceeded for number of debit transfer transactions.',
      },
      [WalletTransactionType.TransferTo.value]: {
        amountMessage: 'Monthly limit exceeded for total amount of credit transfer transaction.',
        countMessage: 'Monthly limit exceeded for number of credit transfer transactions.',
      },
    },
  };
}
