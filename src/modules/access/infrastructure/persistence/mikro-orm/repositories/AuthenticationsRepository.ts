import { Injectable } from '@nestjs/common';
import { instanceToInstance, plainToClass, plainToClassFromExist, plainToInstance } from 'class-transformer';
import { AuthenticationId } from '@Access/domain/authentication/AuthenticationId';
import { Authentication, AuthenticationProps } from '@Access/domain/authentication/Authentication';
import { EntityManager, EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import { Authentication as AuthenticationEntity } from '../entities/Authentication';
import { Result } from '@Common/utils/Result';
import { UniqueEntityID } from '@Common/domain/UniqueEntityID';
import ARepository from '@Common/infrastructure/ARepository';
import { ForAggregateRoot } from '@Common/utils/decorators';
import { IAuthenticationsRepository } from '@Access/domain/authentication/IAuthenticationsRepository';
import { NotFoundException } from '@Common/exceptions/NotFoundException';

@Injectable()
@ForAggregateRoot(Authentication)
export default class AuthenticationsRepository
  extends ARepository<Authentication>
  implements IAuthenticationsRepository
{
  e: Authentication;
  private authenticationDao: EntityRepository<AuthenticationEntity>;
  constructor(private em: EntityManager) {
    super();
    this.authenticationDao = em.getRepository(AuthenticationEntity);
  }

  async authExists(email: string, type: string): Promise<Result<boolean>> {
    const result = await this.findOne({ email, type });
    return Result.ok(result.IS_SUCCESS);
  }

  async recordExistsForFilter(filter: Record<string, unknown>): Promise<Result<boolean>> {
    const result = await this.count(filter);
    if (result.IS_FAILURE) return Result.fail(result.error);
    return Result.ok(result.value > 0);
  }

  async findByIds(ids: string[] | UniqueEntityID[]): Promise<Result<Authentication[], Error>> {
    throw new Error('Method not implemented.');
  }

  async sync(authentication: Authentication): Promise<Result<void, Error>> {
    let authEntity: AuthenticationEntity;
    if (authentication.ID.isNew) authEntity = new AuthenticationEntity();
    else {
      authEntity = await this.authenticationDao.findOne({ id: authentication.ID.toString() });
      if (!authEntity) return Result.fail(new NotFoundException('Authentication not found'));
    }

    authEntity.assign(authentication.toObject());
    this.em.persist(authEntity);

    return Result.ok();
  }

  async findOneByEmailAndType(email: string, type: string): Promise<Result<Authentication>> {
    return this.findOne({ email, type });
  }

  async findById(id: AuthenticationId): Promise<Result<Authentication>> {
    return this.findOne({ id: id.toString() });
  }

  async findOne(where: FilterQuery<AuthenticationEntity>): Promise<Result<Authentication>> {
    try {
      const response = await this.authenticationDao.findOne(where);
      if (!response) return Result.fail(new NotFoundException('Authentication not found'));
      const props = plainToClass(AuthenticationProps, response.toPOJO());
      return Result.ok(new Authentication(props));
    } catch (e) {
      return Result.fail(e);
    }
  }

  async count(where: FilterQuery<AuthenticationEntity>): Promise<Result<number>> {
    return Result.resolve(this.authenticationDao.count(where));
  }
}
