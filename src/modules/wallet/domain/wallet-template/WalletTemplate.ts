import { merge } from 'lodash';
import { AggregateRoot } from 'src/common/domain/AggregateRoot';
import { WalletLimit } from '../wallet/WalletLimit';
import { NewWalletTemplateDTO, UpdateWalletTemplateDTO } from './DTOs/dtos.index';
import { WalletTemplatedCreatedEvent, WalletTemplateUpdatedEvent } from './events/events.index';
import { WalletTemplateId } from './WalletTemplateId';
import { AccountTier } from '@Access/domain/user/AccountTier';
import { Transform } from 'class-transformer';

export class WalletTemplateState {
  id: WalletTemplateId;
  name: string;

  @Transform(({ value }) => new AccountTier(value))
  accountTiers: AccountTier[];

  depositPerTxnLimit = Infinity;
  withdrawalPerTxnLimit = Infinity;
  transferFromPerTxnLimit = Infinity;
  transferToPerTxnLimit = Infinity;
  purchasePerTxnLimit = Infinity;

  depositPerDayLimit = Infinity;
  depositCountPerDayLimit = Infinity;

  withdrawalPerDayLimit = Infinity;
  withdrawalCountPerDayLimit = Infinity;

  transferFromPerDayLimit = Infinity;
  transferFromCountPerDayLimit = Infinity;
  transferToPerDayLimit = Infinity;
  transferToCountPerDayLimit = Infinity;

  purchasePerDayLimit = Infinity;
  purchaseCountPerDayLimit = Infinity;

  depositPerWeekLimit = Infinity;
  depositCountPerWeekLimit = Infinity;

  withdrawalPerWeekLimit = Infinity;
  withdrawalCountPerWeekLimit = Infinity;

  transferFromPerWeekLimit = Infinity;
  transferFromCountPerWeekLimit = Infinity;
  transferToPerWeekLimit = Infinity;
  transferToCountPerWeekLimit = Infinity;

  purchasePerWeekLimit = Infinity;
  purchaseCountPerWeekLimit = Infinity;

  depositPerMonthLimit = Infinity;
  depositCountPerMonthLimit = Infinity;

  withdrawalPerMonthLimit = Infinity;
  withdrawalCountPerMonthLimit = Infinity;

  transferFromPerMonthLimit = Infinity;
  transferFromCountPerMonthLimit = Infinity;
  transferToPerMonthLimit = Infinity;
  transferToCountPerMonthLimit = Infinity;

  purchasePerMonthLimit = Infinity;
  purchaseCountPerMonthLimit = Infinity;

  createdAt: Date;
  updatedAt: Date;

  private $onWalletTemplatedCreatedEvent($event: WalletTemplatedCreatedEvent) {
    merge(this, $event.payload);
    this.createdAt = new Date();
  }

  private $onWalletTemplateUpdatedEvent($event: WalletTemplateUpdatedEvent) {
    merge(this, $event.payload);
    this.updatedAt = new Date();
  }
}

export class WalletTemplate extends AggregateRoot<WalletTemplateState> {
  constructor(dto?: WalletTemplateState) {
    super(dto);
  }

  public update(request: UpdateWalletTemplateDTO): void {
    this.apply(new WalletTemplateUpdatedEvent(request, this.ID));
  }

  public constructLimit(limit: WalletLimit): WalletLimit {
    return limit.rebase(this.state);
  }

  public static async create(request: NewWalletTemplateDTO): Promise<WalletTemplate> {
    const template = new WalletTemplate();
    template.apply(new WalletTemplatedCreatedEvent(request, template.ID));
    return template;
  }
}
