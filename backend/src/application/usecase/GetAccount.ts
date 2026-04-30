import Balance from '../../domain/Balance';
import AccountRepository from '../../infra/repository/AccountRepository';
import WalletRepository from '../../infra/repository/WalletRepository';

export default class GetAccount {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly walletRepository: WalletRepository,
  ) {}

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountRepository.getAccountById(accountId);
    const wallet = await this.walletRepository.getWalletByAccountId(accountId);
    const output = {
      accountId: account.getAccountId(),
      name: account.getName(),
      email: account.getEmail(),
      document: account.getDocument(),
      password: account.getPassword(),
      balances: wallet.balances.map((balance: Balance) => ({
        assetId: balance.assetId,
        quantity: balance.quantity,
      })),
    };
    return output;
  }
}

type Output = {
  accountId: string;
  name: string;
  email: string;
  document: string;
  password: string;
  balances: { assetId: string; quantity: number }[];
};
