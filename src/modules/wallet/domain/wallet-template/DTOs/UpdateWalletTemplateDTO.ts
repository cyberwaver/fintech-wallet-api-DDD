import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateWalletTemplateDTO {
  @IsNotEmpty()
  name?: string;

  @IsNotEmpty()
  accountTiers?: number[];

  depositPerTxnLimit?: number;
  withdrawalPerTxnLimit?: number;
  transferFromPerTxnLimit?: number;
  transferToPerTxnLimit?: number;
  purchasePerTxnLimit?: number;

  depositPerDayLimit?: number;
  depositCountPerDayLimit?: number;

  withdrawalPerDayLimit?: number;
  withdrawalCountPerDayLimit?: number;

  transferFromPerDayLimit?: number;
  transferFromCountPerDayLimit?: number;
  transferToPerDayLimit?: number;
  transferToCountPerDayLimit?: number;

  purchasePerDayLimit?: number;
  purchaseCountPerDayLimit?: number;

  depositPerWeekLimit?: number;
  depositCountPerWeekLimit?: number;

  withdrawalPerWeekLimit?: number;
  withdrawalCountPerWeekLimit?: number;

  transferFromPerWeekLimit?: number;
  transferFromCountPerWeekLimit?: number;
  transferToPerWeekLimit?: number;
  transferToCountPerWeekLimit?: number;

  purchasePerWeekLimit?: number;
  purchaseCountPerWeekLimit?: number;

  depositPerMonthLimit?: number;
  depositCountPerMonthLimit?: number;

  withdrawalPerMonthLimit?: number;
  withdrawalCountPerMonthLimit?: number;

  transferFromPerMonthLimit?: number;
  transferFromCountPerMonthLimit?: number;
  transferToPerMonthLimit?: number;
  transferToCountPerMonthLimit?: number;

  purchasePerMonthLimit?: number;
  purchaseCountPerMonthLimit?: number;
}
