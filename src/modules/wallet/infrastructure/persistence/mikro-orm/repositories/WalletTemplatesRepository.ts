import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { WalletTemplateId } from '@Wallet/domain/wallet-template/WalletTemplateId';
import { WalletTemplate, WalletTemplateState } from '@Wallet/domain/wallet-template/WalletTemplate';
import { EntityManager, EntityRepository, FilterQuery, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { WalletTemplate as WalletTemplateEntity } from '../entities/WalletTemplate';
import { Result } from '@Common/utils/Result';
import { UniqueEntityID } from '@Common/domain/UniqueEntityID';
import ARepository from '@Common/infrastructure/persistence/mikro-orm/ARepository';
import { AggregateRoot } from '@Common/utils/decorators';
import { IWalletTemplatesRepository } from '@Wallet/domain/wallet-template/IWalletTemplatesRepository';
import { NotFoundException } from '@Common/exceptions/NotFoundException';

@Injectable()
@AggregateRoot(WalletTemplate)
export default class WalletTemplatesRepository
  extends ARepository<WalletTemplateEntity, WalletTemplate>
  implements IWalletTemplatesRepository
{
  e: WalletTemplate;

  constructor(em: EntityManager) {
    super('Wallet Template', em, WalletTemplateEntity);
  }

  async templateExists(email: string, type: string): Promise<Result<boolean>> {
    const result = await this.findOne({ email, type });
    return Result.ok(result.IS_SUCCESS);
  }

  async findByIds(ids: string[] | UniqueEntityID[]): Promise<Result<WalletTemplate[], Error>> {
    throw new Error('Method not implemented.');
  }

  async sync(walletTemplate: WalletTemplate): Promise<Result<void, Error>> {
    let templateEntity: WalletTemplateEntity;
    if (walletTemplate.ID.isNew) templateEntity = new WalletTemplateEntity();
    else {
      templateEntity = await this.dao.findOne({ id: walletTemplate.ID.toString() });
      if (!templateEntity) return Result.fail(new NotFoundException('Wallet template not found'));
    }

    templateEntity.assign(walletTemplate.toObject());
    this.em.persist(templateEntity);

    return Result.ok();
  }

  async findOneByEmailAndType(email: string, type: string): Promise<Result<WalletTemplate>> {
    return this.findOne({ email, type });
  }

  async findById(id: WalletTemplateId): Promise<Result<WalletTemplate>> {
    return this.findOne({ id: id.toString() });
  }

  async findOne(where: FilterQuery<WalletTemplateEntity>): Promise<Result<WalletTemplate>> {
    try {
      const response = await this.dao.findOne(where);
      if (!response) return Result.fail(new NotFoundException('Wallet template not found'));
      const props = plainToClass(WalletTemplateState, response.toPOJO());
      return Result.ok(new WalletTemplate(props));
    } catch (e) {
      return Result.fail(e);
    }
  }

  async count(where: FilterQuery<WalletTemplateEntity>): Promise<Result<number>> {
    return Result.resolve(this.dao.count(where));
  }
}
