import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import { User } from '@Access/domain/user/User';
import { User as UserEntity } from '../entities/User';
import { BankAccount as BankAccountEntity } from '../entities/BankAccount';
import BaseRepository from './BaseRepository';
import { plainToInstance } from 'class-transformer';
import { UserId } from '@Access/domain/user/UserId';

@Injectable()
export default class UsersRepository extends BaseRepository<User> {
  private userDao: EntityRepository<UserEntity>;
  private bankAccountDao: EntityRepository<BankAccountEntity>;
  constructor(em: EntityManager) {
    super();
    this.userDao = em.getRepository(UserEntity);
    this.bankAccountDao = em.getRepository(BankAccountEntity);
  }

  async findById(id: UserId): Promise<User> {
    return this.findOne({ id: id.toString() });
  }

  async findOne(where: FilterQuery<UserEntity>): Promise<User> {
    const response = await this.userDao.findOneOrFail(where);
    return plainToInstance(User, response.toPOJO);
  }
}
