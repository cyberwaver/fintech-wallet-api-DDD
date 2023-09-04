import 'reflect-metadata';
import { pick } from 'lodash';
import { UniqueEntityID } from '@Common/domain/UniqueEntityID';
import { UserService } from '@Access/domain/user/UserService';
import { Wallet } from '@Wallet/domain/wallet/Wallet';
import { WalletType } from '@Wallet/domain/wallet/WalletType';
import { WalletService } from '@Wallet/domain/WalletService';
import { WalletHolderAccountShouldBeVerified } from '@Wallet/domain/wallet/rules/WalletHolderAccountShouldBeVerified';
import { BusinessRuleViolationException } from '@Common/exceptions/BusinessRuleViolationException';
import { Result } from '@Common/utils/Result';
import { WalletCreatedEvent } from '@Wallet/domain/wallet/events/WalletCreatedEvent';

describe('Create Wallet', () => {
  const userService = {} as UserService;
  const walletService = new WalletService(userService);

  it("fails when user account isn't verified", async () => {
    userService.isAccountVerified = () => Promise.resolve(false);
    const data = { name: 'test', initiatorId: new UniqueEntityID(), type: WalletType.Personal };
    const result = await Result.resolve(Wallet.create(data, walletService));

    expect(result.IS_FAILURE).toBe(true);
    expect(result.error).toBeInstanceOf(BusinessRuleViolationException);
    expect(result.error.name).toBe(WalletHolderAccountShouldBeVerified.name);
  });

  describe('When wallet is created successfully', () => {
    const data = { name: 'test', initiatorId: new UniqueEntityID(), type: WalletType.Personal };
    it("resolves with the wallet, if it's successful", async () => {
      userService.isAccountVerified = () => Promise.resolve(true);
      const result = await Result.resolve(Wallet.create(data, walletService));
      // if (result.IS_FAILURE) throw result.error;
      const wallet = result.value.toJSON();
      console.log(wallet);
      expect(result.IS_SUCCESS).toBe(true);
      // expect(pick(wallet, ["name", ])).toEqual()
    });
    it('raises domain event -> WalletCreatedEvent', async () => {
      userService.isAccountVerified = () => Promise.resolve(true);
      const result = await Result.resolve(Wallet.create(data, walletService));
      const wallet = result.value;
      expect(result.IS_SUCCESS).toBe(true);
      expect(wallet.isDomainEventRaised(WalletCreatedEvent)).toBe(true);
    });
  });
});
