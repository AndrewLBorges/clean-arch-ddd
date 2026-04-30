import AccountRepository from '../../infra/repository/AccountRepository';
import WalletRepository from '../../infra/repository/WalletRepository';

export default class Withdraw {
  constructor(
    readonly acctountRepository: AccountRepository,
    readonly walletRepository: WalletRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const account = await this.acctountRepository.getAccountById(
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
