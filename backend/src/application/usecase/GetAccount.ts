import Balance from '../../domain/Balance';
import AccountRepository from '../../infra/repository/AccountRepository';

export default class GetAccount {
  constructor(readonly accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountRepository.getAccountById(accountId);
    const output = {
      accountId: account.getAccountId(),
      name: account.getName(),
      email: account.getEmail(),
      document: account.getDocument(),
      password: account.getPassword(),
      balances: account.balances.map((balance: Balance) => ({
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
