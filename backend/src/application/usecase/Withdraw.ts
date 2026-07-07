import { inject } from '../../infra/di/Registry';
import AccountRepository from '../../infra/repository/AccountRepository';
import WalletRepository from '../../infra/repository/WalletRepository';

export default class Withdraw {
  @inject('accountRepository')
  accountRepository!: AccountRepository;
  @inject('walletRepository')
  walletRepository!: WalletRepository;

  async execute(input: Input): Promise<void> {
    const account = await this.accountRepository.getAccountById(
      input.accountId,
    );
    if (!account) throw new Error('Account not found');
    const wallet = await this.walletRepository.getWalletByAccountId(
      input.accountId,
    );
    wallet.withdraw(input.assetId, input.quantity);
    await this.walletRepository.updateWallet(wallet);
  }
}

type Input = {
  accountId: string;
  assetId: string;
  quantity: number;
};
